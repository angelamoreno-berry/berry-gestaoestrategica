import { ConsultingData, BlockStatus, Project } from '@/types/consulting';

export function generateReport(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório - ${project.nomeEmpresa}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px; background: white; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0077B6; }
    .header h1 { color: #0077B6; font-size: 28px; margin-bottom: 10px; }
    .header p { color: #666; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title { background: #0077B6; color: white; padding: 12px 20px; font-size: 16px; font-weight: bold; margin-bottom: 15px; border-radius: 4px; }
    .section-content { padding: 0 10px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .info-item { background: #f8f9fa; padding: 12px; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
    .info-value { font-weight: 600; color: #333; }
    .list-item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .list-item:last-child { border-bottom: none; }
    .tag { display: inline-block; background: #e0f7fa; color: #00838f; padding: 4px 10px; border-radius: 20px; font-size: 13px; margin: 4px; }
    .progress-bar { height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin-top: 5px; }
    .progress-fill { height: 100%; background: #00B4D8; border-radius: 4px; }
    .swot-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .swot-box { padding: 15px; border-radius: 4px; }
    .swot-forcas { background: #e8f5e9; border-left: 4px solid #4caf50; }
    .swot-fraquezas { background: #ffebee; border-left: 4px solid #f44336; }
    .swot-oportunidades { background: #e3f2fd; border-left: 4px solid #2196f3; }
    .swot-ameacas { background: #fff3e0; border-left: 4px solid #ff9800; }
    .swot-title { font-weight: bold; margin-bottom: 10px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    @media print { 
      body { background: white; } 
      .container { padding: 20px; box-shadow: none; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Relatório de Estruturação em Gestão</h1>
      <p>${project.nomeEmpresa} - ${project.segmento}</p>
      <p style="font-size: 13px; margin-top: 10px;">Gerado em ${formatDate(new Date().toISOString())}</p>
    </div>

    <div class="section">
      <div class="section-title">📊 Informações da Empresa</div>
      <div class="section-content">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Empresa</div>
            <div class="info-value">${project.nomeEmpresa}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Segmento</div>
            <div class="info-value">${project.segmento}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Responsável</div>
            <div class="info-value">${project.responsavel}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Faturamento Médio</div>
            <div class="info-value">${formatCurrency(project.faturamentoMedio)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Colaboradores</div>
            <div class="info-value">${project.quantidadeColaboradores}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data de Início</div>
            <div class="info-value">${formatDate(project.dataCriacao)}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📈 Progresso dos Blocos</div>
      <div class="section-content">
        ${blocks.map(block => `
          <div class="list-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>${block.icon} ${block.name}</span>
              <span style="font-weight: 600; color: ${block.progress === 100 ? '#4caf50' : '#666'};">${block.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${block.progress}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${data.identidade.visao || data.identidade.missao ? `
    <div class="section">
      <div class="section-title">🎯 Identidade Organizacional</div>
      <div class="section-content">
        ${data.identidade.visao ? `<div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Visão</div><div class="info-value">${data.identidade.visao}</div></div>` : ''}
        ${data.identidade.missao ? `<div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Missão</div><div class="info-value">${data.identidade.missao}</div></div>` : ''}
        ${data.identidade.valores.length > 0 ? `<div class="info-item"><div class="info-label">Valores</div><div>${data.identidade.valores.map(v => `<span class="tag">${v}</span>`).join('')}</div></div>` : ''}
      </div>
    </div>
    ` : ''}

    ${data.goldenCircle.why || data.goldenCircle.how || data.goldenCircle.what ? `
    <div class="section">
      <div class="section-title">⭕ Golden Circle</div>
      <div class="section-content">
        ${data.goldenCircle.why ? `<div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Por quê? (Why)</div><div class="info-value">${data.goldenCircle.why}</div></div>` : ''}
        ${data.goldenCircle.how ? `<div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Como? (How)</div><div class="info-value">${data.goldenCircle.how}</div></div>` : ''}
        ${data.goldenCircle.what ? `<div class="info-item"><div class="info-label">O quê? (What)</div><div class="info-value">${data.goldenCircle.what}</div></div>` : ''}
      </div>
    </div>
    ` : ''}

    ${data.icp.caracteristicasDemograficas || data.icp.dores.length > 0 ? `
    <div class="section">
      <div class="section-title">👤 Perfil do Cliente Ideal (ICP)</div>
      <div class="section-content">
        ${data.icp.caracteristicasDemograficas ? `<div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Características</div><div class="info-value">${data.icp.caracteristicasDemograficas}</div></div>` : ''}
        ${data.icp.dores.length > 0 ? `<div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Dores</div><div>${data.icp.dores.map(d => `<span class="tag">${d}</span>`).join('')}</div></div>` : ''}
        ${data.icp.desejos.length > 0 ? `<div class="info-item"><div class="info-label">Desejos</div><div>${data.icp.desejos.map(d => `<span class="tag">${d}</span>`).join('')}</div></div>` : ''}
      </div>
    </div>
    ` : ''}

    ${data.swot.forcas.length > 0 || data.swot.fraquezas.length > 0 ? `
    <div class="section">
      <div class="section-title">🧭 Análise SWOT</div>
      <div class="section-content">
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-title">💪 Forças</div>
            ${data.swot.forcas.map(f => `<div>• ${f}</div>`).join('') || '<div style="color: #999;">Não preenchido</div>'}
          </div>
          <div class="swot-box swot-fraquezas">
            <div class="swot-title">⚠️ Fraquezas</div>
            ${data.swot.fraquezas.map(f => `<div>• ${f}</div>`).join('') || '<div style="color: #999;">Não preenchido</div>'}
          </div>
          <div class="swot-box swot-oportunidades">
            <div class="swot-title">🌟 Oportunidades</div>
            ${data.swot.oportunidades.map(o => `<div>• ${o}</div>`).join('') || '<div style="color: #999;">Não preenchido</div>'}
          </div>
          <div class="swot-box swot-ameacas">
            <div class="swot-title">🔥 Ameaças</div>
            ${data.swot.ameacas.map(a => `<div>• ${a}</div>`).join('') || '<div style="color: #999;">Não preenchido</div>'}
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.financeiro.faturamentoAtual > 0 ? `
    <div class="section">
      <div class="section-title">📈 Análise Financeira</div>
      <div class="section-content">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Faturamento Atual</div>
            <div class="info-value">${formatCurrency(data.financeiro.faturamentoAtual)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Meta de Faturamento</div>
            <div class="info-value">${formatCurrency(data.financeiro.metaFaturamento)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Despesas Fixas</div>
            <div class="info-value">${formatCurrency(data.financeiro.despesasFixas)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Margem Atual</div>
            <div class="info-value">${data.financeiro.margemAtual}%</div>
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.agendaCEO.prioridades.length > 0 ? `
    <div class="section">
      <div class="section-title">📅 Agenda Estratégica do CEO</div>
      <div class="section-content">
        ${data.agendaCEO.prioridades.map(p => `
          <div class="list-item" style="display: flex; justify-content: space-between;">
            <span>${p.descricao}</span>
            <span class="tag" style="background: ${p.importancia === 'alta' ? '#ffebee' : p.importancia === 'media' ? '#fff3e0' : '#e8f5e9'}; color: ${p.importancia === 'alta' ? '#c62828' : p.importancia === 'media' ? '#ef6c00' : '#2e7d32'};">${p.importancia}</span>
          </div>
        `).join('')}
        ${data.agendaCEO.focoTrimestre ? `<div class="info-item" style="margin-top: 15px;"><div class="info-label">Foco do Trimestre</div><div class="info-value">${data.agendaCEO.focoTrimestre}</div></div>` : ''}
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p>Relatório gerado pela Ferramenta de Estruturação em Gestão</p>
      <p>${formatDate(new Date().toISOString())}</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

export function openReportInNewTab(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const html = generateReport(project, data, blocks);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
