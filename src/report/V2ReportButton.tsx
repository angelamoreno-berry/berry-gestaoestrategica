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
      className="w-full mb-3 px-4 py-3 bg-[#1e293b] border border-[#334155] text-white rounded-lg hover:bg-[#334155] transition-colors text-sm font-semibold shadow-md flex items-center justify-center gap-2"
    >
      <span>&#128196;</span> Versão Executiva V2
    </button>
  );
}