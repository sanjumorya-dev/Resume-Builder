export type ResumeSectionKey =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'education'
  | 'projects';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  dateRange: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  link?: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  location?: string;
  email?: string;
  phone?: string;
  links?: string[];
  summary: string;
  experience: ExperienceItem[];
  skills: string[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export type ResumePatch = Partial<Pick<ResumeData, ResumeSectionKey>>;

export type RegenerateSection = (
  section: ResumeSectionKey,
  currentResume: ResumeData,
) => Promise<ResumePatch>;
