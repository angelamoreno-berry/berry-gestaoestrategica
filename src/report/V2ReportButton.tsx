import React from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { generateReportV2 } from './reportSections';

export function V2ReportButton() {
  const { data, currentProject, blocks } = useConsulting();

  const handleOpenV2 = () => {
    if (!currentProject) return;
    
    // Gera o HTML do playbook
    const html = generateReportV2(data, currentProject, blocks);
    
    // Cria um Blob com o HTML para contornar bloqueadores de pop-up severos
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Abre exclusivamente em nova aba via link programático.
    // Nunca navega a janela atual — o app deve permanecer aberto.
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleOpenV2}
      className="w-full mb-3 gradient-primary text-primary-foreground font-medium py-2.5 px-4 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      Playbook Executivo
    </button>
  );
}
