// Modelo de conteúdo do relatório principal — etapa 2 do refactor.
// Funções puras: recebem dados, devolvem conteúdo. Nenhum HTML de layout aqui.
import { Cargo } from '@/types/consulting';

export const generateCargoChecklist = (cargo: Cargo): string[] => {
  const titulo = cargo.titulo.toLowerCase();
  const nivel = cargo.nivel;
  
  // Base activities by level
  const baseByLevel: Record<number, string[]> = {
    1: [ // Strategic
      "Definir metas e objetivos trimestrais da área",
      "Reunião semanal de alinhamento com liderança",
      "Análise mensal de indicadores estratégicos",
      "Revisão trimestral de plano estratégico",
      "Feedback mensal para líderes subordinados"
    ],
    2: [ // Tactical
      "Acompanhamento diário de KPIs da equipe",
      "Reunião semanal de status com equipe",
      "Relatório semanal de progresso para diretoria",
      "Treinamento contínuo da equipe",
      "Identificação e resolução de gargalos operacionais"
    ],
    3: [ // Operational
      "Execução das tarefas diárias conforme procedimentos",
      "Registro de atividades realizadas",
      "Comunicação de impedimentos ao supervisor",
      "Manutenção da qualidade dos entregáveis",
      "Participação em reuniões de equipe"
    ]
  };

  // Specific activities by role keywords
  const roleSpecific: Record<string, string[]> = {
    'comercial': ["Prospecção de novos clientes", "Follow-up de propostas enviadas", "Atualização do CRM/pipeline", "Relatório de vendas semanal"],
    'vendas': ["Prospecção de novos clientes", "Follow-up de propostas enviadas", "Atualização do CRM/pipeline", "Relatório de vendas semanal"],
    'financeiro': ["Conciliação bancária diária", "Contas a pagar/receber", "Fechamento mensal", "Fluxo de caixa atualizado"],
    'contabil': ["Lançamentos contábeis", "Conciliação de contas", "Apuração de impostos", "Demonstrativos financeiros"],
    'rh': ["Processamento de folha", "Controle de ponto", "Recrutamento e seleção", "Treinamento e desenvolvimento"],
    'pessoas': ["Acompanhamento de colaboradores", "Pesquisa de clima", "Plano de desenvolvimento individual", "Gestão de benefícios"],
    'marketing': ["Gestão de redes sociais", "Análise de métricas de campanha", "Criação de conteúdo", "Planejamento de ações"],
    'operacoes': ["Controle de qualidade", "Gestão de estoque", "Supervisão de processos", "Manutenção preventiva"],
    'producao': ["Programação de produção", "Controle de qualidade", "Gestão de insumos", "Relatório de produtividade"],
    'atendimento': ["Resposta a clientes", "Registro de chamados", "Pesquisa de satisfação", "Resolução de problemas"],
    'suporte': ["Atendimento de tickets", "Documentação de soluções", "Escalonamento de problemas", "Base de conhecimento"],
    'tecnologia': ["Manutenção de sistemas", "Backup de dados", "Suporte técnico", "Atualizações de segurança"],
    'ti': ["Manutenção de infraestrutura", "Suporte aos usuários", "Gestão de acessos", "Monitoramento de sistemas"],
    'administrativo': ["Organização de documentos", "Controle de agenda", "Gestão de fornecedores", "Compras e suprimentos"],
    'logistica': ["Gestão de entregas", "Controle de estoque", "Roteirização", "Conferência de mercadorias"],
    'juridico': ["Análise de contratos", "Acompanhamento processual", "Compliance", "Consultoria interna"],
    'ceo': ["Reunião com conselho/sócios", "Análise de indicadores-chave", "Networking estratégico", "Desenvolvimento de parcerias"],
    'diretor': ["Planejamento estratégico", "Gestão de budget", "Reuniões com stakeholders", "Desenvolvimento de lideranças"],
    'gerente': ["Gestão de equipe", "Controle de metas", "Relatórios gerenciais", "Resolução de conflitos"],
    'coordenador': ["Distribuição de tarefas", "Acompanhamento de entregas", "Feedback à equipe", "Interface com outras áreas"],
    'supervisor': ["Supervisão de atividades", "Controle de qualidade", "Treinamento operacional", "Escala de trabalho"],
    'analista': ["Análise de dados", "Elaboração de relatórios", "Propostas de melhoria", "Documentação de processos"],
    'assistente': ["Apoio às atividades da área", "Organização de documentos", "Atendimento interno", "Controle de agendas"],
    'auxiliar': ["Execução de tarefas operacionais", "Apoio à equipe", "Organização do ambiente", "Registro de informações"]
  };

  let checklist = [...baseByLevel[nivel] || baseByLevel[3]];
  
  // Add role-specific activities
  for (const [keyword, activities] of Object.entries(roleSpecific)) {
    if (titulo.includes(keyword)) {
      checklist = [...checklist, ...activities.slice(0, 3)];
      break;
    }
  }

  // Add activities based on responsibilities
  if (cargo.responsabilidades && cargo.responsabilidades.length > 0) {
    cargo.responsabilidades.slice(0, 2).forEach(resp => {
      checklist.push(`Executar: ${resp}`);
    });
  }

  // Add KPI monitoring if KPIs exist
  if (cargo.kpis && cargo.kpis.length > 0) {
    checklist.push(`Monitorar KPIs: ${cargo.kpis.slice(0, 2).join(', ')}`);
  }

  // Return unique items, limited to 8
  return [...new Set(checklist)].slice(0, 8);
};

// Helper functions for generating insights
export const generateMaturityInsights = (level: number, area: string): string => {
  const insights: Record<number, Record<string, string>> = {
    1: {
      pessoas: "A área de pessoas está em estágio inicial. É fundamental estruturar processos básicos de RH, definir funções claras e criar uma cultura organizacional sólida.",
      processos: "Os processos estão desorganizados ou inexistentes. Priorize mapear os processos críticos e documentá-los para garantir consistência operacional.",
      financas: "O controle financeiro é precário. Implemente controles básicos de fluxo de caixa, DRE e balanço patrimonial imediatamente.",
      mercado: "O conhecimento de mercado é superficial. Invista em pesquisa de mercado e análise competitiva para entender melhor o ambiente."
    },
    2: {
      pessoas: "Existem estruturas básicas, mas falta profissionalização. Considere implementar avaliações de desempenho e planos de carreira.",
      processos: "Alguns processos existem, mas não são padronizados. Documente procedimentos e crie indicadores de acompanhamento.",
      financas: "Há controles básicos, mas falta análise estratégica. Implemente indicadores financeiros (ROI, margem, ponto de equilíbrio).",
      mercado: "O posicionamento existe, mas não é diferenciado. Desenvolva uma proposta de valor única e comunique-a claramente."
    },
    3: {
      pessoas: "A gestão de pessoas está em nível intermediário. Foque em desenvolvimento de lideranças e programas de engajamento.",
      processos: "Os processos são razoavelmente estruturados. É hora de otimizar e automatizar onde possível.",
      financas: "O controle financeiro é bom. Avance para planejamento financeiro de médio/longo prazo e gestão de investimentos.",
      mercado: "O mercado é bem compreendido. Busque nichos específicos para dominar e criar barreiras competitivas."
    },
    4: {
      pessoas: "A gestão de pessoas é madura. Implemente programas de inovação e intraempreendedorismo para manter o engajamento.",
      processos: "Os processos são eficientes. Considere certificações (ISO) e melhoria contínua (Kaizen/Lean).",
      financas: "A gestão financeira é profissional. Explore novos modelos de receita e estratégias de crescimento acelerado.",
      mercado: "O posicionamento é forte. Explore expansão para novos mercados ou segmentos adjacentes."
    },
    5: {
      pessoas: "Excelência em gestão de pessoas. Mantenha o padrão e torne-se referência do setor em employer branding.",
      processos: "Excelência operacional. Considere escalar o modelo para outras unidades ou franquias.",
      financas: "Excelência financeira. Explore M&A, venture capital ou IPO se for estratégico.",
      mercado: "Liderança de mercado. Defina a agenda do setor e antecipe tendências."
    }
  };
  return insights[level]?.[area] || "Avalie as necessidades específicas desta área para desenvolvimento.";
};

export const generateActionPlan = (area: string, level: number): string[] => {
  const plans: Record<string, Record<number, string[]>> = {
    pessoas: {
      1: ["Definir organograma básico e descrição de cargos", "Implementar processo de contratação estruturado", "Criar manual do colaborador"],
      2: ["Implementar avaliação de desempenho trimestral", "Criar plano de cargos e salários", "Desenvolver programa de integração (onboarding)"],
      3: ["Criar programa de desenvolvimento de lideranças", "Implementar pesquisa de clima organizacional", "Desenvolver plano de carreira para posições-chave"],
      4: ["Criar programa de inovação interno", "Implementar gestão por OKRs", "Desenvolver programa de mentoria"],
      5: ["Tornar-se referência em employer branding", "Criar academia corporativa", "Implementar programa de equity para colaboradores"]
    },
    processos: {
      1: ["Mapear os 5 processos mais críticos", "Documentar procedimentos operacionais padrão (POPs)", "Criar checklist para atividades recorrentes"],
      2: ["Implementar ferramentas de gestão de projetos", "Criar indicadores (KPIs) para cada processo", "Estabelecer reuniões de acompanhamento"],
      3: ["Automatizar processos repetitivos", "Implementar sistema de gestão integrado (ERP)", "Criar comitê de melhoria contínua"],
      4: ["Buscar certificação ISO 9001", "Implementar metodologia Lean/Six Sigma", "Criar centro de excelência operacional"],
      5: ["Explorar RPA (automação robótica)", "Implementar IA nos processos-chave", "Desenvolver modelo escalável/franqueável"]
    },
    financas: {
      1: ["Separar finanças pessoais das empresariais", "Implementar controle de fluxo de caixa semanal", "Criar DRE mensal simplificada"],
      2: ["Implementar centro de custos", "Criar orçamento anual", "Calcular ponto de equilíbrio e margem de contribuição"],
      3: ["Implementar análise de indicadores financeiros (ROI, ROE, EBITDA)", "Criar planejamento financeiro de 3 anos", "Desenvolver política de precificação baseada em valor"],
      4: ["Implementar tesouraria profissional", "Criar comitê financeiro", "Explorar linhas de crédito e financiamento para crescimento"],
      5: ["Avaliar captação de investimento externo", "Considerar fusões e aquisições", "Preparar estrutura para eventual IPO ou venda"]
    },
    mercado: {
      1: ["Realizar pesquisa básica de concorrentes", "Definir persona do cliente ideal", "Criar proposta de valor inicial"],
      2: ["Mapear jornada do cliente", "Implementar pesquisa de satisfação (NPS)", "Desenvolver estratégia de diferenciação"],
      3: ["Criar programa de fidelização", "Desenvolver parcerias estratégicas", "Implementar inteligência de mercado"],
      4: ["Expandir para novos segmentos ou regiões", "Desenvolver produtos/serviços complementares", "Criar barreiras de entrada para concorrentes"],
      5: ["Liderar associações do setor", "Definir tendências e padrões do mercado", "Explorar internacionalização"]
    }
  };
  return plans[area]?.[level] || ["Avaliar necessidades específicas", "Desenvolver plano customizado", "Implementar melhorias incrementais"];
};

// Helper function to generate detailed strategies for each growth engine
export const generateMotorStrategies = (motor: string): { estrategias: string[], implementacao: string[], metricas: string[], ferramentas: string[] } => {
  const motorLower = motor.toLowerCase();
  
  const strategies: Record<string, { estrategias: string[], implementacao: string[], metricas: string[], ferramentas: string[] }> = {
    'inbound marketing': {
      estrategias: [
        'Criar blog com conteúdo educativo sobre as dores do ICP',
        'Desenvolver materiais ricos (e-books, webinars, templates)',
        'Implementar estratégia de SEO para palavras-chave relevantes',
        'Criar landing pages otimizadas para conversão'
      ],
      implementacao: [
        'Semana 1-2: Definir persona e mapear jornada de compra',
        'Semana 3-4: Criar calendário editorial com 3 posts/semana',
        'Mês 2: Lançar primeiro material rico para captura de leads',
        'Mês 3: Implementar automação de nutrição de leads'
      ],
      metricas: ['Tráfego orgânico', 'Taxa de conversão landing pages', 'Leads gerados/mês', 'Custo por lead'],
      ferramentas: ['WordPress/Ghost para blog', 'RD Station/HubSpot para automação', 'Google Analytics', 'SEMrush/Ahrefs para SEO']
    },
    'outbound sales': {
      estrategias: [
        'Construir lista de prospecção qualificada (ICP)',
        'Criar cadência de prospecção multicanal (email + LinkedIn + telefone)',
        'Desenvolver scripts e templates personalizados',
        'Implementar social selling no LinkedIn'
      ],
      implementacao: [
        'Semana 1: Definir ICP e critérios de qualificação',
        'Semana 2-3: Construir lista de 500+ prospects',
        'Semana 4: Criar sequência de 7 touchpoints',
        'Mês 2+: Executar 50+ contatos/dia por vendedor'
      ],
      metricas: ['Taxa de resposta', 'Taxa de agendamento', 'Conversão em vendas', 'Ticket médio'],
      ferramentas: ['Apollo.io/Lusha para prospecção', 'Pipedrive/HubSpot CRM', 'LinkedIn Sales Navigator', 'Outreach/Salesloft']
    },
    'indicações': {
      estrategias: [
        'Criar programa formal de indicações com incentivos',
        'Pedir indicações no momento certo (após entrega de valor)',
        'Facilitar o processo de indicação (link único, WhatsApp)',
        'Reconhecer publicamente quem indica'
      ],
      implementacao: [
        'Semana 1: Definir mecânica e recompensas do programa',
        'Semana 2: Criar materiais e comunicação',
        'Semana 3: Lançar para clientes mais engajados (NPS 9-10)',
        'Mensal: Pedir indicação após cada entrega bem-sucedida'
      ],
      metricas: ['Indicações recebidas/mês', 'Taxa de conversão de indicados', 'NPS dos clientes', 'Custo por aquisição'],
      ferramentas: ['Programa manual ou Viral Loops/ReferralCandy', 'Formulários Google/Typeform', 'CRM para tracking']
    },
    'parcerias': {
      estrategias: [
        'Mapear parceiros complementares (não concorrentes)',
        'Criar proposta de valor clara para parceiros',
        'Desenvolver programa de parceria com níveis',
        'Oferecer co-marketing e leads recíprocos'
      ],
      implementacao: [
        'Semana 1-2: Listar 20 potenciais parceiros ideais',
        'Semana 3-4: Abordar e apresentar proposta',
        'Mês 2: Formalizar primeiras parcerias',
        'Trimestral: Revisar resultados e expandir programa'
      ],
      metricas: ['Parceiros ativos', 'Leads via parceiros', 'Receita de parcerias', 'ROI por parceiro'],
      ferramentas: ['PartnerStack/Impact para gestão', 'CRM para tracking', 'Google Drive para materiais compartilhados']
    },
    'product-led growth': {
      estrategias: [
        'Criar versão freemium ou trial do produto',
        'Otimizar onboarding para ativação rápida',
        'Implementar loops virais no produto',
        'Usar dados de uso para upsell'
      ],
      implementacao: [
        'Mês 1: Definir modelo free vs paid (features)',
        'Mês 2: Redesenhar onboarding para "aha moment" em <5min',
        'Mês 3: Implementar convites e compartilhamento in-app',
        'Contínuo: Analisar funil e otimizar conversão'
      ],
      metricas: ['Ativação (% que usa feature-chave)', 'Trial to paid conversion', 'Viral coefficient', 'Time to value'],
      ferramentas: ['Amplitude/Mixpanel para analytics', 'Intercom/Pendo para onboarding', 'Stripe para billing']
    },
    'marketing de conteúdo': {
      estrategias: [
        'Desenvolver pilares de conteúdo alinhados ao negócio',
        'Criar conteúdo em múltiplos formatos (texto, vídeo, áudio)',
        'Distribuir em canais onde o ICP está',
        'Reutilizar conteúdo em diferentes formatos'
      ],
      implementacao: [
        'Semana 1: Definir 3-5 pilares temáticos',
        'Semana 2: Criar calendário de 30 dias',
        'Semanal: Produzir 2-3 peças de conteúdo',
        'Mensal: Analisar performance e ajustar'
      ],
      metricas: ['Alcance/impressões', 'Engajamento', 'Leads gerados', 'Tráfego para site'],
      ferramentas: ['Notion/Trello para planejamento', 'Canva para design', 'Buffer/Hootsuite para agendamento']
    },
    'seo local': {
      estrategias: [
        'Otimizar Google Meu Negócio completamente',
        'Coletar avaliações positivas consistentemente',
        'Criar páginas locais otimizadas',
        'Construir citações em diretórios locais'
      ],
      implementacao: [
        'Semana 1: Completar 100% do Google Meu Negócio',
        'Semana 2: Criar processo para pedir avaliações',
        'Semana 3-4: Listar em 20+ diretórios locais',
        'Mensal: Responder todas avaliações em <24h'
      ],
      metricas: ['Posição no Google Maps', 'Avaliações (qtd e média)', 'Cliques no GMB', 'Ligações recebidas'],
      ferramentas: ['Google Meu Negócio', 'BrightLocal para gestão', 'Google Search Console']
    },
    'eventos e networking': {
      estrategias: [
        'Identificar eventos-chave do setor',
        'Participar como palestrante ou patrocinador',
        'Criar eventos próprios (meetups, workshops)',
        'Fazer follow-up estruturado pós-evento'
      ],
      implementacao: [
        'Mês 1: Mapear calendário de eventos do ano',
        'Mês 2: Submeter proposta para 3 eventos',
        'Trimestral: Organizar evento próprio pequeno',
        'Após cada evento: Follow-up em até 48h'
      ],
      metricas: ['Eventos participados', 'Leads coletados por evento', 'Conversão pós-evento', 'ROI por evento'],
      ferramentas: ['Eventbrite/Sympla', 'Calendly para agendamento', 'CRM para tracking']
    },
    'social selling': {
      estrategias: [
        'Otimizar perfil LinkedIn para conversão',
        'Criar conteúdo de valor consistentemente',
        'Engajar estrategicamente com prospects',
        'Converter conexões em conversas'
      ],
      implementacao: [
        'Semana 1: Otimizar perfil LinkedIn (SSI > 70)',
        'Diário: Postar ou comentar em 3+ posts relevantes',
        'Semanal: Adicionar 50+ conexões qualificadas',
        'Diário: Iniciar 5+ conversas no inbox'
      ],
      metricas: ['SSI (Social Selling Index)', 'Conexões/seguidores', 'Mensagens respondidas', 'Reuniões agendadas'],
      ferramentas: ['LinkedIn Sales Navigator', 'Shield para analytics', 'Calendly para agendamento']
    },
    'comunidade': {
      estrategias: [
        'Criar espaço de comunidade (grupo/fórum)',
        'Entregar valor exclusivo para membros',
        'Facilitar conexões entre membros',
        'Converter comunidade em clientes'
      ],
      implementacao: [
        'Mês 1: Escolher plataforma e criar comunidade',
        'Mês 2: Convidar primeiros 50 membros (clientes atuais)',
        'Semanal: Criar conteúdo/evento exclusivo',
        'Mensal: Analisar engajamento e ajustar'
      ],
      metricas: ['Membros ativos', 'Engajamento (posts/comentários)', 'Conversão para clientes', 'Retenção'],
      ferramentas: ['Circle/Discord/Slack', 'Notion para recursos', 'Zoom para eventos']
    },
    'afiliados': {
      estrategias: [
        'Definir comissões atrativas e competitivas',
        'Criar materiais de marketing para afiliados',
        'Recrutar afiliados estratégicos do nicho',
        'Treinar e suportar afiliados top performers'
      ],
      implementacao: [
        'Semana 1-2: Definir estrutura de comissões',
        'Semana 3-4: Criar kit de materiais para afiliados',
        'Mês 2: Recrutar primeiros 10-20 afiliados',
        'Mensal: Revisar performance e otimizar'
      ],
      metricas: ['Afiliados ativos', 'Vendas por afiliado', 'Comissões pagas', 'ROI do programa'],
      ferramentas: ['Hotmart/Kiwify para infoprodutos', 'FirstPromoter/Rewardful para SaaS', 'Planilha de acompanhamento']
    },
    'account-based marketing': {
      estrategias: [
        'Selecionar 10-50 contas-alvo prioritárias',
        'Criar campanhas personalizadas por conta',
        'Alinhar marketing e vendas no processo',
        'Executar touchpoints multicanal coordenados'
      ],
      implementacao: [
        'Semana 1: Definir lista de target accounts',
        'Semana 2-3: Pesquisar cada conta profundamente',
        'Semana 4: Criar abordagem personalizada por conta',
        'Mensal: Executar cadência e medir resultados'
      ],
      metricas: ['Contas engajadas', 'Reuniões com decision-makers', 'Pipeline gerado', 'Deals fechados'],
      ferramentas: ['LinkedIn Sales Navigator', '6sense/Demandbase', 'CRM com segmentação por conta']
    },
    'influenciadores': {
      estrategias: [
        'Mapear micro e macro influenciadores do nicho',
        'Criar proposta de parceria clara',
        'Testar com micro-influenciadores primeiro',
        'Medir ROI de cada parceria'
      ],
      implementacao: [
        'Semana 1: Listar 30+ influenciadores relevantes',
        'Semana 2: Abordar 10 micro-influenciadores',
        'Mês 2: Fechar 3-5 parcerias piloto',
        'Mensal: Analisar resultados e expandir'
      ],
      metricas: ['Alcance das campanhas', 'Engajamento', 'Código de desconto usado', 'ROI por influenciador'],
      ferramentas: ['BuzzSumo/HypeAuditor', 'Instagram/TikTok', 'Tracking links (UTMs)']
    },
    'email marketing': {
      estrategias: [
        'Construir lista qualificada (lead magnets)',
        'Segmentar lista por comportamento/interesse',
        'Criar sequências de nutrição automatizadas',
        'Testar assuntos, horários e conteúdo'
      ],
      implementacao: [
        'Semana 1: Criar 3 lead magnets',
        'Semana 2: Configurar sequência de boas-vindas',
        'Semana 3-4: Criar newsletter semanal/quinzenal',
        'Contínuo: Testar A/B e otimizar'
      ],
      metricas: ['Lista de emails', 'Taxa de abertura', 'Taxa de cliques', 'Conversões de email'],
      ferramentas: ['Mailchimp/ConvertKit', 'RD Station', 'Google Analytics para tracking']
    },
    'webinars e workshops': {
      estrategias: [
        'Criar webinars educativos de alto valor',
        'Promover via múltiplos canais',
        'Converter participantes em leads/clientes',
        'Reutilizar conteúdo em outros formatos'
      ],
      implementacao: [
        'Semana 1: Definir tema e estrutura',
        'Semana 2: Criar landing page e promoção',
        'Semana 3: Executar webinar e gravar',
        'Pós-evento: Follow-up em 24-48h'
      ],
      metricas: ['Inscritos', 'Taxa de comparecimento', 'Engajamento (perguntas)', 'Conversão pós-webinar'],
      ferramentas: ['Zoom/StreamYard', 'WebinarJam/Demio', 'Landing pages + email marketing']
    }
  };

  // Try to find exact match first, then partial match
  for (const [key, value] of Object.entries(strategies)) {
    if (motorLower.includes(key) || key.includes(motorLower)) {
      return value;
    }
  }

  // Default strategies for custom motors
  return {
    estrategias: [
      'Definir público-alvo específico para este canal',
      'Criar proposta de valor clara para o canal',
      'Estabelecer processos e rotinas de execução',
      'Medir resultados e otimizar continuamente'
    ],
    implementacao: [
      'Semana 1: Pesquisar e planejar abordagem',
      'Semana 2-3: Criar materiais e estrutura',
      'Semana 4: Executar primeiro piloto',
      'Mensal: Analisar resultados e escalar'
    ],
    metricas: ['Alcance', 'Engajamento', 'Leads gerados', 'Conversão em vendas'],
    ferramentas: ['CRM para gestão', 'Planilhas para acompanhamento', 'Ferramentas específicas do canal']
  };
};


// ============================================================
// Roadmap consolidado — calculado dos dados coletados na geração,
// substituindo a extração por regex sobre o HTML (ver docs/inventario).
// ============================================================
export type Urgencia = 'critica' | 'alta' | 'media' | 'evolucao' | 'estrategica';

export const URGENCIA_INFO: Record<Urgencia, { label: string; prazo: string }> = {
  critica: { label: 'Crítica', prazo: 'até 30 dias' },
  alta: { label: 'Alta', prazo: 'até 3 meses' },
  media: { label: 'Média', prazo: 'até 6 meses' },
  evolucao: { label: 'Evolução', prazo: 'até 9 meses' },
  estrategica: { label: 'Estratégica', prazo: 'até 12 meses' },
};
export const URGENCIA_ORDEM: Urgencia[] = ['critica', 'alta', 'media', 'evolucao', 'estrategica'];

const KEYWORDS: [Urgencia, string[]][] = [
  ['critica', ['dre', 'fluxo de caixa', 'precific', 'capital de giro', 'ruptura', 'regulariza']],
  ['alta', ['processo', 'compra', 'estoque', 'comercial', 'crm', 'agenda']],
  ['media', ['kpi', 'indicador', 'marketing', 'icp', 'funil', 'automa']],
  ['evolucao', ['cultura', 'liderança', 'lideranca', 'avaliação', 'avaliacao', 'treinamento', 'pessoa', 'equipe']],
  ['estrategica', ['nova unidade', 'novo produto', 'franquia', 'filial', 'novo mercado', 'expans', 'segunda unidade']],
];

export const classificarUrgencia = (texto: string): Urgencia => {
  const t = texto.toLowerCase();
  for (const [tier, palavras] of KEYWORDS) {
    if (palavras.some(p => t.includes(p))) return tier;
  }
  return 'media';
};

export const normalizarTitulo = (texto: string) =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export interface RoadmapItem { titulo: string; origem: string; urgencia: Urgencia }

/** Deduplica e classifica ações coletadas durante a geração, em ordem de documento. */
export function buildRoadmap(acoes: { titulo: string; origem: string }[]): RoadmapItem[] {
  const vistos = new Set<string>();
  const itens: RoadmapItem[] = [];
  for (const a of acoes) {
    const chave = normalizarTitulo(a.titulo);
    if (!chave || vistos.has(chave)) continue;
    vistos.add(chave);
    itens.push({ titulo: a.titulo, origem: a.origem, urgencia: classificarUrgencia(a.titulo) });
  }
  return itens;
}


// ============================================================
// Iniciativas Estratégicas do Roadmap (arquitetura canônica, D1)
// Conjunto FIXO de 8 categorias — decisão validada por Angela.
// Só o horizonte varia por empresa, derivado da maturidade da
// dimensão relacionada (base mais fraca => iniciativa mais urgente).
// ============================================================
import { ConsultingData } from '@/types/consulting';

export type Horizonte = 'h30' | 'h3' | 'h6' | 'h9' | 'h12';

export const HORIZONTE_INFO: Record<Horizonte, { label: string; prazo: string }> = {
  h30: { label: 'Fundação', prazo: 'até 30 dias' },
  h3: { label: 'Estruturação', prazo: 'até 3 meses' },
  h6: { label: 'Consolidação', prazo: 'até 6 meses' },
  h9: { label: 'Evolução', prazo: 'até 9 meses' },
  h12: { label: 'Expansão', prazo: 'até 12 meses' },
};
export const HORIZONTE_ORDEM: Horizonte[] = ['h30', 'h3', 'h6', 'h9', 'h12'];

export interface IniciativaEstrategica {
  id: string;
  titulo: string;
  descricao: string;
  horizonte: Horizonte;
  origem: string; // capítulo onde é detalhada
}

export function buildStrategicInitiatives(data: ConsultingData): IniciativaEstrategica[] {
  const d = data.diagnostico;
  const hFinanceiro: Horizonte = d.financas.level <= 1 ? 'h30' : d.financas.level === 2 ? 'h3' : 'h6';
  const hPrecificacao: Horizonte = d.financas.level <= 1 ? 'h30' : 'h3';
  const hProcessos: Horizonte = d.processos.level <= 1 ? 'h3' : d.processos.level === 2 ? 'h6' : 'h9';
  const hMercado: Horizonte = d.mercado.level <= 1 ? 'h3' : d.mercado.level === 2 ? 'h6' : 'h9';
  const hCrescimento: Horizonte = d.mercado.level <= 1 ? 'h6' : 'h9';
  const hPessoas: Horizonte = d.pessoas.level <= 1 ? 'h3' : d.pessoas.level === 2 ? 'h6' : 'h9';
  const hCultura: Horizonte = d.pessoas.level <= 1 ? 'h9' : 'h12';

  return [
    { id: 'financeiro', titulo: 'Estruturar a gestão financeira', descricao: 'Implantar DRE gerencial e fluxo de caixa para decidir com base em dados, não em percepção.', horizonte: hFinanceiro, origem: 'Análise Financeira' },
    { id: 'precificacao', titulo: 'Revisar a estratégia de precificação', descricao: 'Recalcular preços pelos três pilares — custo, concorrência e valor percebido — para recuperar margem.', horizonte: hPrecificacao, origem: 'Precificação' },
    { id: 'processos', titulo: 'Padronizar processos críticos', descricao: 'Documentar e criar indicadores para as operações que hoje dependem só da memória do time.', horizonte: hProcessos, origem: 'Processos Essenciais' },
    { id: 'posicionamento', titulo: 'Definir posicionamento e cliente ideal', descricao: 'Consolidar o ICP e os diferenciais competitivos numa mensagem clara para o mercado.', horizonte: hMercado, origem: 'Definição de ICP' },
    { id: 'crescimento', titulo: 'Estruturar motores de crescimento', descricao: 'Escolher e sistematizar os canais de aquisição com maior potencial de retorno.', horizonte: hCrescimento, origem: 'Motores de Crescimento' },
    { id: 'organizacao', titulo: 'Organizar estrutura e responsabilidades', descricao: 'Formalizar o organograma e as responsabilidades de cada cargo para eliminar dependências de pessoas.', horizonte: hPessoas, origem: 'Estrutura Organizacional' },
    { id: 'cultura', titulo: 'Fortalecer cultura e liderança', descricao: 'Consolidar identidade, rituais de gestão e desenvolvimento do líder para sustentar o crescimento.', horizonte: hCultura, origem: 'Identidade Organizacional' },
    { id: 'expansao', titulo: 'Preparar a expansão do negócio', descricao: 'Estruturar as bases — capital, time e processos — para crescer sem quebrar o que já funciona.', horizonte: 'h12', origem: 'Estratégias de Valor' },
  ];
}
