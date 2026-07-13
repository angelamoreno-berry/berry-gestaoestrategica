import { ConsultingData, BlockStatus, Project, Cargo } from '@/types/consulting';
import { getExecutiveMetrics } from "@/report/executiveMetrics";
import * as ReportSections from "@/report/reportSections";
import { reportStyles } from './reportStyles';
import { generateCargoChecklist, generateMaturityInsights, generateActionPlan, generateMotorStrategies, buildStrategicInitiatives, HORIZONTE_INFO, HORIZONTE_ORDEM } from './reportModel';

// Helper function to generate activity checklist suggestions for a position
export function generateReport(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  // ============================================================
  // Coletor de ações: cada plano de ação renderizado registra seus
  // itens aqui; o Roadmap consolidado é calculado destes dados
  // (substitui a antiga extração por regex sobre o HTML gerado).
  // ============================================================
  interface AcaoItem { texto: string; detalhe: string; tags?: string[]; cond?: boolean; numero?: string }

  const renderActionPlan = (origem: string, badge: string, styleAttr: string, itens: AcaoItem[]): string => {
    const visiveis = itens.filter(it => it.cond !== false);
    const lis = visiveis.map((it, i) => `
            <li class="action-plan-item">
              <span class="action-plan-number">${it.numero ?? String(i + 1)}</span>
              <div class="action-plan-content">
                <div class="action-plan-text">${it.texto}</div>
                <div class="action-plan-detail">${it.detalhe}</div>${it.tags && it.tags.length ? `
                <div class="action-plan-meta">
                  ${it.tags.map(t => `<span class="action-plan-tag">${t}</span>`).join('\n                  ')}
                </div>` : ''}
              </div>
            </li>`).join('');
    return `<div class="action-plan"${styleAttr}>
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - ${origem}</div>
            <span class="action-plan-badge">${badge}</span>
          </div>
          <ul class="action-plan-list">${lis}
          </ul>
        </div>`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const overallProgress = Math.round(blocks.reduce((acc, b) => acc + b.progress, 0) / blocks.length);
  
  const avgMaturity = Math.round(
    (data.diagnostico.pessoas.level + data.diagnostico.processos.level + 
     data.diagnostico.financas.level + data.diagnostico.mercado.level) / 4 * 10
  ) / 10;

  // Nome de arquivo seguro para download (usado no botão "Salvar HTML" do relatório)
  const safeFileName = project.nomeEmpresa
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Empresa';

  const executiveMetrics = getExecutiveMetrics(data);
  // Proxy de Nota Geral (0-100) baseado na maturidade média.
  // Observação: este gerador não calcula um Berry Score oficial (isso existe
  // apenas no relatório financeiro). Se um Berry Score real ficar disponível
  // aqui no futuro, troque esta linha por ele.
  //const notaGeral = Math.min(100, Math.round(avgMaturity * 20));
  const notaGeral = executiveMetrics.berryScore;

  // Dimensão de maturidade mais fraca -> vira a Prioridade Estratégica
  const dimensoes = [
    { nome: 'Pessoas', chave: 'pessoas', level: data.diagnostico.pessoas.level },
    { nome: 'Processos', chave: 'processos', level: data.diagnostico.processos.level },
    { nome: 'Finanças', chave: 'financas', level: data.diagnostico.financas.level },
    { nome: 'Mercado', chave: 'mercado', level: data.diagnostico.mercado.level },
  ];
  const dimensaoPrioritaria = dimensoes.reduce((a, b) => (b.level < a.level ? b : a));
  const textoPrioridade: Record<string, string> = {
    pessoas: 'Profissionalizar a gestão de pessoas',
    processos: 'Padronizar e documentar processos',
    financas: 'Estruturar a gestão financeira',
    mercado: 'Fortalecer o posicionamento de mercado',
  };
  //const prioridadeEstrategica = textoPrioridade[dimensaoPrioritaria.chave];
    const prioridadeEstrategica = executiveMetrics.strategicPriority;
  // Combinações Fraqueza x Ameaça (riscos) e Força x Oportunidade (oportunidades) -
  // pareamento posicional (1º com 1º, 2º com 2º...), até 3 combinações de cada.
  const riscosCombinados = Array.from({ length: 3 }).map((_, i) => ({
    a: data.swot.fraquezas[i],
    b: data.swot.ameacas[i],
  })).filter(c => c.a && c.b);

  const oportunidadesCombinadas = Array.from({ length: 3 }).map((_, i) => ({
    a: data.swot.forcas[i],
    b: data.swot.oportunidades[i],
  })).filter(c => c.a && c.b);

  const objetivo12Meses =
  executiveMetrics.objective12Months ||
  "A definir com base na estratégia de longo prazo da empresa.";


  // ============================================================
  // Iniciativas Estratégicas (usadas pelo Roadmap e pelos banners
  // de capítulo). Calculadas antes das seções.
  // ============================================================
  const iniciativas = buildStrategicInitiatives(data);
  const iniciativaPorId = Object.fromEntries(iniciativas.map(i => [i.id, i]));

  // Dimensão de menor maturidade -> iniciativa correspondente
  // (capítulos transversais como SWOT e Diagnóstico apontam para ela)
  const dimensoesMaturidade = [
    { key: 'financas', nivel: data.diagnostico.financas.level, iniciativa: 'financeiro' },
    { key: 'processos', nivel: data.diagnostico.processos.level, iniciativa: 'processos' },
    { key: 'mercado', nivel: data.diagnostico.mercado.level, iniciativa: 'posicionamento' },
    { key: 'pessoas', nivel: data.diagnostico.pessoas.level, iniciativa: 'organizacao' },
  ];
  const menorDimensao = dimensoesMaturidade.reduce((min, d) => d.nivel < min.nivel ? d : min, dimensoesMaturidade[0]);

  const chapterBanner = (iniciativaId: string): string => {
    const id = iniciativaId === '__menor__' ? menorDimensao.iniciativa : iniciativaId;
    const ini = iniciativaPorId[id];
    if (!ini) return '';
    const h = HORIZONTE_INFO[ini.horizonte];
    return `
        <div class="chapter-banner">
          <span><strong>Contribui para:</strong> ${ini.titulo}</span>
          <span><strong>Horizonte:</strong> ${h.label} · ${h.prazo}</span>
          <span><strong>Objetivo:</strong> ${ini.descricao}</span>
        </div>`;
  };

  // ============================================================
  // Seções do documento — renderizadores individuais (etapa 3).
  // Cada função devolve o HTML de uma seção; a ordem de concatenação
  // define a ordem do documento.
  // ============================================================
  const secDocumentHead = () => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plano de Estruturação em Gestão - ${project.nomeEmpresa}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
${reportStyles(overallProgress)}
  </style>
</head>
<body>
  `;
  const secEditToolbar = () => `<!-- ===== EDIT TOOLBAR ===== -->
  <div class="edit-toolbar">
    <span class="edit-toolbar-label">📝 Modo Edição</span>
    <button class="edit-toolbar-btn edit-toolbar-btn-primary" onclick="window.print()">
      🖨️ Imprimir
    </button>
    <div class="edit-toolbar-divider"></div>
    <button class="edit-toolbar-btn edit-toolbar-btn-secondary" onclick="saveAsHTML()">
      💾 Salvar HTML
    </button>
  </div>
  
  <script>
    // Toggle checklist items
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('checklist-checkbox')) {
        e.target.classList.toggle('checked');
        const item = e.target.closest('.checklist-item');
        if (item) item.classList.toggle('checked');
      }
    });
    
    // Save as HTML function
    function saveAsHTML() {
      const content = document.documentElement.outerHTML;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Plano_Estruturacao_${safeFileName}.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
  
  <div class="container editable-content" contenteditable="true">
    `;
  const secCoverPage = () => `<!-- ===== COVER PAGE ===== -->
    <div class="cover-page">
      <div class="cover-badge">Documento Estratégico Confidencial</div>
      <h1 class="cover-title">Plano de Estruturação<br>em Gestão</h1>
      <p class="cover-subtitle">Diagnóstico Completo e Plano de Ação Personalizado</p>
      
      <div class="cover-divider"></div>
      
      <div class="cover-company">${project.nomeEmpresa}</div>
      <div class="cover-segment">${project.segmento}</div>
      
      <div class="cover-meta-grid">
        <div class="cover-meta-item">
          <div class="cover-meta-label">Responsável</div>
          <div class="cover-meta-value">${project.responsavel}</div>
        </div>
        <div class="cover-meta-item">
          <div class="cover-meta-label">Data de Emissão</div>
          <div class="cover-meta-value">${formatDate(new Date().toISOString())}</div>
        </div>
        <div class="cover-meta-item">
          <div class="cover-meta-label">Faturamento Médio</div>
          <div class="cover-meta-value">${formatCurrency(project.faturamentoMedio)}</div>
        </div>
        <div class="cover-meta-item">
          <div class="cover-meta-label">Colaboradores</div>
          <div class="cover-meta-value">${project.quantidadeColaboradores} pessoas</div>
        </div>
      </div>
      
      <div class="cover-progress-ring">
        <div class="cover-progress-circle">
          <div class="cover-progress-inner">
            <div class="cover-progress-value">${overallProgress}%</div>
            <div class="cover-progress-label">Completo</div>
          </div>
        </div>
      </div>
    </div>
    
    `;
  const secContent = () => `<!-- ===== CONTENT ===== -->
    <div class="content">
    `;
  const secResumoExecutivo = () => `<!-- ===== RESUMO EXECUTIVO ===== -->
    <div class="section">
      <div class="section-header">
        <div class="section-badge">
          <span class="section-icon">⚡</span>
          Resumo Executivo
        </div>
        <h2 class="section-title">A situação da ${project.nomeEmpresa} em 2 minutos</h2>
        <p class="section-description">Síntese do diagnóstico completo. Cada ponto é detalhado nos capítulos seguintes.</p>
      </div>

      <div class="exec-grid">
        <div class="exec-card">
          <h4>Nota Geral</h4>
          <div><span class="exec-score">${notaGeral}</span><span class="exec-score-max"> / 100</span></div>
          <div class="exec-bar"><div class="exec-bar-fill" style="width: ${notaGeral}%;"></div></div>
        </div>
        <div class="exec-card">
          <h4>Maturidade Média</h4>
          <div><span class="exec-score">${avgMaturity}</span><span class="exec-score-max"> / 5</span></div>
          <div class="exec-bar"><div class="exec-bar-fill" style="width: ${avgMaturity * 20}%;"></div></div>
        </div>

        <div class="exec-card">
          <h4>3 Maiores Riscos · fraqueza × ameaça</h4>
          ${riscosCombinados.length > 0 ? riscosCombinados.map((c, i) => `
            <div class="exec-combo"><strong>${i + 1}.</strong> <strong>${c.a}</strong> combinada com <strong>${c.b}</strong>.</div>
          `).join('') : '<div class="exec-combo">Preencha a matriz SWOT (fraquezas e ameaças) para gerar esta análise.</div>'}
        </div>
        <div class="exec-card">
          <h4>3 Maiores Oportunidades · força × oportunidade</h4>
          ${oportunidadesCombinadas.length > 0 ? oportunidadesCombinadas.map((c, i) => `
            <div class="exec-combo"><strong>${i + 1}.</strong> Use <strong>${c.a}</strong> para capturar <strong>${c.b}</strong>.</div>
          `).join('') : '<div class="exec-combo">Preencha a matriz SWOT (forças e oportunidades) para gerar esta análise.</div>'}
        </div>

        <div class="exec-card">
          <h4>Prioridade Estratégica</h4>
          <div class="exec-priority">${prioridadeEstrategica}</div>
          <p style="font-size: 13px; color: var(--muted);">Dimensão de maior gap no diagnóstico de maturidade (${dimensaoPrioritaria.nome}, nível ${dimensaoPrioritaria.level}/5).</p>
        </div>
        <div class="exec-card">
          <h4>Objetivo · Próximos 12 meses</h4>
          <p style="font-size: 14px; font-weight: 600;">${objetivo12Meses}</p>
        </div>

        <div class="exec-card full">
          <h4>Progresso do Projeto</h4>
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px; font-size: 13px;">
            <span style="width: 120px; color: var(--muted);">Diagnóstico</span>
            <div class="exec-bar" style="flex: 1; margin-top: 0;"><div class="exec-bar-fill" style="width: ${overallProgress}%;"></div></div>
            <span style="width: 40px; text-align: right;">${overallProgress}%</span>
          </div>
          <div style="display: flex; align-items: center; gap: 14px; font-size: 13px;">
            <span style="width: 120px; color: var(--muted);">Implementação</span>
            <div class="exec-bar" style="flex: 1; margin-top: 0;"><div class="exec-bar-fill" style="width: 0%;"></div></div>
            <span style="width: 40px; text-align: right;">0%</span>
          </div>
        </div>
      </div>
    </div>

    `;
  const secRoadmapDeImplementacao = () => `<!-- ===== ROADMAP DE IMPLEMENTAÇÃO (placeholder, preenchido no pós-processamento) ===== -->
    <div id="__ROADMAP_PLACEHOLDER__"></div>

      `;
  const secCompanyInfo = () => `<!-- ===== COMPANY INFO ===== -->
      <div class="section">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🏢</span>
            Visão Geral
          </div>
          <h2 class="section-title">Informações da Empresa</h2>
          <p class="section-description">Dados cadastrais e métricas fundamentais do negócio em análise, servindo como base para todas as recomendações deste documento.</p>
        </div>
        
        <div class="data-grid">
          <div class="data-item">
            <div class="data-label">Razão Social</div>
            <div class="data-value">${project.nomeEmpresa}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Segmento de Atuação</div>
            <div class="data-value">${project.segmento}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Responsável Principal</div>
            <div class="data-value">${project.responsavel}</div>
          </div>
          <div class="data-item">
            <div class="data-label">E-mail de Contato</div>
            <div class="data-value">${project.emailResponsavel || 'Não informado'}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Faturamento Médio Mensal</div>
            <div class="data-value">${formatCurrency(project.faturamentoMedio)}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Número de Colaboradores</div>
            <div class="data-value">${project.quantidadeColaboradores} pessoas</div>
          </div>
        </div>
        
        ${project.faturamentoMedio > 0 && project.quantidadeColaboradores > 0 ? `
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Análise de Produtividade por Colaborador</div>
          <div class="insight-box-text">
            <strong>Receita por colaborador: ${formatCurrency(project.faturamentoMedio / project.quantidadeColaboradores)}/mês</strong><br><br>
            ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 
              ? `Este valor está abaixo da média de mercado para empresas do segmento "${project.segmento}". Recomendamos avaliar:<br>
                 • <strong>Processos ineficientes</strong> que consomem tempo desnecessário<br>
                 • <strong>Capacitação da equipe</strong> para aumentar produtividade<br>
                 • <strong>Automação</strong> de tarefas repetitivas<br>
                 • <strong>Revisão do quadro</strong> - pode haver excesso de pessoal em áreas não produtivas`
              : project.faturamentoMedio / project.quantidadeColaboradores > 30000
                ? `Excelente indicador de produtividade! Sua empresa está acima da média do mercado. Para manter e escalar:<br>
                   • <strong>Documente processos</strong> que geram essa eficiência<br>
                   • <strong>Invista em tecnologia</strong> para amplificar os resultados<br>
                   • <strong>Considere expansão</strong> replicando o modelo em novas unidades ou mercados`
                : `Indicador dentro da média de mercado. Para melhorar progressivamente:<br>
                   • <strong>Identifique os 20%</strong> de atividades que geram 80% do resultado<br>
                   • <strong>Elimine reuniões</strong> desnecessárias e burocracias<br>
                   • <strong>Implemente métricas</strong> individuais de produtividade`}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📊</div>
            <div>
              <div class="visual-example-title">Benchmarking de Mercado</div>
              <div class="visual-example-subtitle">Como sua empresa se compara</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
              <div style="padding: 20px; background: ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 ? 'var(--primary-lighter)' : 'var(--background)'}; border-radius: 12px; border: 2px solid ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 ? 'var(--primary)' : 'transparent'};">
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Abaixo da Média</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--foreground);">< R$ 10k</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">por colaborador</div>
              </div>
              <div style="padding: 20px; background: ${project.faturamentoMedio / project.quantidadeColaboradores >= 10000 && project.faturamentoMedio / project.quantidadeColaboradores <= 30000 ? 'var(--primary-lighter)' : 'var(--background)'}; border-radius: 12px; border: 2px solid ${project.faturamentoMedio / project.quantidadeColaboradores >= 10000 && project.faturamentoMedio / project.quantidadeColaboradores <= 30000 ? 'var(--primary)' : 'transparent'};">
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Na Média</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--foreground);">R$ 10k - 30k</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">por colaborador</div>
              </div>
              <div style="padding: 20px; background: ${project.faturamentoMedio / project.quantidadeColaboradores > 30000 ? 'var(--accent-light)' : 'var(--background)'}; border-radius: 12px; border: 2px solid ${project.faturamentoMedio / project.quantidadeColaboradores > 30000 ? 'var(--accent)' : 'transparent'};">
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Acima da Média</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--foreground);">> R$ 30k</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">por colaborador</div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
      
      `;
  const secGoldenCircle = () => `<!-- ===== GOLDEN CIRCLE ===== -->
      ${data.goldenCircle.why || data.goldenCircle.how || data.goldenCircle.what ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🎯</span>
            Propósito
          </div>
          <h2 class="section-title">Golden Circle - Círculo Dourado</h2>
          <p class="section-description">Metodologia criada por Simon Sinek que define o propósito, processo e entrega da organização. Empresas que comunicam do "porquê" para o "o quê" criam conexões emocionais mais fortes com clientes.</p>
        </div>${chapterBanner(`cultura`)}
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📖</div>
            <span class="info-box-title">Por que o Golden Circle é importante?</span>
          </div>
          <div class="info-box-text">
            Segundo pesquisa da Harvard Business Review, empresas orientadas por propósito têm <strong>4x mais crescimento</strong> do que empresas focadas apenas em lucro. 
            O Golden Circle ajuda a criar uma narrativa coerente que atrai clientes que compartilham dos mesmos valores, gerando fidelização natural.
          </div>
        </div>
        
        <div class="golden-circle">
          ${data.goldenCircle.why ? `
          <div class="golden-ring golden-why">
            <div class="golden-label">💛 Por quê? (WHY)</div>
            <div class="golden-content">${data.goldenCircle.why}</div>
          </div>
          ` : ''}
          
          ${data.goldenCircle.how ? `
          <div class="golden-ring golden-how">
            <div class="golden-label">💙 Como? (HOW)</div>
            <div class="golden-content">${data.goldenCircle.how}</div>
          </div>
          ` : ''}
          
          ${data.goldenCircle.what ? `
          <div class="golden-ring golden-what">
            <div class="golden-label">💜 O quê? (WHAT)</div>
            <div class="golden-content">${data.goldenCircle.what}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">🚀</div>
            <span class="implementation-title">Como Aplicar o Golden Circle na Prática</span>
          </div>
          <div class="implementation-steps">
            <div class="implementation-step">
              <div class="implementation-step-number">1</div>
              <div class="implementation-step-content">
                <h4>Use o "Porquê" no seu Pitch de Vendas</h4>
                <p><strong>Exemplo prático:</strong> Ao invés de dizer "Vendemos consultoria em gestão", diga "${data.goldenCircle.why ? `"${data.goldenCircle.why.substring(0, 80)}..." - é por isso que fazemos o que fazemos.` : '"Acreditamos que toda empresa merece crescer de forma estruturada - é por isso que fazemos o que fazemos."'} Isso cria conexão emocional antes de falar do produto.</p>
              </div>
            </div>
            <div class="implementation-step">
              <div class="implementation-step-number">2</div>
              <div class="implementation-step-content">
                <h4>Incorpore na Página Inicial do Site</h4>
                <p><strong>Estrutura sugerida:</strong> Hero com o PORQUÊ em destaque → Como você resolve (COMO) → Lista de serviços/produtos (O QUÊ). Isso aumenta tempo na página em até 40% segundo estudos de UX.</p>
              </div>
            </div>
            <div class="implementation-step">
              <div class="implementation-step-number">3</div>
              <div class="implementation-step-content">
                <h4>Treine sua Equipe</h4>
                <p><strong>Workshop recomendado:</strong> Faça uma sessão de 2h com toda equipe explicando o Golden Circle. Cada colaborador deve saber responder "Por que a ${project.nomeEmpresa} existe?" de forma consistente.</p>
              </div>
            </div>
            <div class="implementation-step">
              <div class="implementation-step-number">4</div>
              <div class="implementation-step-content">
                <h4>Revise Materiais de Marketing</h4>
                <p><strong>Checklist:</strong> Cartão de visita, assinatura de email, posts em redes sociais, propostas comerciais - todos devem comunicar primeiro o PORQUÊ, depois o resto.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">✍️</div>
            <div>
              <div class="visual-example-title">Exemplo de Aplicação: Texto para Site</div>
              <div class="visual-example-subtitle">Como usar seu Golden Circle na comunicação</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="font-family: Georgia, serif; line-height: 1.9;">
              <p style="font-size: 24px; font-weight: 600; color: var(--foreground); margin-bottom: 16px; font-style: italic;">
                "${data.goldenCircle.why || 'Acreditamos que toda empresa pode alcançar seu potencial máximo.'}"
              </p>
              <p style="font-size: 15px; color: var(--muted); margin-bottom: 12px;">
                ${data.goldenCircle.how || 'Fazemos isso através de metodologias comprovadas e acompanhamento personalizado.'}
              </p>
              <p style="font-size: 14px; color: var(--primary); font-weight: 600;">
                ${data.goldenCircle.what || 'Oferecemos consultoria, treinamentos e mentoria para empresários.'}
              </p>
            </div>
          </div>
        </div>
        
        ${renderActionPlan(`Golden Circle`, `Próximos 30 dias`, '', [
          { texto: `Validar o Golden Circle com 5 clientes atuais`, detalhe: `Pergunte: "O que te fez escolher a ${project.nomeEmpresa}?" - as respostas devem refletir seu PORQUÊ. Se não refletirem, refine a mensagem.`, tags: [`⏱️ 1 semana`, `👤 Comercial`] },
          { texto: `Atualizar apresentação comercial com a nova narrativa`, detalhe: `Slide 1: PORQUÊ (gere identificação) → Slide 2: COMO (credibilidade) → Slides 3+: O QUÊ (detalhes).`, tags: [`⏱️ 2 semanas`, `👤 Marketing`] },
          { texto: `Criar vídeo institucional de 60 segundos`, detalhe: `Roteiro: 20s contando o PORQUÊ, 20s mostrando COMO trabalham, 20s apresentando O QUÊ oferecem. Use depoimentos de clientes.`, tags: [`⏱️ 4 semanas`, `👤 Marketing`] }
        ])}
      </div>
      ` : ''}
      
      `;
  const secIdentidadeOrganizacional = () => `<!-- ===== IDENTIDADE ORGANIZACIONAL ===== -->
      ${data.identidade.visao || data.identidade.missao || data.identidade.valores.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🏛️</span>
            Fundamentos
          </div>
          <h2 class="section-title">Identidade Organizacional</h2>
          <p class="section-description">Os pilares que definem quem a empresa é, para onde vai e quais princípios guiam suas decisões. Uma identidade clara aumenta engajamento de colaboradores em até 67% (Gallup).</p>
        </div>${chapterBanner(`cultura`)}
        
        ${data.identidade.visao ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🔭</div>
            <span class="card-title">Visão de Futuro</span>
          </div>
          <div class="card-content" style="font-size: 18px; font-weight: 500; color: var(--primary);">
            "${data.identidade.visao}"
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">💡</div>
            <span class="suggestion-title">Como usar a Visão no dia a dia</span>
          </div>
          <div class="suggestion-text">
            <strong>1. Nas reuniões de planejamento:</strong> Comece toda reunião estratégica relembrando a visão. Pergunte: "Esta decisão nos aproxima ou afasta da visão?"<br><br>
            <strong>2. Na contratação:</strong> Pergunte aos candidatos: "O que você acha de fazer parte de uma empresa que quer '${data.identidade.visao.substring(0, 50)}...'?"<br><br>
            <strong>3. No escritório:</strong> Coloque a visão em local visível. Quadros, papel de parede, tela de descanso dos computadores.
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.missao ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Missão</span>
          </div>
          <div class="card-content" style="font-size: 16px;">
            ${data.identidade.missao}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📝</div>
            <div>
              <div class="visual-example-title">Modelo: Assinatura de E-mail com Missão</div>
              <div class="visual-example-subtitle">Exemplo de aplicação prática</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="font-family: Arial, sans-serif; padding: 16px; background: #f9f9f9; border-radius: 8px;">
              <div style="font-weight: 600; color: #333;">${project.responsavel}</div>
              <div style="font-size: 13px; color: #666;">${project.segmento} | ${project.nomeEmpresa}</div>
              <div style="font-size: 12px; color: #999; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-style: italic;">
                "${data.identidade.missao.substring(0, 80)}${data.identidade.missao.length > 80 ? '...' : ''}"
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.valores.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">💎</div>
            <span class="card-title">Valores Organizacionais</span>
          </div>
          <div class="tags">
            ${data.identidade.valores.map(v => `<span class="tag tag-gold">${v}</span>`).join('')}
          </div>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">⚡</div>
            <span class="implementation-title">Vivenciando os Valores na Prática</span>
          </div>
          <div class="implementation-steps">
            ${data.identidade.valores.slice(0, 3).map((valor, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>Valor: ${valor}</h4>
                <p><strong>Como aplicar:</strong> Crie uma situação concreta onde este valor deve prevalecer. Ex: Se o valor é "Transparência", defina que todos os erros devem ser comunicados em até 24h, mesmo os pequenos. Documente exemplos reais de quando o valor foi praticado e compartilhe com a equipe.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${renderActionPlan(`Identidade`, `Cultura organizacional`, '', [
          { texto: `Criar "Manual de Cultura" de 1 página`, detalhe: `Inclua: Visão, Missão, Valores + 3 comportamentos esperados para cada valor. Distribua para todos e use no onboarding.` },
          { texto: `Implementar "Momento Valor" nas reuniões semanais`, detalhe: `Dedique 5 minutos para alguém compartilhar um exemplo real de quando vivenciou um dos valores. Isso reforça a cultura de forma orgânica.` },
          { texto: `Incluir valores na avaliação de desempenho`, detalhe: `Além de metas numéricas, avalie como cada colaborador pratica os valores. Peso sugerido: 30% da avaliação.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secSwot = () => `<!-- ===== SWOT ===== -->
      ${data.swot.forcas.length > 0 || data.swot.fraquezas.length > 0 || data.swot.oportunidades.length > 0 || data.swot.ameacas.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">📊</span>
            Análise Estratégica
          </div>
          <h2 class="section-title">Matriz SWOT</h2>
          <p class="section-description">Análise dos fatores internos (Forças e Fraquezas) e externos (Oportunidades e Ameaças) que impactam o negócio. Esta ferramenta é base para definição de estratégias.</p>
        </div>${chapterBanner(`__menor__`)}
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">🎓</div>
            <span class="info-box-title">Como interpretar a Matriz SWOT</span>
          </div>
          <div class="info-box-text">
            • <strong>FORÇAS + OPORTUNIDADES:</strong> Estratégia de ATAQUE - use suas forças para aproveitar oportunidades<br>
            • <strong>FORÇAS + AMEAÇAS:</strong> Estratégia de DEFESA - use forças para neutralizar ameaças<br>
            • <strong>FRAQUEZAS + OPORTUNIDADES:</strong> Estratégia de DESENVOLVIMENTO - melhore fraquezas para aproveitar oportunidades<br>
            • <strong>FRAQUEZAS + AMEAÇAS:</strong> Estratégia de SOBREVIVÊNCIA - minimize fraquezas e evite ameaças
          </div>
        </div>
        
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-header">
              <div class="swot-icon">💪</div>
              <span class="swot-title">Forças (Strengths)</span>
            </div>
            <div class="swot-list">
              ${data.swot.forcas.length > 0 ? data.swot.forcas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-fraquezas">
            <div class="swot-header">
              <div class="swot-icon">⚠️</div>
              <span class="swot-title">Fraquezas (Weaknesses)</span>
            </div>
            <div class="swot-list">
              ${data.swot.fraquezas.length > 0 ? data.swot.fraquezas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-oportunidades">
            <div class="swot-header">
              <div class="swot-icon">🚀</div>
              <span class="swot-title">Oportunidades (Opportunities)</span>
            </div>
            <div class="swot-list">
              ${data.swot.oportunidades.length > 0 ? data.swot.oportunidades.map(o => `• ${o}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-ameacas">
            <div class="swot-header">
              <div class="swot-icon">⚡</div>
              <span class="swot-title">Ameaças (Threats)</span>
            </div>
            <div class="swot-list">
              ${data.swot.ameacas.length > 0 ? data.swot.ameacas.map(a => `• ${a}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
        </div>
        
        ${data.swot.forcas.length > 0 && data.swot.oportunidades.length > 0 ? `
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Estratégia Recomendada: ATAQUE</div>
          <div class="insight-box-text">
            <strong>Combinação de alto impacto identificada:</strong><br><br>
            Use sua força "<strong>${data.swot.forcas[0]}</strong>" para aproveitar a oportunidade "<strong>${data.swot.oportunidades[0]}</strong>".<br><br>
            <strong>Ação concreta:</strong> Crie uma campanha ou iniciativa específica que destaque esta força para capturar esta oportunidade nos próximos 90 dias.
          </div>
        </div>
        ` : ''}
        
        ${data.swot.fraquezas.length > 0 && data.swot.ameacas.length > 0 ? `
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🛡️</div>
            <span class="suggestion-title">Alerta: Ponto de Vulnerabilidade</span>
          </div>
          <div class="suggestion-text">
            A fraqueza "<strong>${data.swot.fraquezas[0]}</strong>" combinada com a ameaça "<strong>${data.swot.ameacas[0]}</strong>" representa um risco significativo.<br><br>
            <strong>Mitigação urgente:</strong> Priorize resolver ou minimizar esta fraqueza nas próximas 4-6 semanas para reduzir exposição ao risco.
          </div>
        </div>
        ` : ''}
        
        ${data.swot.horizontes && (data.swot.horizontes.curto || data.swot.horizontes.medio || data.swot.horizontes.longo) ? `
        <div class="card" style="margin-top: 32px;">
          <div class="card-header">
            <div class="card-icon">🗓️</div>
            <span class="card-title">Horizontes Estratégicos</span>
          </div>
          <div class="timeline">
            ${data.swot.horizontes.curto ? `
            <div class="timeline-item">
              <div class="timeline-label">Curto Prazo (0-6 meses)</div>
              <div class="timeline-content">${data.swot.horizontes.curto}</div>
            </div>
            ` : ''}
            ${data.swot.horizontes.medio ? `
            <div class="timeline-item">
              <div class="timeline-label">Médio Prazo (6-18 meses)</div>
              <div class="timeline-content">${data.swot.horizontes.medio}</div>
            </div>
            ` : ''}
            ${data.swot.horizontes.longo ? `
            <div class="timeline-item">
              <div class="timeline-label">Longo Prazo (18-36 meses)</div>
              <div class="timeline-content">${data.swot.horizontes.longo}</div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        ${renderActionPlan(`SWOT`, `Estratégico`, '', [
          { cond: data.swot.forcas.length > 0, numero: '1', texto: `Documentar e comunicar suas forças`, detalhe: `Crie materiais de marketing que destaquem: ${data.swot.forcas.slice(0, 2).join(', ')}. Use em propostas, site e redes sociais.` },
          { cond: data.swot.fraquezas.length > 0, numero: '2', texto: `Criar plano de melhoria para principal fraqueza`, detalhe: `Foco em "${data.swot.fraquezas[0]}": defina responsável, prazo de 60 dias e 3 ações específicas para melhorar este ponto.` },
          { cond: data.swot.oportunidades.length > 0, numero: '3', texto: `Desenvolver iniciativa para capturar oportunidade`, detalhe: `Oportunidade: "${data.swot.oportunidades[0]}". Crie um projeto específico com metas, orçamento e cronograma para aproveitá-la.` },
          { cond: data.swot.ameacas.length > 0, numero: '4', texto: `Montar plano de contingência para ameaças`, detalhe: `Ameaça: "${data.swot.ameacas[0]}". Defina: sinais de alerta para monitorar, ações de resposta, responsável pela vigilância.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secDiagnostico = () => `<!-- ===== DIAGNÓSTICO ===== -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🔍</span>
            Diagnóstico
          </div>
          <h2 class="section-title">Diagnóstico de Maturidade</h2>
          <p class="section-description">Avaliação do nível de maturidade em cada área crítica do negócio. Esta análise identifica gaps e prioridades de desenvolvimento.</p>
        </div>${chapterBanner(`__menor__`)}
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📊</div>
            <span class="info-box-title">Interpretando os Níveis de Maturidade</span>
          </div>
          <div class="info-box-text">
            <strong>Nível 1 - Inicial:</strong> Processos inexistentes ou caóticos<br>
            <strong>Nível 2 - Básico:</strong> Processos existem mas não são padronizados<br>
            <strong>Nível 3 - Definido:</strong> Processos documentados e seguidos<br>
            <strong>Nível 4 - Gerenciado:</strong> Processos medidos e controlados<br>
            <strong>Nível 5 - Otimizado:</strong> Melhoria contínua e inovação constante<br><br>
            <strong>Maturidade média da ${project.nomeEmpresa}: ${avgMaturity}/5</strong>
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📈</div>
            <div>
              <div class="visual-example-title">Visão Geral de Maturidade</div>
              <div class="visual-example-subtitle">Comparativo entre as 4 dimensões</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.pessoas.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Pessoas</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.pessoas.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.processos.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Processos</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.processos.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.financas.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Finanças</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.financas.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.mercado.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Mercado</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.mercado.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="maturity-grid" style="margin-top: 32px;">
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">👥</span> Pessoas</span>
              <span class="maturity-level">${data.diagnostico.pessoas.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.pessoas.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.pessoas.notes || 'Sem observações adicionais'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">⚙️</span> Processos</span>
              <span class="maturity-level">${data.diagnostico.processos.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.processos.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.processos.notes || 'Sem observações adicionais'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">💰</span> Finanças</span>
              <span class="maturity-level">${data.diagnostico.financas.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.financas.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.financas.notes || 'Sem observações adicionais'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">📈</span> Mercado</span>
              <span class="maturity-level">${data.diagnostico.mercado.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.mercado.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.mercado.notes || 'Sem observações adicionais'}</div>
          </div>
        </div>
        
        <!-- Insights por área -->
        <div style="margin-top: 40px;">
          <h3 style="font-size: 20px; font-weight: 700; color: var(--foreground); margin-bottom: 24px;">📋 Análise Detalhada por Área</h3>
          
          <div class="insight-box">
            <div class="insight-box-title">👥 Pessoas - Nível ${data.diagnostico.pessoas.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.pessoas.level, 'pessoas')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('pessoas', data.diagnostico.pessoas.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
          
          <div class="insight-box">
            <div class="insight-box-title">⚙️ Processos - Nível ${data.diagnostico.processos.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.processos.level, 'processos')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('processos', data.diagnostico.processos.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
          
          <div class="insight-box">
            <div class="insight-box-title">💰 Finanças - Nível ${data.diagnostico.financas.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.financas.level, 'financas')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('financas', data.diagnostico.financas.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
          
          <div class="insight-box">
            <div class="insight-box-title">📈 Mercado - Nível ${data.diagnostico.mercado.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.mercado.level, 'mercado')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('mercado', data.diagnostico.mercado.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
        </div>
      </div>
      
      `;
  const secIcp = () => `<!-- ===== ICP ===== -->
      ${data.icp.descricao || data.icp.segmentos.length > 0 || data.icp.dpisos.length > 0 || data.icp.necessidades.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">👤</span>
            Cliente Ideal
          </div>
          <h2 class="section-title">Perfil do Cliente Ideal (ICP)</h2>
          <p class="section-description">Definição detalhada do cliente que mais se beneficia das suas soluções e gera maior valor para o negócio. Empresas com ICP claro têm 68% mais eficiência comercial.</p>
        </div>${chapterBanner(`posicionamento`)}
        
        ${data.icp.descricao ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Descrição do Cliente Ideal</span>
          </div>
          <div class="card-content" style="font-size: 16px; line-height: 1.9;">
            ${data.icp.descricao}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📝</div>
            <div>
              <div class="visual-example-title">Modelo: Bio do Cliente Ideal</div>
              <div class="visual-example-subtitle">Use este formato em treinamentos de vendas</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: 80px 1fr; gap: 20px; align-items: start;">
              <div style="width: 80px; height: 80px; background: var(--primary-lighter); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px;">👤</div>
              <div>
                <div style="font-weight: 700; font-size: 18px; margin-bottom: 4px; color: var(--foreground);">Cliente Ideal da ${project.nomeEmpresa}</div>
                <div style="font-size: 13px; color: var(--muted); margin-bottom: 12px;">${project.segmento}</div>
                <div style="font-size: 14px; line-height: 1.7; color: var(--foreground);">
                  "${data.icp.descricao.substring(0, 200)}${data.icp.descricao.length > 200 ? '...' : ''}"
                </div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${data.icp.segmentos.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🏢</div>
            <span class="card-title">Segmentos de Atuação</span>
          </div>
          <div class="tags">
            ${data.icp.segmentos.map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🎯</div>
            <span class="suggestion-title">Como usar os segmentos na prospecção</span>
          </div>
          <div class="suggestion-text">
            <strong>LinkedIn Sales Navigator:</strong> Use estes segmentos como filtros de busca. Exemplo: Indústria = "${data.icp.segmentos[0]}"<br><br>
            <strong>Listas de prospecção:</strong> Compre ou desenvolva listas específicas para cada segmento. Personalize a abordagem por segmento.<br><br>
            <strong>Conteúdo segmentado:</strong> Crie cases de sucesso, artigos e posts específicos para cada segmento - isso aumenta conversão em até 3x.
          </div>
        </div>
        ` : ''}
        
        ${data.icp.dpisos && data.icp.dpisos.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">😰</div>
            <span class="card-title">Dores e Problemas do Cliente</span>
          </div>
          <ul class="list">
            ${data.icp.dpisos.map(d => `<li class="list-item"><span class="list-bullet"></span><span>${d}</span></li>`).join('')}
          </ul>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">💬</div>
            <span class="implementation-title">Scripts de Abordagem Baseados nas Dores</span>
          </div>
          <div class="implementation-steps">
            ${data.icp.dpisos.slice(0, 3).map((dor, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>Dor: "${dor}"</h4>
                <p><strong>Script de abertura:</strong> "Tenho conversado com [perfil do cliente] que frequentemente me dizem que sofrem com [${dor}]. Isso acontece com você também?" - Esta pergunta gera identificação e abre espaço para apresentar sua solução.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.icp.necessidades.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">✨</div>
            <span class="card-title">Necessidades e Desejos</span>
          </div>
          <ul class="list">
            ${data.icp.necessidades.map(n => `<li class="list-item"><span class="list-bullet"></span><span>${n}</span></li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${renderActionPlan(`ICP`, `Comercial`, '', [
          { texto: `Criar "ICP Card" para equipe comercial`, detalhe: `Documento de 1 página com: descrição, segmentos, dores principais e necessidades. Todo vendedor deve ter na mesa ou no celular.` },
          { texto: `Revisar base atual de clientes`, detalhe: `Classifique seus clientes atuais: quantos são ICP perfeito? Priorize atendimento e upsell para estes. Considere descontinuar clientes muito fora do perfil.` },
          { texto: `Criar conteúdo específico para ICP`, detalhe: `Desenvolva: 1 e-book sobre uma dor específica, 3 posts de LinkedIn por semana falando das dores, 1 webinar por mês resolvendo um problema do ICP.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secConcorrentes = () => `<!-- ===== CONCORRENTES ===== -->
      ${data.concorrentes.principais.length > 0 || data.concorrentes.diferenciais.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🏆</span>
            Competição
          </div>
          <h2 class="section-title">Análise Competitiva</h2>
          <p class="section-description">Mapeamento dos principais concorrentes e definição dos seus diferenciais competitivos. Conhecer a concorrência é fundamental para se posicionar de forma única.</p>
        </div>${chapterBanner(`posicionamento`)}
        
        ${data.concorrentes.principais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Principais Concorrentes Mapeados</span>
          </div>
          <div class="competitor-visual">
            ${data.concorrentes.principais.map(c => `
              <div class="competitor-card">
                <div style="font-size: 32px; margin-bottom: 8px;">🏢</div>
                <div class="competitor-name">${c.nome}</div>
                <div class="competitor-type">${c.tipo}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Concorrente</th>
                <th>Tipo</th>
                <th>Pontos Fortes</th>
                <th>Pontos Fracos</th>
              </tr>
            </thead>
            <tbody>
              ${data.concorrentes.principais.map(c => `
                <tr>
                  <td><strong>${c.nome}</strong></td>
                  <td>${c.tipo}</td>
                  <td>${c.pontosFortes || '-'}</td>
                  <td>${c.pontosFracos || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🔍</div>
            <span class="suggestion-title">Como monitorar a concorrência</span>
          </div>
          <div class="suggestion-text">
            <strong>Google Alerts:</strong> Configure alertas para o nome de cada concorrente. Receba notificações quando saírem notícias.<br><br>
            <strong>Redes sociais:</strong> Siga todos os concorrentes no LinkedIn, Instagram e onde mais atuarem. Analise: frequência de posts, engajamento, tipo de conteúdo.<br><br>
            <strong>Mystery shopping:</strong> Uma vez por trimestre, simule ser cliente do concorrente. Peça orçamento, analise o processo de vendas, compare com o seu.<br><br>
            <strong>Entrevistas com clientes perdidos:</strong> Quando perder uma venda para concorrente, pergunte gentilmente: "O que eles ofereceram que nós não oferecemos?"
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.diferenciais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">⭐</div>
            <span class="card-title">Seus Diferenciais Competitivos</span>
          </div>
          <div class="tags">
            ${data.concorrentes.diferenciais.map(d => `<span class="tag tag-accent">${d}</span>`).join('')}
          </div>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">📢</div>
            <span class="implementation-title">Como comunicar cada diferencial</span>
          </div>
          <div class="implementation-steps">
            ${data.concorrentes.diferenciais.slice(0, 4).map((dif, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>"${dif}"</h4>
                <p><strong>Prova social:</strong> Colete 3 depoimentos de clientes que confirmem este diferencial. Use nas propostas, site e apresentações. <strong>Números:</strong> Quantifique: "90% dos nossos clientes destacam [${dif}] como motivo de escolha."</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.propostaValor ? `
        <div class="card" style="background: var(--foreground); color: white; border: none;">
          <div style="text-align: center; padding: 24px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-bottom: 14px;">Proposta de Valor Única</div>
            <div style="font-size: 22px; font-weight: 600; line-height: 1.5;">
              "${data.concorrentes.propostaValor}"
            </div>
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">🖥️</div>
            <div>
              <div class="visual-example-title">Aplicação: Hero do Site</div>
              <div class="visual-example-subtitle">Como usar a proposta de valor na página inicial</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 40px; border-radius: 12px; text-align: center;">
              <div style="font-size: 28px; font-weight: 700; margin-bottom: 12px;">${data.concorrentes.propostaValor}</div>
              <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">${data.goldenCircle.what || 'Soluções completas para o seu negócio crescer'}</div>
              <div style="display: inline-block; background: white; color: var(--primary); padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Quero saber mais →</div>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${renderActionPlan(`Concorrência`, `Posicionamento`, '', [
          { texto: `Criar "Battle Card" interno`, detalhe: `Documento comparando você vs cada concorrente principal. Inclua: diferenciais, objeções comuns e como respondê-las. Treine a equipe comercial.` },
          { texto: `Desenvolver 3 cases de sucesso destacando diferenciais`, detalhe: `Para cada diferencial principal, tenha um case que comprove. Formato: Desafio → Solução → Resultado com números.` },
          { texto: `Implementar ritual mensal de inteligência competitiva`, detalhe: `Reunião de 30min/mês para compartilhar novidades sobre concorrentes. Quem viu o quê? O que aprendemos? Como reagir?` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secPrecificacao = () => `<!-- ===== PRECIFICAÇÃO ===== -->
      ${(data.precificacao.produtos && data.precificacao.produtos.length > 0) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">💰</span>
            Precificação
          </div>
          <h2 class="section-title">Estratégia de Precificação</h2>
          <p class="section-description">Análise dos produtos/serviços e estratégias para maximização de valor percebido e receita.</p>
        </div>${chapterBanner(`precificacao`)}
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📊</div>
            <span class="info-box-title">Os 3 pilares da precificação estratégica</span>
          </div>
          <div class="info-box-text">
            <strong>1. Custo +:</strong> Calcule todos os custos e adicione margem. Base, mas não suficiente.<br>
            <strong>2. Concorrência:</strong> Posicione-se em relação aos concorrentes. Importante, mas não determinante.<br>
            <strong>3. Valor percebido:</strong> Quanto o cliente está disposto a pagar pelo resultado que você entrega? Este é o teto do seu preço.<br><br>
            <strong>Regra de ouro:</strong> Seu preço deve estar entre o custo mínimo e o valor percebido máximo. Quanto mais próximo do valor percebido, maior sua margem.
          </div>
        </div>
        
        ${data.precificacao.produtos.map((produto, idx) => `
        <div class="card" style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Produto/Serviço #${idx + 1}</div>
              <div style="font-size: 22px; font-weight: 800; color: var(--foreground);">${produto.nome || 'Produto sem nome'}</div>
              ${produto.descricao ? `<p style="color: var(--muted); font-size: 14px; margin-top: 6px; max-width: 400px;">${produto.descricao}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Preço Atual</div>
              <div style="font-size: 32px; font-weight: 900; color: var(--primary);">R$ ${produto.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          
          ${produto.precoAtual > 0 ? `
          <div style="margin-top: 24px;">
            <div style="font-size: 15px; font-weight: 700; margin-bottom: 16px; color: var(--foreground);">💡 6 Estratégias de Precificação para "${produto.nome}"</div>
            <div class="pricing-grid">
              <div class="pricing-suggestion pricing-1">
                <div class="pricing-suggestion-label">Valor Agregado (+40%)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 1.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Adicione garantia, suporte VIP e bônus exclusivos</div>
              </div>
              <div class="pricing-suggestion pricing-2">
                <div class="pricing-suggestion-label">Combo/Pacote (3 itens)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 2.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Cliente economiza 15%, você ganha +67% ticket</div>
              </div>
              <div class="pricing-suggestion pricing-3">
                <div class="pricing-suggestion-label">Versão Premium (2x)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Atendimento prioritário e exclusivo</div>
              </div>
              <div class="pricing-suggestion pricing-4">
                <div class="pricing-suggestion-label">Recorrência Mensal</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
                <div class="pricing-suggestion-hint">12x retorno anual garantido (receita previsível)</div>
              </div>
              <div class="pricing-suggestion pricing-5">
                <div class="pricing-suggestion-label">Baseado em ROI (3x)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Se gera 10x retorno, 3x é barato</div>
              </div>
              <div class="pricing-suggestion pricing-6">
                <div class="pricing-suggestion-label">Ancoragem Visual</div>
                <div class="pricing-suggestion-value" style="font-size: 14px;"><s style="opacity: 0.7;">R$ ${(produto.precoAtual * 2).toLocaleString('pt-BR')}</s> R$ ${produto.precoAtual.toLocaleString('pt-BR')}</div>
                <div class="pricing-suggestion-hint">Percepção de oportunidade/desconto</div>
              </div>
            </div>
          </div>
          
          <div class="implementation-guide" style="margin-top: 24px; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-color: var(--gold);">
            <div class="implementation-header">
              <div class="implementation-icon" style="background: var(--gold);">📈</div>
              <span class="implementation-title" style="color: #92400E;">Roteiro de implementação para "${produto.nome}"</span>
            </div>
            <div class="implementation-steps">
              <div class="implementation-step">
                <div class="implementation-step-number" style="background: var(--gold);">1</div>
                <div class="implementation-step-content">
                  <h4 style="color: #92400E;">Calcule seu custo real</h4>
                  <p style="color: #78350F;">Inclua: tempo de execução (seu e da equipe), custos fixos rateados, ferramentas, impostos. O preço atual de R$ ${produto.precoAtual.toLocaleString('pt-BR')} deixa qual margem líquida?</p>
                </div>
              </div>
              <div class="implementation-step">
                <div class="implementation-step-number" style="background: var(--gold);">2</div>
                <div class="implementation-step-content">
                  <h4 style="color: #92400E;">Teste uma estratégia nos próximos 30 dias</h4>
                  <p style="color: #78350F;">Recomendação: comece com Valor Agregado (+40%). Adicione: garantia de satisfação + 1 mês de suporte extra. Teste com 10 clientes e meça a conversão.</p>
                </div>
              </div>
              <div class="implementation-step">
                <div class="implementation-step-number" style="background: var(--gold);">3</div>
                <div class="implementation-step-content">
                  <h4 style="color: #92400E;">Analise os resultados</h4>
                  <p style="color: #78350F;">Se conversão cair menos de 20% com preço 40% maior, você está ganhando. Exemplo: vendia 10 a R$ ${produto.precoAtual.toLocaleString('pt-BR')} = R$ ${(produto.precoAtual * 10).toLocaleString('pt-BR')}. Se vender 8 a R$ ${(produto.precoAtual * 1.4).toLocaleString('pt-BR')} = R$ ${(produto.precoAtual * 1.4 * 8).toLocaleString('pt-BR')} (+${Math.round((1.4 * 8 / 10 - 1) * 100)}%).</p>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
        `).join('')}
        
        ${renderActionPlan(`Precificação`, `Receita`, '', [
          { texto: `Criar planilha de custos detalhada`, detalhe: `Para cada produto/serviço, liste todos os custos: diretos, indiretos, tempo envolvido. Calcule margem real atual.` },
          { texto: `Pesquisar willingness-to-pay com 10 clientes`, detalhe: `Pergunte: "Quanto você esperava pagar por este resultado?" - A média das respostas é seu teto de preço.` },
          { texto: `Implementar pelo menos 1 versão premium`, detalhe: `Escolha seu produto mais vendido e crie uma versão 2x mais cara com benefícios exclusivos. Mesmo que venda pouco, melhora a percepção do produto padrão.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secEstrategiasDeValor = () => `<!-- ===== ESTRATÉGIAS DE VALOR ===== -->
      ${data.estrategiasValor.novasOfertas.length > 0 || data.estrategiasValor.pacotes.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">💡</span>
            Inovação
          </div>
          <h2 class="section-title">Estratégias de Valor</h2>
          <p class="section-description">Novas formas de agregar valor e expandir o portfólio de ofertas para os clientes.</p>
        </div>${chapterBanner(`expansao`)}
        
        ${data.estrategiasValor.novasOfertas.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🚀</div>
            <span class="card-title">Novas Ofertas Planejadas</span>
          </div>
          <ul class="list">
            ${data.estrategiasValor.novasOfertas.map(o => `<li class="list-item"><span class="list-bullet"></span><span>${o}</span></li>`).join('')}
          </ul>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">🎯</div>
            <span class="implementation-title">Framework para lançar novas ofertas</span>
          </div>
          <div class="implementation-steps">
            ${data.estrategiasValor.novasOfertas.slice(0, 2).map((oferta, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>"${oferta}"</h4>
                <p><strong>Validação rápida:</strong> Antes de desenvolver, ofereça para 5 clientes atuais com desconto de lançamento. Se 2+ comprarem, desenvolva. Senão, repense ou descarte.<br>
                <strong>Lançamento:</strong> Base de clientes primeiro (mais fácil) → Marketing de conteúdo → Prospecção ativa.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.estrategiasValor.pacotes.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📦</div>
            <span class="card-title">Pacotes de Serviços</span>
          </div>
          <div class="package-grid">
            ${data.estrategiasValor.pacotes.map(p => `
              <div class="package-card">
                <div class="package-name">${p.nome}</div>
                <div class="package-price">${p.preco}</div>
                <div class="package-description">${p.descricao}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">🖥️</div>
            <div>
              <div class="visual-example-title">Modelo: Página de Preços Otimizada</div>
              <div class="visual-example-subtitle">Design que maximiza conversão</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(${Math.min(data.estrategiasValor.pacotes.length, 3)}, 1fr); gap: 16px;">
              ${data.estrategiasValor.pacotes.slice(0, 3).map((p, i) => `
                <div style="background: ${i === 1 ? 'var(--foreground)' : 'white'}; color: ${i === 1 ? 'white' : 'var(--foreground)'}; padding: 28px; border-radius: 12px; border: ${i === 1 ? 'none' : '1px solid var(--border)'}; text-align: center; ${i === 1 ? 'transform: scale(1.02);' : ''}">
                  ${i === 1 ? '<div style="font-size: 10px; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 100px; display: inline-block; margin-bottom: 14px;">MAIS POPULAR</div>' : ''}
                  <div style="font-weight: 600; font-size: 17px; margin-bottom: 10px;">${p.nome}</div>
                  <div style="font-size: 26px; font-weight: 700; margin-bottom: 14px;">${p.preco}</div>
                  <div style="font-size: 14px; opacity: 0.8; line-height: 1.6;">${p.descricao}</div>
                </div>
              `).join('')}
            </div>
            <div style="text-align: center; margin-top: 16px; font-size: 12px; color: var(--muted);">
              💡 Dica: O pacote do meio (marcado como "Mais Popular") converte até 60% mais. Use o pacote mais caro como âncora.
            </div>
          </div>
        </div>
        ` : ''}
        
        ${renderActionPlan(`Estratégias de Valor`, `Inovação`, '', [
          { texto: `Priorizar 1 nova oferta para os próximos 60 dias`, detalhe: `Critérios de escolha: menor esforço de desenvolvimento, maior demanda de clientes, melhor margem potencial. Foque 100% até lançar.` },
          { texto: `Criar página de vendas para cada pacote`, detalhe: `Estrutura: Headline com benefício principal → 3 bullets com o que inclui → Preço com âncora → Depoimentos → CTA urgente.` },
          { texto: `Treinar equipe no pitch de cada oferta`, detalhe: `Role-play semanal: cada vendedor deve saber apresentar cada pacote em 60 segundos, responder 3 objeções comuns e fazer pergunta de fechamento.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secMotoresDeCrescimento = () => `<!-- ===== MOTORES DE CRESCIMENTO ===== -->
      ${data.motoresCrescimento.motoresPrincipais.length > 0 || data.motoresCrescimento.canais.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🚀</span>
            Crescimento
          </div>
          <h2 class="section-title">Motores de Crescimento</h2>
          <p class="section-description">Os principais vetores que impulsionam o crescimento do negócio e os canais de aquisição de clientes.</p>
        </div>${chapterBanner(`crescimento`)}
        
        ${data.motoresCrescimento.motoresPrincipais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">⚡</div>
            <span class="card-title">Motores Principais de Crescimento</span>
          </div>
          <div class="tags">
            ${data.motoresCrescimento.motoresPrincipais.map(m => `<span class="tag">${m}</span>`).join('')}
          </div>
        </div>
        
        <!-- Estratégias detalhadas para cada motor -->
        ${data.motoresCrescimento.motoresPrincipais.map((motor, index) => {
          const strategies = generateMotorStrategies(motor);
          return `
          <div class="motor-detail" style="margin-top: 32px; padding: 28px; background: var(--primary-lighter); border-radius: 16px; border-left: 4px solid var(--accent);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <div style="width: 36px; height: 36px; background: var(--accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">${index + 1}</div>
              <h3 style="font-size: 20px; font-weight: 600; color: var(--foreground); margin: 0;">${motor}</h3>
            </div>
            
            <div style="display: grid; gap: 24px;">
              <!-- Estratégias -->
              <div>
                <h4 style="font-size: 14px; font-weight: 600; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                  <span>🎯</span> Estratégias Principais
                </h4>
                <ul style="margin: 0; padding-left: 20px; list-style: disc;">
                  ${strategies.estrategias.map(e => `<li style="margin-bottom: 8px; color: var(--foreground); font-size: 14px; line-height: 1.6;">${e}</li>`).join('')}
                </ul>
              </div>
              
              <!-- Implementação -->
              <div>
                <h4 style="font-size: 14px; font-weight: 600; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                  <span>📋</span> Plano de Implementação
                </h4>
                <div style="display: grid; gap: 8px;">
                  ${strategies.implementacao.map((step, i) => `
                    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: white; border-radius: 8px;">
                      <span style="width: 24px; height: 24px; background: var(--foreground); color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0;">${i + 1}</span>
                      <span style="font-size: 14px; color: var(--foreground);">${step}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <!-- Métricas e Ferramentas -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <h4 style="font-size: 14px; font-weight: 600; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>📊</span> Métricas a Acompanhar
                  </h4>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${strategies.metricas.map(m => `<span style="background: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; color: var(--foreground);">${m}</span>`).join('')}
                  </div>
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 600; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>🛠️</span> Ferramentas Sugeridas
                  </h4>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${strategies.ferramentas.map(f => `<span style="background: var(--accent-light); padding: 6px 12px; border-radius: 6px; font-size: 12px; color: var(--accent);">${f}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
        }).join('')}
        ` : ''}
        
        ${data.motoresCrescimento.canais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📢</div>
            <span class="card-title">Canais de Aquisição</span>
          </div>
          <div class="tags">
            ${data.motoresCrescimento.canais.map(c => `<span class="tag tag-accent">${c}</span>`).join('')}
          </div>
        </div>
        
        <div class="insight-box">
          <div class="insight-box-title">💡 Regra 70-20-10 para canais</div>
          <div class="insight-box-text">
            <strong>70%</strong> do investimento no canal que já funciona (provavelmente "${data.motoresCrescimento.canais[0] || 'seu canal principal'}")<br>
            <strong>20%</strong> no segundo melhor canal para escalar<br>
            <strong>10%</strong> em experimentos com novos canais<br><br>
            Não tente estar em todos os lugares ao mesmo tempo. Domine um canal antes de ir para o próximo.
          </div>
        </div>
        ` : ''}
        
        ${data.motoresCrescimento.metricas.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📊</div>
            <span class="card-title">Métricas e Metas</span>
          </div>
          ${data.motoresCrescimento.metricas.map(m => `
            <div class="metric-visual">
              <div class="metric-visual-header">
                <span class="metric-visual-name">${m.nome}</span>
                <span class="metric-visual-target">${m.meta}</span>
              </div>
              <div class="metric-visual-bar">
                <div class="metric-visual-fill" style="width: 50%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">📈</div>
            <span class="suggestion-title">Como monitorar métricas de crescimento</span>
          </div>
          <div class="suggestion-text">
            <strong>Dashboard semanal:</strong> Crie uma planilha simples (Google Sheets) com todas as métricas. Atualize toda segunda-feira.<br><br>
            <strong>Reunião de 15 minutos:</strong> Toda semana, mesmo dia/hora, revise: "A métrica subiu, desceu ou estabilizou? Por quê? O que fazer diferente?"<br><br>
            <strong>Dono da métrica:</strong> Cada métrica deve ter 1 responsável. Esta pessoa é cobrada pelo resultado.
          </div>
        </div>
        ` : ''}
        
        ${renderActionPlan(`Crescimento`, `Escala`, '', [
          { texto: `Criar dashboard de métricas de crescimento`, detalhe: `Inclua: leads gerados, taxa de conversão, ticket médio, CAC, LTV. Atualize semanalmente. Compartilhe com a equipe.` },
          { texto: `Implementar programa de indicação estruturado`, detalhe: `Ofereça: desconto para quem indica E para quem foi indicado. Peça indicações no momento de máxima satisfação (após entrega bem-sucedida).` },
          { texto: `Definir experimento de canal para próximo trimestre`, detalhe: `Escolha 1 novo canal para testar com 10% do orçamento. Defina critério de sucesso antes de começar. Se funcionar, escale; se não, descarte sem remorso.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secOrganograma = () => `<!-- ===== ORGANOGRAMA ===== -->
      ${data.organograma.cargos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">👥</span>
            Estrutura
          </div>
          <h2 class="section-title">Estrutura Organizacional</h2>
          <p class="section-description">Desenho da estrutura de cargos, responsabilidades e indicadores de cada posição.</p>
        </div>${chapterBanner(`organizacao`)}
        
        <div class="org-chart">
          ${[1, 2, 3].map(nivel => {
            const cargosNivel = data.organograma.cargos.filter(c => c.nivel === nivel);
            if (cargosNivel.length === 0) return '';
            return `
              <div class="org-level org-level-${nivel}">
                <div class="org-level-header">
                  <div class="org-level-dot"></div>
                  <span class="org-level-title">${nivel === 1 ? '🏆 Nível Estratégico' : nivel === 2 ? '⚙️ Nível Tático' : '🔧 Nível Operacional'}</span>
                </div>
                <div class="org-cards">
                  ${cargosNivel.map(cargo => {
                    const checklist = generateCargoChecklist(cargo);
                    return `
                    <div class="org-card">
                      <div class="org-title">${cargo.titulo}</div>
                      <div class="org-subordinate">Subordinado a: ${cargo.subordinadoA || 'Proprietário'}</div>
                      <div class="org-section">
                        <div class="org-section-title">Responsabilidades</div>
                        <div class="org-responsibilities">${Array.isArray(cargo.responsabilidades) ? cargo.responsabilidades.join(', ') : cargo.responsabilidades}</div>
                      </div>
                      ${cargo.kpis && cargo.kpis.length > 0 ? `
                      <div class="org-section">
                        <div class="org-section-title">Indicadores (KPIs)</div>
                        <div class="org-kpis">
                          ${cargo.kpis.map(kpi => `<span class="org-kpi">${kpi}</span>`).join('')}
                        </div>
                      </div>
                      ` : ''}
                      <div class="org-section" style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border);">
                        <div class="org-section-title" style="color: var(--accent);">✅ Checklist de Atividades Sugeridas</div>
                        <div class="org-checklist" style="margin-top: 12px;">
                          ${checklist.map(item => `
                            <div class="org-checklist-item" style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 13px; color: var(--muted);">
                              <span style="color: var(--accent); flex-shrink: 0;">☐</span>
                              <span>${item}</span>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </div>`;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        ${renderActionPlan(`Organograma`, `Pessoas`, ' style="margin-top: 32px;"', [
          { texto: `Comunicar estrutura para toda equipe`, detalhe: `Reunião de apresentação: quem responde a quem, quais são as responsabilidades de cada um. Deixe claro "quem procurar para quê".` },
          { texto: `Criar descrição de cargo formal para cada posição`, detalhe: `Inclua: objetivo do cargo, responsabilidades detalhadas, competências necessárias, KPIs. Use para avaliações e contratações.` },
          { texto: `Implementar reuniões 1:1 mensais`, detalhe: `Cada gestor com seus subordinados diretos. Pauta: feedback de desempenho, evolução dos KPIs, desenvolvimento profissional, impedimentos.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secProcessos = () => `<!-- ===== PROCESSOS ===== -->
      ${data.processos.lista.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">⚙️</span>
            Operações
          </div>
          <h2 class="section-title">Processos Operacionais</h2>
          <p class="section-description">Mapeamento dos processos-chave do negócio, suas frequências e responsáveis.</p>
        </div>${chapterBanner(`processos`)}
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📋</div>
            <span class="info-box-title">Por que documentar processos?</span>
          </div>
          <div class="info-box-text">
            <strong>Consistência:</strong> Todos fazem da mesma forma, mesmo resultado sempre.<br>
            <strong>Escalabilidade:</strong> Fácil treinar novos colaboradores. O conhecimento não depende de uma pessoa.<br>
            <strong>Melhoria contínua:</strong> Só é possível melhorar o que está documentado e medido.<br>
            <strong>Valor do negócio:</strong> Empresas com processos documentados valem mais em caso de venda.
          </div>
        </div>
        
        ${data.processos.lista.map(p => `
          <div class="process-card">
            <div class="process-header">
              <span class="process-name">${p.nome}</span>
              <span class="process-frequency">${p.frequencia}</span>
            </div>
            <div class="process-description">${p.descricao}</div>
            <div class="process-responsible">👤 ${p.responsavel}</div>
          </div>
        `).join('')}
        
        ${renderActionPlan(`Processos`, `Eficiência`, ' style="margin-top: 32px;"', [
          { texto: `Criar POPs (Procedimentos Operacionais Padrão)`, detalhe: `Para cada processo listado, documente passo-a-passo: o que fazer, como fazer, ferramentas usadas, critérios de qualidade. Use Google Docs ou Notion.` },
          { texto: `Criar checklists para processos críticos`, detalhe: `Identifique os 3 processos mais importantes e crie checklists que garantam que nada será esquecido. Revise e atualize trimestralmente.` },
          { texto: `Implementar indicadores para cada processo`, detalhe: `Exemplo: processo de vendas → taxa de conversão, tempo de ciclo. Processo financeiro → prazo médio de recebimento, inadimplência.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secFinanceiro = () => `<!-- ===== FINANCEIRO ===== -->
      ${data.financeiro.faturamentoMensal > 0 || data.financeiro.faturamentoAtual > 0 || data.financeiro.margemLucro > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">💰</span>
            Finanças
          </div>
          <h2 class="section-title">Análise Financeira Completa</h2>
          <p class="section-description">Visão abrangente da saúde financeira, indicadores de desempenho e análise de endividamento.</p>
        </div>${chapterBanner(`financeiro`)}
        
        <!-- Indicadores Principais -->
        <div class="card" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">📊</div>
            <span class="card-title">Indicadores Principais</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.faturamentoAtual > 0 || data.financeiro.faturamentoMensal > 0 ? `
            <div class="data-item">
              <div class="data-label">Faturamento Mensal</div>
              <div class="data-value" style="color: #16a34a;">${formatCurrency(data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal)}</div>
            </div>
            ` : ''}
            ${(data.financeiro.despesasFixas > 0 || data.financeiro.despesasVariaveis > 0) ? `
            <div class="data-item">
              <div class="data-label">Despesas Totais</div>
              <div class="data-value" style="color: #dc2626;">${formatCurrency(data.financeiro.despesasFixas + data.financeiro.despesasVariaveis)}</div>
            </div>
            ` : ''}
            ${(data.financeiro.faturamentoAtual > 0 || data.financeiro.faturamentoMensal > 0) && (data.financeiro.despesasFixas > 0 || data.financeiro.despesasVariaveis > 0) ? `
            <div class="data-item">
              <div class="data-label">Lucro Líquido Estimado</div>
              <div class="data-value" style="color: ${(data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) - data.financeiro.despesasFixas - data.financeiro.despesasVariaveis >= 0 ? '#16a34a' : '#dc2626'};">
                ${formatCurrency((data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) - data.financeiro.despesasFixas - data.financeiro.despesasVariaveis)}
              </div>
            </div>
            ` : ''}
            ${data.financeiro.margemLucro > 0 || data.financeiro.margemAtual > 0 ? `
            <div class="data-item">
              <div class="data-label">Margem de Lucro</div>
              <div class="data-value" style="color: ${(data.financeiro.margemLucro || data.financeiro.margemAtual) >= 20 ? '#16a34a' : (data.financeiro.margemLucro || data.financeiro.margemAtual) >= 10 ? '#ea580c' : '#dc2626'};">
                ${data.financeiro.margemLucro || data.financeiro.margemAtual}%
              </div>
            </div>
            ` : ''}
            ${data.financeiro.pontoEquilibrio > 0 ? `
            <div class="data-item">
              <div class="data-label">Ponto de Equilíbrio</div>
              <div class="data-value">${formatCurrency(data.financeiro.pontoEquilibrio)}</div>
            </div>
            ` : ''}
            ${data.financeiro.metaFaturamento > 0 ? `
            <div class="data-item">
              <div class="data-label">Meta de Faturamento</div>
              <div class="data-value" style="color: #7c3aed;">${formatCurrency(data.financeiro.metaFaturamento)}</div>
            </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Indicadores de Clientes -->
        ${(data.financeiro.ticketMedio > 0 || data.financeiro.quantidadeClientes > 0 || data.financeiro.cac > 0 || data.financeiro.ltv > 0) ? `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">👥</div>
            <span class="card-title">Indicadores de Clientes</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.quantidadeClientes > 0 ? `
            <div class="data-item">
              <div class="data-label">Clientes Ativos</div>
              <div class="data-value">${data.financeiro.quantidadeClientes}</div>
            </div>
            ` : ''}
            ${data.financeiro.ticketMedio > 0 ? `
            <div class="data-item">
              <div class="data-label">Ticket Médio</div>
              <div class="data-value">${formatCurrency(data.financeiro.ticketMedio)}</div>
            </div>
            ` : ''}
            ${data.financeiro.cac > 0 ? `
            <div class="data-item">
              <div class="data-label">CAC (Custo de Aquisição)</div>
              <div class="data-value">${formatCurrency(data.financeiro.cac)}</div>
            </div>
            ` : ''}
            ${data.financeiro.ltv > 0 ? `
            <div class="data-item">
              <div class="data-label">LTV (Lifetime Value)</div>
              <div class="data-value">${formatCurrency(data.financeiro.ltv)}</div>
            </div>
            ` : ''}
            ${data.financeiro.cac > 0 && data.financeiro.ltv > 0 ? `
            <div class="data-item">
              <div class="data-label">Ratio LTV/CAC</div>
              <div class="data-value" style="color: ${(data.financeiro.ltv / data.financeiro.cac) >= 3 ? '#16a34a' : '#ea580c'};">
                ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x
              </div>
            </div>
            ` : ''}
          </div>
          ${data.financeiro.cac > 0 && data.financeiro.ltv > 0 ? `
          <div class="insight-box" style="margin-top: 16px;">
            <div class="insight-box-title">💡 Análise LTV/CAC</div>
            <div class="insight-box-text">
              ${(data.financeiro.ltv / data.financeiro.cac) >= 3 
                ? `<strong style="color: #16a34a;">Excelente!</strong> O ratio de ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x indica que cada real investido em aquisição retorna mais de 3x em valor ao longo do tempo. Continue investindo em aquisição.`
                : (data.financeiro.ltv / data.financeiro.cac) >= 2
                  ? `<strong style="color: #ea580c;">Atenção:</strong> O ratio de ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x está abaixo do ideal (3x). Trabalhe para aumentar o LTV (upsell, retenção) ou reduzir o CAC.`
                  : `<strong style="color: #dc2626;">Crítico:</strong> O ratio de ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x é insustentável. Revise urgentemente sua estratégia de aquisição e retenção de clientes.`}
            </div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- Fluxo de Caixa e Liquidez -->
        ${(data.financeiro.prazoMedioRecebimento > 0 || data.financeiro.prazoMedioPagamento > 0 || data.financeiro.capitalGiro > 0 || data.financeiro.reservaEmergencia > 0) ? `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">💵</div>
            <span class="card-title">Fluxo de Caixa e Liquidez</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.prazoMedioRecebimento > 0 ? `
            <div class="data-item">
              <div class="data-label">Prazo Médio Recebimento</div>
              <div class="data-value">${data.financeiro.prazoMedioRecebimento} dias</div>
            </div>
            ` : ''}
            ${data.financeiro.prazoMedioPagamento > 0 ? `
            <div class="data-item">
              <div class="data-label">Prazo Médio Pagamento</div>
              <div class="data-value">${data.financeiro.prazoMedioPagamento} dias</div>
            </div>
            ` : ''}
            ${data.financeiro.prazoMedioRecebimento > 0 && data.financeiro.prazoMedioPagamento > 0 ? `
            <div class="data-item">
              <div class="data-label">Ciclo Financeiro</div>
              <div class="data-value" style="color: ${(data.financeiro.prazoMedioRecebimento - data.financeiro.prazoMedioPagamento) <= 0 ? '#16a34a' : '#ea580c'};">
                ${data.financeiro.prazoMedioRecebimento - data.financeiro.prazoMedioPagamento} dias
              </div>
            </div>
            ` : ''}
            ${data.financeiro.capitalGiro > 0 ? `
            <div class="data-item">
              <div class="data-label">Capital de Giro</div>
              <div class="data-value">${formatCurrency(data.financeiro.capitalGiro)}</div>
            </div>
            ` : ''}
            ${data.financeiro.reservaEmergencia > 0 ? `
            <div class="data-item">
              <div class="data-label">Reserva de Emergência</div>
              <div class="data-value">${formatCurrency(data.financeiro.reservaEmergencia)}</div>
            </div>
            ` : ''}
            ${data.financeiro.reservaEmergencia > 0 && data.financeiro.despesasFixas > 0 ? `
            <div class="data-item">
              <div class="data-label">Meses de Reserva</div>
              <div class="data-value" style="color: ${(data.financeiro.reservaEmergencia / data.financeiro.despesasFixas) >= 6 ? '#16a34a' : (data.financeiro.reservaEmergencia / data.financeiro.despesasFixas) >= 3 ? '#ea580c' : '#dc2626'};">
                ${(data.financeiro.reservaEmergencia / data.financeiro.despesasFixas).toFixed(1)}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        <!-- Endividamento -->
        ${(data.financeiro.dividas && data.financeiro.dividas.length > 0) || data.financeiro.totalDividas > 0 ? `
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid #dc2626;">
          <div class="card-header">
            <div class="card-icon">💳</div>
            <span class="card-title">Análise de Endividamento</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.totalDividas > 0 ? `
            <div class="data-item">
              <div class="data-label">Total de Dívidas</div>
              <div class="data-value" style="color: #dc2626;">${formatCurrency(data.financeiro.totalDividas)}</div>
            </div>
            ` : ''}
            ${data.financeiro.dividas && data.financeiro.dividas.length > 0 ? `
            <div class="data-item">
              <div class="data-label">Parcelas Mensais</div>
              <div class="data-value" style="color: #ea580c;">
                ${formatCurrency(data.financeiro.dividas.reduce((acc: number, d: any) => acc + (d.parcelasMensais || 0), 0))}
              </div>
            </div>
            ` : ''}
            ${data.financeiro.comprometimentoReceita > 0 ? `
            <div class="data-item">
              <div class="data-label">Comprometimento da Receita</div>
              <div class="data-value" style="color: ${data.financeiro.comprometimentoReceita > 30 ? '#dc2626' : data.financeiro.comprometimentoReceita > 15 ? '#ea580c' : '#16a34a'};">
                ${data.financeiro.comprometimentoReceita}%
              </div>
            </div>
            ` : ''}
          </div>
          
          ${data.financeiro.dividas && data.financeiro.dividas.length > 0 ? `
          <div class="table-container" style="margin-top: 16px;">
            <table class="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor Total</th>
                  <th>Parcela Mensal</th>
                  <th>Parcelas Restantes</th>
                  <th>Taxa de Juros</th>
                </tr>
              </thead>
              <tbody>
                ${data.financeiro.dividas.map((d: any) => `
                <tr>
                  <td><strong>${d.descricao}</strong></td>
                  <td>${formatCurrency(d.valorTotal)}</td>
                  <td>${formatCurrency(d.parcelasMensais)}</td>
                  <td>${d.parcelasRestantes}x</td>
                  <td>${d.taxaJuros}% a.m.</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          ${data.financeiro.comprometimentoReceita > 15 ? `
          <div class="insight-box" style="margin-top: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);">
            <div class="insight-box-title" style="color: #dc2626;">⚠️ Alerta de Endividamento</div>
            <div class="insight-box-text">
              ${data.financeiro.comprometimentoReceita > 30 
                ? `<strong>Nível crítico!</strong> Com ${data.financeiro.comprometimentoReceita}% da receita comprometida com dívidas, o fluxo de caixa está severamente impactado. Priorize: renegociação de dívidas, consolidação em taxas menores e aumento de receita.`
                : `<strong>Atenção requerida:</strong> ${data.financeiro.comprometimentoReceita}% de comprometimento está acima do ideal (15%). Considere refinanciar dívidas de maior taxa e criar plano de quitação antecipada.`}
            </div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- Análise Geral -->
        ${(data.financeiro.faturamentoAtual > 0 || data.financeiro.faturamentoMensal > 0) && (data.financeiro.margemLucro > 0 || data.financeiro.margemAtual > 0) ? `
        <div class="insight-box" style="margin-bottom: 24px;">
          <div class="insight-box-title">💡 Diagnóstico Financeiro</div>
          <div class="insight-box-text">
            <strong>Lucro líquido estimado: ${formatCurrency((data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) * (data.financeiro.margemLucro || data.financeiro.margemAtual) / 100)}/mês</strong><br><br>
            ${(data.financeiro.margemLucro || data.financeiro.margemAtual) < 10 
              ? '🔴 <strong>Margem crítica:</strong> Abaixo de 10% compromete a sustentabilidade. Ações urgentes: revisar precificação, cortar custos não essenciais, renegociar com fornecedores.'
              : (data.financeiro.margemLucro || data.financeiro.margemAtual) < 20
                ? '🟡 <strong>Margem moderada:</strong> Há espaço para otimização. Foque em: eficiência operacional, automação de processos e estratégias de valor agregado.'
                : '🟢 <strong>Margem saudável:</strong> Continue otimizando e reinvista parte do lucro em crescimento sustentável.'}
            ${data.financeiro.metaFaturamento > 0 && (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) < data.financeiro.metaFaturamento 
              ? `<br><br>📈 <strong>Gap para meta:</strong> ${formatCurrency(data.financeiro.metaFaturamento - (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal))} (${(((data.financeiro.metaFaturamento - (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal)) / (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal)) * 100).toFixed(0)}% de crescimento necessário)`
              : ''}
          </div>
        </div>
        ` : ''}
        
        <!-- Riscos Identificados -->
        ${data.financeiro.riscos && data.financeiro.riscos.length > 0 ? `
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid #ea580c;">
          <div class="card-header">
            <div class="card-icon">⚠️</div>
            <span class="card-title">Riscos Financeiros Identificados</span>
          </div>
          <ul style="margin: 0; padding-left: 20px;">
            ${data.financeiro.riscos.map((r: string) => `<li style="padding: 8px 0; color: #374151;">${r}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <!-- Oportunidades -->
        ${data.financeiro.oportunidades && data.financeiro.oportunidades.length > 0 ? `
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid #16a34a;">
          <div class="card-header">
            <div class="card-icon">💡</div>
            <span class="card-title">Oportunidades de Melhoria Financeira</span>
          </div>
          <ul style="margin: 0; padding-left: 20px;">
            ${data.financeiro.oportunidades.map((o: string) => `<li style="padding: 8px 0; color: #374151;">${o}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <!-- Investimentos -->
        ${data.financeiro.investimentos && data.financeiro.investimentos.length > 0 ? `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">📈</div>
            <span class="card-title">Investimentos Planejados</span>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Valor</th>
                  <th>Prazo</th>
                  <th>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                ${data.financeiro.investimentos.map((inv: any) => `
                  <tr>
                    <td><strong>${inv.area}</strong></td>
                    <td>${formatCurrency(inv.valor)}</td>
                    <td>${inv.prazo}</td>
                    <td><span class="priority priority-${inv.prioridade.toLowerCase()}">${inv.prioridade}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}
        
        <!-- Plano de Ação -->
        ${renderActionPlan(`Financeiro`, `Saúde Financeira`, ' style="margin-top: 32px;"', [
          { texto: `Implementar DRE mensal gerencial`, detalhe: `Feche o mês até dia 5 e analise: receita, custos variáveis, margem de contribuição, custos fixos e lucro líquido. Decisões sem DRE são tiros no escuro.` },
          { texto: `Monitorar indicadores-chave semanalmente`, detalhe: `CAC, LTV, ticket médio, inadimplência, ciclo financeiro. Monte um dashboard simples e revise toda segunda-feira. O que não é medido não é gerenciado.` },
          { texto: `Criar reserva de emergência empresarial`, detalhe: `Meta: 6 meses de custos fixos. Separe 10% do lucro mensalmente. Isso permite tomar decisões de longo prazo sem pressão de caixa.` },
          { cond: data.financeiro.comprometimentoReceita > 15, numero: '4', texto: `Renegociar e consolidar dívidas`, detalhe: `Priorize quitar dívidas de maior taxa. Considere consolidação em linha de crédito mais barata. Meta: comprometimento abaixo de 15% da receita.` },
          { cond: data.financeiro.cac > 0 && data.financeiro.ltv > 0 && (data.financeiro.ltv / data.financeiro.cac) < 3, numero: data.financeiro.comprometimentoReceita > 15 ? '5' : '4', texto: `Melhorar ratio LTV/CAC`, detalhe: `Para aumentar LTV: programas de fidelização, upsell, cross-sell. Para reduzir CAC: refine o ICP, melhore conversão, foque em canais orgânicos.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secSwotPessoal = () => `<!-- ===== SWOT PESSOAL ===== -->
      ${data.swotPessoal && (data.swotPessoal.forcas.length > 0 || data.swotPessoal.fraquezas.length > 0) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">👤</span>
            Líder
          </div>
          <h2 class="section-title">SWOT Pessoal do Líder</h2>
          <p class="section-description">Análise das forças, fraquezas, oportunidades e ameaças do líder/empreendedor como pessoa.</p>
        </div>${chapterBanner(`cultura`)}
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">🎯</div>
            <span class="info-box-title">Por que fazer SWOT Pessoal?</span>
          </div>
          <div class="info-box-text">
            O desempenho da empresa é diretamente ligado ao desenvolvimento do líder. Empresas pequenas/médias são um espelho do seu fundador.
            Conhecer suas forças permite potencializá-las; conhecer fraquezas permite compensá-las (delegando, contratando ou desenvolvendo).
          </div>
        </div>
        
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-header">
              <div class="swot-icon">💪</div>
              <span class="swot-title">Forças Pessoais</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.forcas.length > 0 ? data.swotPessoal.forcas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-fraquezas">
            <div class="swot-header">
              <div class="swot-icon">⚠️</div>
              <span class="swot-title">Fraquezas Pessoais</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.fraquezas.length > 0 ? data.swotPessoal.fraquezas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-oportunidades">
            <div class="swot-header">
              <div class="swot-icon">🚀</div>
              <span class="swot-title">Oportunidades de Desenvolvimento</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.oportunidades.length > 0 ? data.swotPessoal.oportunidades.map(o => `• ${o}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-ameacas">
            <div class="swot-header">
              <div class="swot-icon">⚡</div>
              <span class="swot-title">Ameaças/Riscos Pessoais</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.ameacas.length > 0 ? data.swotPessoal.ameacas.map(a => `• ${a}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
        </div>
        
        ${data.swotPessoal.fraquezas.length > 0 ? `
        <div class="implementation-guide" style="margin-top: 32px;">
          <div class="implementation-header">
            <div class="implementation-icon">🛠️</div>
            <span class="implementation-title">Plano de desenvolvimento para fraquezas</span>
          </div>
          <div class="implementation-steps">
            ${data.swotPessoal.fraquezas.slice(0, 3).map((fraq, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>Fraqueza: "${fraq}"</h4>
                <p><strong>Opção A - Desenvolver:</strong> Busque curso, mentoria ou coaching específico. Dedique 1h/semana nos próximos 3 meses.<br>
                <strong>Opção B - Delegar:</strong> Contrate ou designe alguém que tenha esta como força. Libere-se para focar no que faz bem.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${renderActionPlan(`Desenvolvimento Pessoal`, `Liderança`, '', [
          { texto: `Buscar feedback 360° com equipe e clientes`, detalhe: `Pergunte: "O que eu faço bem? O que eu poderia melhorar? O que eu deveria parar de fazer?" Faça anotações e compare com sua autoavaliação.` },
          { texto: `Definir 1 competência para desenvolver no trimestre`, detalhe: `Escolha a fraqueza que mais impacta o negócio. Defina ações: curso, livro, mentoria. Avalie progresso mensalmente.` },
          { texto: `Criar rotina de autocuidado`, detalhe: `Empreendedor exausto toma decisões ruins. Defina: exercício 3x/semana, 7h+ de sono, 1 dia de folga real por semana. Energia é recurso estratégico.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secAgendaCeo = () => `<!-- ===== AGENDA CEO ===== -->
      ${data.agendaCEO && (data.agendaCEO.prioridades.length > 0 || (data.agendaCEO.rotinas && data.agendaCEO.rotinas.length > 0)) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">📅</span>
            Gestão do Tempo
          </div>
          <h2 class="section-title">Agenda Estratégica do CEO</h2>
          <p class="section-description">Prioridades, rotinas e delegações definidas para maximizar o impacto do líder no negócio.</p>
        </div>${chapterBanner(`cultura`)}
        
        ${data.agendaCEO.prioridades.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Prioridades Estratégicas</span>
          </div>
          <ul class="list">
            ${data.agendaCEO.prioridades.map((p, i) => `
              <li class="list-item">
                <span style="width: 28px; height: 28px; background: var(--foreground); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">${i + 1}</span>
                <span>${typeof p === 'string' ? p : p.descricao}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="insight-box">
          <div class="insight-box-title">💡 Regra do CEO: Foco implacável</div>
          <div class="insight-box-text">
            Como CEO/líder, você deve dedicar <strong>80% do seu tempo</strong> às ${Math.min(3, data.agendaCEO.prioridades.length)} prioridades acima.<br><br>
            Tudo que não está nesta lista é <strong>delegável</strong>. Cada hora gasta em atividades fora das prioridades é uma hora roubada do crescimento da empresa.
          </div>
        </div>
        ` : ''}
        
        ${data.agendaCEO.rotinas && data.agendaCEO.rotinas.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🔄</div>
            <span class="card-title">Rotinas de Gestão</span>
          </div>
          ${data.agendaCEO.rotinas.map(r => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border);">
              <div>
                <div style="font-weight: 600; color: var(--foreground);">${r.atividade}</div>
                <div style="font-size: 12px; color: var(--muted);">Frequência: ${r.frequencia}</div>
              </div>
              <span class="tag">${r.dia || 'A definir'}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${data.agendaCEO.delegacoes && data.agendaCEO.delegacoes.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🤝</div>
            <span class="card-title">Delegações Definidas</span>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Atividade</th>
                  <th>Delegado para</th>
                </tr>
              </thead>
              <tbody>
                ${data.agendaCEO.delegacoes.map(d => `
                  <tr>
                    <td>${d.atividade}</td>
                    <td><strong>${d.para}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🎓</div>
            <span class="suggestion-title">Como delegar efetivamente</span>
          </div>
          <div class="suggestion-text">
            <strong>1. Delegue resultados, não tarefas:</strong> "Quero o relatório pronto até sexta" ao invés de "Faça X, depois Y, depois Z".<br><br>
            <strong>2. Dê contexto:</strong> Explique por que aquilo é importante. Pessoas motivadas entregam melhor.<br><br>
            <strong>3. Defina critérios de sucesso:</strong> O que significa "bem feito"? Evite retrabalho definindo antes.<br><br>
            <strong>4. Check-ins, não microgerenciamento:</strong> Combine pontos de verificação, não fique em cima a cada hora.
          </div>
        </div>
        ` : ''}
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📅</div>
            <div>
              <div class="visual-example-title">Modelo: Semana Ideal do CEO</div>
              <div class="visual-example-subtitle">Estrutura sugerida para máxima produtividade</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center; font-size: 11px;">
              <div style="background: var(--primary-lighter); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">Segunda</div>
                <div style="color: var(--foreground);">🎯 Planejamento<br>📊 Revisão métricas<br>📞 1:1s equipe</div>
              </div>
              <div style="background: var(--accent-light); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--accent); margin-bottom: 8px;">Terça</div>
                <div style="color: var(--foreground);">💼 Clientes<br>🤝 Parceiros<br>📈 Vendas</div>
              </div>
              <div style="background: var(--gold-light); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--gold); margin-bottom: 8px;">Quarta</div>
                <div style="color: var(--foreground);">🧠 Deep work<br>📝 Estratégia<br>🚫 Sem reuniões</div>
              </div>
              <div style="background: var(--accent-light); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--accent); margin-bottom: 8px;">Quinta</div>
                <div style="color: var(--foreground);">💼 Clientes<br>🎓 Treinamento<br>🔧 Operacional</div>
              </div>
              <div style="background: var(--primary-lighter); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">Sexta</div>
                <div style="color: var(--foreground);">📋 Revisão semana<br>🎯 Próxima semana<br>🎉 Celebrações</div>
              </div>
            </div>
          </div>
        </div>
        
        ${renderActionPlan(`Agenda CEO`, `Produtividade`, '', [
          { texto: `Bloquear tempo para prioridades no calendário`, detalhe: `Reserve blocos de 2-3h para trabalho focado nas prioridades. Marque como "ocupado". Proteja esse tempo como uma reunião com o cliente mais importante.` },
          { texto: `Implementar "No Meeting Wednesday"`, detalhe: `Um dia por semana sem reuniões para trabalho estratégico profundo. Comunique para equipe e respeite o combinado.` },
          { texto: `Fazer auditoria de tempo por 1 semana`, detalhe: `Anote tudo que faz e quanto tempo gasta. Depois analise: quanto foi em prioridades? Quanto poderia delegar? Ajuste agenda baseado nos dados.` }
        ])}
      </div>
      ` : ''}
      
      `;
  const secProximosPassos = () => `<!-- ===== PRÓXIMOS PASSOS ===== -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">📋</span>
            Encerramento
          </div>
          <h2 class="section-title">Próximos Passos</h2>
        </div>

        <div class="insight-box">
          <div class="insight-box-text">
            O diagnóstico identifica oportunidades e define uma direção estratégica para a empresa.<br><br>
            Os melhores resultados são obtidos quando as ações são implementadas de forma disciplinada, acompanhadas periodicamente e ajustadas conforme os indicadores evoluem.<br><br>
            Este relatório deve ser utilizado como referência para orientar as decisões dos próximos 12 meses.
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📊</div>
            <div>
              <div class="visual-example-title">Panorama Geral</div>
              <div class="visual-example-subtitle">Status atual da ${project.nomeEmpresa}</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${overallProgress}%</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Diagnóstico Completo</div>
              </div>
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${avgMaturity}</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Maturidade Média</div>
              </div>
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${blocks.filter(b => b.progress === 100).length}</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Blocos Completos</div>
              </div>
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${blocks.length}</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Total de Blocos</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Lembre-se</div>
          <div class="insight-box-text">
            Este documento é um <strong>ponto de partida</strong>, não um ponto final. A execução disciplinada das ações propostas é o que transforma diagnóstico em resultado.<br><br>
            <strong>Sugestão:</strong> Revise este documento mensalmente. Marque o que foi feito, ajuste o que precisa e comemore as vitórias.
          </div>
        </div>
      </div>
      
      `;
  const secFooter = () => `<!-- ===== FOOTER ===== -->
    <div class="footer">
      <div class="footer-logo">📊</div>
      <div class="footer-title">Plano de Estruturação em Gestão</div>
      <div class="footer-text">${project.nomeEmpresa} | Documento Estratégico Confidencial</div>
      <div class="footer-date">Gerado em ${formatDate(new Date().toISOString())}</div>
    </div>
    
  </div>
</body>
</html>
`;

  let html = [
    secDocumentHead(),
    secEditToolbar(),
    secCoverPage(),
    secContent(),
    secResumoExecutivo(),
    secRoadmapDeImplementacao(),
    secCompanyInfo(),
    secGoldenCircle(),
    secIdentidadeOrganizacional(),
    secSwot(),
    secDiagnostico(),
    secIcp(),
    secConcorrentes(),
    secPrecificacao(),
    secEstrategiasDeValor(),
    secMotoresDeCrescimento(),
    secOrganograma(),
    secProcessos(),
    secFinanceiro(),
    secSwotPessoal(),
    secAgendaCeo(),
    secProximosPassos(),
    secFooter()
  ].join('');;

  // ============================================================
  // Roadmap Executivo — 8 iniciativas estratégicas fixas (arquitetura
  // canônica, D1). Horizonte derivado da maturidade da dimensão
  // relacionada. Detalhamento operacional vive nos capítulos.
  // ============================================================
  const roadmapHtml = `
    <!-- ===== ROADMAP EXECUTIVO ===== -->
    <div class="section">
      <div class="section-header">
        <div class="section-badge">
          <span class="section-icon">🗺️</span>
          Roadmap Executivo
        </div>
        <h2 class="section-title">A jornada de transformação em 12 meses</h2>
        <p class="section-description">Oito iniciativas estratégicas derivadas do diagnóstico de maturidade. O horizonte de cada uma reflete a urgência da base que a sustenta; o detalhamento operacional está no capítulo de origem.</p>
      </div>

      <div class="roadmap-legend">
        ${HORIZONTE_ORDEM.map(h => `<span>${HORIZONTE_INFO[h].label} · ${HORIZONTE_INFO[h].prazo}</span>`).join('\n        ')}
      </div>

      ${HORIZONTE_ORDEM.map(h => {
        const itens = iniciativas.filter(i => i.horizonte === h);
        if (itens.length === 0) return '';
        return `
        <div class="roadmap-tier tier-${h}">
          <div class="roadmap-tier-head"><span class="dot"></span>${HORIZONTE_INFO[h].label}<small>${HORIZONTE_INFO[h].prazo}</small></div>
          ${itens.map(i => `
            <div class="roadmap-item"><span><strong>${i.titulo}</strong><br><small style="opacity:.75">${i.descricao}</small></span><span class="origem">${i.origem}</span></div>
          `).join('')}
        </div>`;
      }).join('')}
    </div>
  `;

  html = html.replace('<div id="__ROADMAP_PLACEHOLDER__"></div>', roadmapHtml);

  return html;
}

export function openReportInNewTab(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const html = generateReport(project, data, blocks);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
