const state = {
  resumes: [],
  versions: [],
  currentResumeId: null,
  currentVersionId: null
};

const resumeList = document.getElementById('resumeList');
const versionList = document.getElementById('versionList');
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const statusText = document.getElementById('status');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const duplicateBtn = document.getElementById('duplicateBtn');
const newResumeBtn = document.getElementById('newResumeBtn');
const deleteBtn = document.getElementById('deleteBtn');
const themeToggle = document.getElementById('themeToggle');

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function setStatus(message) {
  statusText.textContent = message;
}

function renderResumes() {
  resumeList.innerHTML = '';

  state.resumes.forEach((resume) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = `w-full rounded border px-3 py-2 text-left text-sm ${
      state.currentResumeId === resume.id
        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100'
        : 'border-slate-300 dark:border-slate-700'
    }`;
    button.textContent = resume.title;
    button.onclick = () => selectResume(resume.id);
    li.appendChild(button);
    resumeList.appendChild(li);
  });
}

function renderVersions() {
  versionList.innerHTML = '';

  state.versions.forEach((version) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = `w-full rounded border px-3 py-2 text-left text-sm ${
      state.currentVersionId === version.id
        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30'
        : 'border-slate-300 dark:border-slate-700'
    }`;
    button.textContent = `v${version.version_number} - ${version.snapshot_title} (${new Date(version.created_at).toLocaleString()})`;
    button.onclick = () => loadVersion(version.id);
    li.appendChild(button);
    versionList.appendChild(li);
  });
}

async function refreshResumes() {
  const data = await api('/api/resumes');
  state.resumes = data.resumes;
  renderResumes();
}

async function selectResume(resumeId) {
  const [{ resume }, { versions }] = await Promise.all([
    api(`/api/resumes/${resumeId}`),
    api(`/api/resumes/${resumeId}/versions`)
  ]);

  state.currentResumeId = resume.id;
  state.currentVersionId = versions[0]?.id || null;
  state.versions = versions;
  titleInput.value = resume.title;
  contentInput.value = resume.current_content;

  renderResumes();
  renderVersions();
  setStatus(`Editing "${resume.title}" (Resume #${resume.id})`);
}

async function createNewResume() {
  const title = titleInput.value.trim() || `Resume ${state.resumes.length + 1}`;
  const content = contentInput.value;

  const data = await api('/api/resumes', {
    method: 'POST',
    body: JSON.stringify({ title, content })
  });

  await refreshResumes();
  await selectResume(data.resume.id);
  setStatus('Created a new resume.');
}

async function saveDraft() {
  if (!state.currentResumeId) {
    setStatus('No resume selected, creating one first...');
    await createNewResume();
    return;
  }

  const payload = {
    title: titleInput.value.trim() || 'Untitled Resume',
    content: contentInput.value,
    createVersion: true
  };

  await api(`/api/resumes/${state.currentResumeId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  await selectResume(state.currentResumeId);
  setStatus('Saved draft and created a new version snapshot.');
}

async function duplicateVersion() {
  if (!state.currentResumeId) {
    setStatus('Select or create a resume first.');
    return;
  }

  await api(`/api/resumes/${state.currentResumeId}/versions`, {
    method: 'POST',
    body: JSON.stringify({
      sourceVersionId: state.currentVersionId,
      title: titleInput.value.trim() || 'Untitled Resume',
      content: contentInput.value
    })
  });

  await selectResume(state.currentResumeId);
  setStatus('Duplicated content into a new resume version.');
}

async function loadVersion(versionId) {
  if (!state.currentResumeId) {
    return;
  }

  const data = await api(`/api/resumes/${state.currentResumeId}/versions/${versionId}`);
  state.currentVersionId = data.version.id;
  titleInput.value = data.version.snapshot_title;
  contentInput.value = data.version.content;
  renderVersions();
  setStatus(`Loaded version v${data.version.version_number}. Continue editing and save when ready.`);
}

async function deleteResume() {
  if (!state.currentResumeId) {
    setStatus('No resume selected to delete.');
    return;
  }

  await api(`/api/resumes/${state.currentResumeId}`, { method: 'DELETE' });
  state.currentResumeId = null;
  state.currentVersionId = null;
  state.versions = [];
  titleInput.value = '';
  contentInput.value = '';
  await refreshResumes();
  renderVersions();
  setStatus('Resume deleted.');
}

function setupThemeToggle() {
  const applyLabel = () => {
    const dark = document.documentElement.classList.contains('dark');
    themeToggle.textContent = dark ? 'Switch to Light' : 'Switch to Dark';
  };

  themeToggle.addEventListener('click', () => {
    const nextDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('themePreference', nextDark ? 'dark' : 'light');
    applyLabel();
  });

  applyLabel();
}

saveDraftBtn.addEventListener('click', () => saveDraft().catch((err) => setStatus(err.message)));
duplicateBtn.addEventListener('click', () => duplicateVersion().catch((err) => setStatus(err.message)));
newResumeBtn.addEventListener('click', () => createNewResume().catch((err) => setStatus(err.message)));
deleteBtn.addEventListener('click', () => deleteResume().catch((err) => setStatus(err.message)));

setupThemeToggle();
refreshResumes().catch((err) => setStatus(err.message));
