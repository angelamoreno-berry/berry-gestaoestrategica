import React from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { generateReportV2 } from './reportSections';

export function V2ReportButton() {
  const { data, currentProject, blocks } = useConsulting();

  const handleOpenV2 = () => {
    if (!currentProject) return;
    const html = generateReportV2(data, currentProject, blocks);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <button
      onClick={handleOpenV2}
      className="w-full mb-3 gradient-primary text-primary-foreground font-medium py-2.5 px-4 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      Relatório Executivo V2
    </button>
  );
}
