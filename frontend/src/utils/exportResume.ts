import { Document, Packer, Paragraph, TextRun } from 'docx';
import type { ResumeData } from '../types/resume';
import type { ResumeTemplate } from '../templates';

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportAsPdf = () => {
  window.print();
};

export const exportAsDocx = async (
  resume: ResumeData,
  template: ResumeTemplate,
  fileName = 'resume.docx',
) => {
  const templateText = template.render(resume).split('\n');
  const sections = templateText.map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line)],
        spacing: { after: 120 },
      }),
  );

  const doc = new Document({
    sections: [{ properties: {}, children: sections }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, fileName);
};
