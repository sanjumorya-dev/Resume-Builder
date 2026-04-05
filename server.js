const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    current_content TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS resume_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    snapshot_title TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resume_id, version_number),
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
  );
`);

const ensureUserStmt = db.prepare(`
  INSERT INTO users (email, name)
  VALUES (@email, @name)
  ON CONFLICT(email) DO UPDATE SET name = COALESCE(excluded.name, users.name)
  RETURNING id, email, name
`);
const findUserByIdStmt = db.prepare('SELECT id, email, name FROM users WHERE id = ?');
const createResumeStmt = db.prepare(
  'INSERT INTO resumes (user_id, title, current_content) VALUES (?, ?, ?)'
);
const createVersionStmt = db.prepare(
  'INSERT INTO resume_versions (resume_id, version_number, content, snapshot_title) VALUES (?, ?, ?, ?)'
);
const listResumesStmt = db.prepare(
  'SELECT id, title, current_content, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC'
);
const getResumeStmt = db.prepare(
  'SELECT id, user_id, title, current_content, created_at, updated_at FROM resumes WHERE id = ?'
);
const updateResumeStmt = db.prepare(
  'UPDATE resumes SET title = ?, current_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
);
const deleteResumeStmt = db.prepare('DELETE FROM resumes WHERE id = ?');
const listVersionsStmt = db.prepare(
  'SELECT id, resume_id, version_number, snapshot_title, created_at FROM resume_versions WHERE resume_id = ? ORDER BY version_number DESC'
);
const getVersionStmt = db.prepare(
  'SELECT id, resume_id, version_number, content, snapshot_title, created_at FROM resume_versions WHERE id = ? AND resume_id = ?'
);
const latestVersionNumberStmt = db.prepare(
  'SELECT COALESCE(MAX(version_number), 0) AS max_version FROM resume_versions WHERE resume_id = ?'
);

function parseInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function normalizeResumeInput({ title, content }, fallbackTitle = 'Untitled Resume', fallbackContent = '') {
  const safeTitle = typeof title === 'string' ? title.trim() : '';
  const safeContent = typeof content === 'string' ? content : fallbackContent;
  return {
    title: safeTitle || fallbackTitle,
    content: safeContent
  };
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  try {
    const userIdHeader = req.header('x-user-id');
    const emailHeader = req.header('x-user-email') || 'demo@example.com';
    const nameHeader = req.header('x-user-name') || 'Demo User';

    if (userIdHeader) {
      const userId = parseInteger(userIdHeader);
      if (!userId || userId < 1) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const existing = findUserByIdStmt.get(userId);
      if (!existing) {
        return res.status(401).json({ error: 'Unknown user ID' });
      }
      req.user = existing;
      return next();
    }

    req.user = ensureUserStmt.get({ email: emailHeader, name: nameHeader });
    next();
  } catch (error) {
    next(error);
  }
});

function assertResumeOwnership(resumeId, userId) {
  const resume = getResumeStmt.get(resumeId);
  if (!resume || resume.user_id !== userId) {
    return null;
  }
  return resume;
}

app.get('/api/resumes', (req, res) => {
  const resumes = listResumesStmt.all(req.user.id);
  res.json({ resumes });
});

app.post('/api/resumes', (req, res) => {
  const { title, content } = normalizeResumeInput(req.body || {});

  const tx = db.transaction(() => {
    const result = createResumeStmt.run(req.user.id, title, content);
    const resumeId = result.lastInsertRowid;
    createVersionStmt.run(resumeId, 1, content, title);
    return getResumeStmt.get(resumeId);
  });

  const created = tx();
  res.status(201).json({ resume: created });
});

app.put('/api/resumes/:id', (req, res) => {
  const resumeId = parseInteger(req.params.id);
  if (!resumeId || resumeId < 1) {
    return res.status(400).json({ error: 'Invalid resume ID' });
  }
  const { title, content, createVersion = true } = req.body || {};
  const ownedResume = assertResumeOwnership(resumeId, req.user.id);
  if (!ownedResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const { title: nextTitle, content: nextContent } = normalizeResumeInput(
    { title, content },
    ownedResume.title,
    ownedResume.current_content
  );

  const tx = db.transaction(() => {
    updateResumeStmt.run(nextTitle, nextContent, resumeId);
    if (createVersion) {
      const latest = latestVersionNumberStmt.get(resumeId);
      createVersionStmt.run(resumeId, latest.max_version + 1, nextContent, nextTitle);
    }
    return getResumeStmt.get(resumeId);
  });

  const updated = tx();
  res.json({ resume: updated });
});

app.delete('/api/resumes/:id', (req, res) => {
  const resumeId = parseInteger(req.params.id);
  if (!resumeId || resumeId < 1) {
    return res.status(400).json({ error: 'Invalid resume ID' });
  }
  const ownedResume = assertResumeOwnership(resumeId, req.user.id);
  if (!ownedResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  deleteResumeStmt.run(resumeId);
  res.status(204).send();
});

app.get('/api/resumes/:id', (req, res) => {
  const resumeId = parseInteger(req.params.id);
  if (!resumeId || resumeId < 1) {
    return res.status(400).json({ error: 'Invalid resume ID' });
  }
  const ownedResume = assertResumeOwnership(resumeId, req.user.id);
  if (!ownedResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  res.json({ resume: ownedResume });
});

app.post('/api/resumes/:id/versions', (req, res) => {
  const resumeId = parseInteger(req.params.id);
  if (!resumeId || resumeId < 1) {
    return res.status(400).json({ error: 'Invalid resume ID' });
  }
  const ownedResume = assertResumeOwnership(resumeId, req.user.id);
  if (!ownedResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const { sourceVersionId, title, content } = req.body || {};

  let { title: snapshotTitle, content: baseContent } = normalizeResumeInput(
    { title, content },
    ownedResume.title,
    ownedResume.current_content
  );

  if (sourceVersionId) {
    const parsedSourceVersionId = parseInteger(sourceVersionId);
    if (!parsedSourceVersionId || parsedSourceVersionId < 1) {
      return res.status(400).json({ error: 'Invalid source version ID' });
    }

    const sourceVersion = getVersionStmt.get(parsedSourceVersionId, resumeId);
    if (!sourceVersion) {
      return res.status(404).json({ error: 'Source version not found' });
    }
    ({ title: snapshotTitle, content: baseContent } = normalizeResumeInput(
      { title, content },
      sourceVersion.snapshot_title,
      sourceVersion.content
    ));
  }

  const tx = db.transaction(() => {
    const latest = latestVersionNumberStmt.get(resumeId);
    const nextVersion = latest.max_version + 1;
    const created = createVersionStmt.run(resumeId, nextVersion, baseContent, snapshotTitle);
    updateResumeStmt.run(snapshotTitle, baseContent, resumeId);
    return getVersionStmt.get(Number(created.lastInsertRowid), resumeId);
  });

  const version = tx();
  res.status(201).json({ version });
});

app.get('/api/resumes/:id/versions', (req, res) => {
  const resumeId = parseInteger(req.params.id);
  if (!resumeId || resumeId < 1) {
    return res.status(400).json({ error: 'Invalid resume ID' });
  }
  const ownedResume = assertResumeOwnership(resumeId, req.user.id);
  if (!ownedResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const versions = listVersionsStmt.all(resumeId);
  res.json({ versions });
});

app.get('/api/resumes/:id/versions/:versionId', (req, res) => {
  const resumeId = parseInteger(req.params.id);
  const versionId = parseInteger(req.params.versionId);
  if (!resumeId || resumeId < 1) {
    return res.status(400).json({ error: 'Invalid resume ID' });
  }
  if (!versionId || versionId < 1) {
    return res.status(400).json({ error: 'Invalid version ID' });
  }
  const ownedResume = assertResumeOwnership(resumeId, req.user.id);
  if (!ownedResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const version = getVersionStmt.get(versionId, resumeId);
  if (!version) {
    return res.status(404).json({ error: 'Version not found' });
  }

  res.json({ version });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Resume Builder API running at http://localhost:${PORT}`);
});
