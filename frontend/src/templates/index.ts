import { classicTemplate } from './classicTemplate';
import { compactTemplate } from './compactTemplate';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  render: (resume: import('../types/resume').ResumeData) => string;
}

export const resumeTemplates: ResumeTemplate[] = [classicTemplate, compactTemplate];

export const defaultTemplateId = classicTemplate.id;
