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
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
    >
      Versão Executiva V2
    </button>
  );
}
