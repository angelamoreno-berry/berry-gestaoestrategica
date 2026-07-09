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
      className="w-full mb-2 bg-[#18181B] text-white border border-[#27272A] hover:bg-[#27272A] transition-all text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm"
    >
      <span>📊</span> Relatório Executivo V2
    </button>
  );
}
