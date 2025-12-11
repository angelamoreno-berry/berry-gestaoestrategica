import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConsultingData, BlockStatus, Project } from '@/types/consulting';

const initialData: ConsultingData = {
  clienteNome: '',
  consultorNome: '',
  dataInicio: new Date().toISOString().split('T')[0],
  diagnostico: {
    pessoas: { area: 'Pessoas', level: 0, notes: '' },
    processos: { area: 'Processos', level: 0, notes: '' },
    financas: { area: 'Finanças', level: 0, notes: '' },
    mercado: { area: 'Mercado', level: 0, notes: '' },
  },
  identidade: {
    visao: '',
    missao: '',
    valores: [],
    posicionamento: '',
  },
  concorrentes: {
    concorrentes: [],
    principais: [],
    diferenciais: [],
    publicoAlvo: '',
    propostaValor: '',
  },
  icp: {
    caracteristicasDemograficas: '',
    descricao: '',
    segmentos: [],
    dores: [],
    dpisos: [],
    desejos: [],
    necessidades: [],
    comportamento: '',
    ondeEncontrar: '',
  },
  estrategiasValor: {
    novasOfertas: [],
    novosServicos: [],
    pacotes: [],
  },
  precificacao: {
    modelo: '',
    estrategia: '',
    ancoragem: '',
    margemDesejada: '',
    produtos: [],
  },
  motoresCrescimento: {
    motoresPrincipais: [],
    canais: [],
    metricas: [],
  },
  organograma: {
    cargos: [],
  },
  processos: {
    processos: [],
    lista: [],
  },
  financeiro: {
    despesasFixas: 0,
    despesasVariaveis: 0,
    faturamentoAtual: 0,
    faturamentoMensal: 0,
    margemAtual: 0,
    margemLucro: 0,
    custoFixoMensal: 0,
    pontoEquilibrio: 0,
    metaFaturamento: 0,
    ticketMedio: 0,
    quantidadeClientes: 0,
    cac: 0,
    ltv: 0,
    prazoMedioRecebimento: 0,
    prazoMedioPagamento: 0,
    capitalGiro: 0,
    reservaEmergencia: 0,
    dividas: [],
    totalDividas: 0,
    comprometimentoReceita: 0,
    oportunidades: [],
    investimentos: [],
    riscos: [],
  },
  swot: {
    forcas: [],
    fraquezas: [],
    oportunidades: [],
    ameacas: [],
    horizontes: {
      curto: '',
      medio: '',
      longo: '',
    },
  },
  goldenCircle: {
    why: '',
    how: '',
    what: '',
  },
  swotPessoal: {
    forcas: [],
    fraquezas: [],
    oportunidades: [],
    ameacas: [],
  },
  agendaCEO: {
    prioridades: [],
    alocacaoTempo: [],
    rotinas: [],
    delegacoes: [],
    focoTrimestre: '',
  },
};

const initialBlocks: BlockStatus[] = [
  { id: 'goldenCircle', name: 'Golden Circle', icon: '⭕', completed: false, progress: 0 },
  { id: 'identidade', name: 'Visão, Missão e Valores', icon: '🎯', completed: false, progress: 0 },
  { id: 'swot', name: 'SWOT e Horizontes', icon: '🧭', completed: false, progress: 0 },
  { id: 'diagnostico', name: 'Diagnóstico de Maturidade', icon: '📊', completed: false, progress: 0 },
  { id: 'concorrentes', name: 'Análise de Mercado', icon: '🔍', completed: false, progress: 0 },
  { id: 'icp', name: 'Definição de ICP', icon: '👤', completed: false, progress: 0 },
  { id: 'estrategiasValor', name: 'Estratégias de Valor', icon: '💎', completed: false, progress: 0 },
  { id: 'precificacao', name: 'Modelo de Precificação', icon: '💰', completed: false, progress: 0 },
  { id: 'motoresCrescimento', name: 'Motores de Crescimento', icon: '🚀', completed: false, progress: 0 },
  { id: 'organograma', name: 'Organograma', icon: '🏢', completed: false, progress: 0 },
  { id: 'processos', name: 'Processos Essenciais', icon: '⚙️', completed: false, progress: 0 },
  { id: 'financeiro', name: 'Análise Financeira', icon: '📈', completed: false, progress: 0 },
  { id: 'swotPessoal', name: 'SWOT Pessoal', icon: '🪞', completed: false, progress: 0 },
  { id: 'agendaCEO', name: 'Agenda Estratégica', icon: '📅', completed: false, progress: 0 },
];

interface ProjectData {
  project: Project;
  data: ConsultingData;
  blocks: BlockStatus[];
}

interface ConsultingContextType {
  data: ConsultingData;
  blocks: BlockStatus[];
  currentBlock: string;
  projects: Project[];
  currentProject: Project | null;
  setCurrentBlock: (id: string) => void;
  updateData: <K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => void;
  updateBlockProgress: (id: string, progress: number) => void;
  markBlockComplete: (id: string) => void;
  getTotalProgress: () => number;
  resetAll: () => void;
  createProject: (projectData: Omit<Project, 'id' | 'dataCriacao'>) => void;
  createDemoProject: (params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number }) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  goToProjectList: () => void;
}

const ConsultingContext = createContext<ConsultingContextType | undefined>(undefined);

export function ConsultingProvider({ children }: { children: React.ReactNode }) {
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentBlock, setCurrentBlock] = useState('goldenCircle');

  const currentProjectData = projectsData.find(p => p.project.id === currentProjectId);
  const data = currentProjectData?.data || initialData;
  const blocks = currentProjectData?.blocks || initialBlocks;
  const projects = projectsData.map(p => p.project);
  const currentProject = currentProjectData?.project || null;

  const updateData = useCallback(<K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => {
    if (!currentProjectId) return;
    setProjectsData(prev => prev.map(pd => 
      pd.project.id === currentProjectId 
        ? { ...pd, data: { ...pd.data, [key]: value } }
        : pd
    ));
  }, [currentProjectId]);

  const updateBlockProgress = useCallback((id: string, progress: number) => {
    if (!currentProjectId) return;
    setProjectsData(prev => prev.map(pd => 
      pd.project.id === currentProjectId 
        ? { 
            ...pd, 
            blocks: pd.blocks.map(block => 
              block.id === id ? { ...block, progress: Math.min(100, Math.max(0, progress)) } : block
            )
          }
        : pd
    ));
  }, [currentProjectId]);

  const markBlockComplete = useCallback((id: string) => {
    if (!currentProjectId) return;
    setProjectsData(prev => prev.map(pd => 
      pd.project.id === currentProjectId 
        ? { 
            ...pd, 
            blocks: pd.blocks.map(block => 
              block.id === id ? { ...block, completed: true, progress: 100 } : block
            )
          }
        : pd
    ));
  }, [currentProjectId]);

  const getTotalProgress = useCallback(() => {
    const total = blocks.reduce((acc, block) => acc + block.progress, 0);
    return Math.round(total / blocks.length);
  }, [blocks]);

  const resetAll = useCallback(() => {
    setProjectsData([]);
    setCurrentProjectId(null);
    setCurrentBlock('goldenCircle');
  }, []);

  const createProject = useCallback((projectData: Omit<Project, 'id' | 'dataCriacao'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString()
    };
    const newProjectData: ProjectData = {
      project: newProject,
      data: { ...initialData, clienteNome: projectData.nomeEmpresa },
      blocks: initialBlocks.map(b => ({ ...b }))
    };
    setProjectsData(prev => [...prev, newProjectData]);
  }, []);

  const createDemoProject = useCallback((params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number }) => {
    const { segmento, faturamentoMedio, quantidadeColaboradores } = params;
    
    // Gerar nome da empresa baseado no segmento
    const nomesPorSegmento: Record<string, string> = {
      'Agronegócio': 'AgroVerde Soluções',
      'Alimentação': 'Sabor & Arte Gastronomia',
      'Atacado e Distribuição': 'DistribuiMax Atacado',
      'Automotivo': 'AutoPrime Motors',
      'Engenharia e Construção': 'Construtora Horizonte',
      'Educação': 'Instituto Conhecimento Vivo',
      'Energia Solar': 'SolarTech Energia',
      'Indústria': 'IndústriaForte Manufatura',
      'Logística': 'LogiExpress Transportes',
      'Negócios Digitais': 'DigitalFlow Solutions',
      'Saúde e Bem Estar': 'VidaPlena Saúde',
      'Serviços': 'Excellence Serviços',
      'Supermercado': 'SuperBom Mercados',
      'Tecnologia': 'TechFlow Solutions',
      'Varejo': 'VarejoMax Lojas',
      'Outro': 'Empresa Demonstração'
    };
    
    const nomeEmpresa = nomesPorSegmento[segmento] || 'Empresa Demonstração';
    
    const demoProject: Project = {
      id: crypto.randomUUID(),
      nomeEmpresa,
      responsavel: 'Carlos Eduardo Silva',
      segmento,
      faturamentoMedio,
      quantidadeColaboradores,
      emailResponsavel: 'contato@empresa.com.br',
      dataCriacao: new Date().toISOString()
    };

    const demoData: ConsultingData = {
      clienteNome: nomeEmpresa,
      consultorNome: 'Ana Consultoria',
      dataInicio: new Date().toISOString().split('T')[0],
      diagnostico: {
        pessoas: { area: 'Pessoas', level: 3, notes: 'Equipe engajada, mas falta estrutura de carreira e treinamento contínuo.' },
        processos: { area: 'Processos', level: 2, notes: 'Processos existentes mas não documentados. Alta dependência de pessoas-chave.' },
        financas: { area: 'Finanças', level: 4, notes: 'Controles financeiros sólidos, DRE mensal implementado, boa margem.' },
        mercado: { area: 'Mercado', level: 3, notes: 'Posicionamento razoável, mas falta diferenciação clara da concorrência.' },
      },
      identidade: {
        visao: `Ser a principal referência em ${segmento.toLowerCase()} na nossa região até 2028, impactando positivamente milhares de clientes e parceiros.`,
        missao: `Entregar soluções de ${segmento.toLowerCase()} de alta qualidade, com excelência no atendimento e compromisso com resultados sustentáveis.`,
        valores: ['Excelência', 'Foco no Cliente', 'Inovação', 'Transparência', 'Colaboração'],
        posicionamento: `Somos especialistas em ${segmento.toLowerCase()} que entregam resultados concretos com atendimento diferenciado.`,
      },
      concorrentes: {
        concorrentes: [
          { nome: 'SoftGest', pontoForte: 'Marca consolidada e grande base de clientes', pontoFraco: 'Sistema legado, interface ultrapassada' },
          { nome: 'CloudBiz', pontoForte: 'Preço agressivo e marketing digital forte', pontoFraco: 'Suporte deficiente e muitos bugs' },
          { nome: 'GestãoPro', pontoForte: 'Funcionalidades completas e integrações', pontoFraco: 'Complexidade excessiva, curva de aprendizado alta' },
        ],
        principais: [
          { nome: 'SoftGest', tipo: 'Direto', pontosFortes: 'Marca consolidada e grande base de clientes', pontosFracos: 'Sistema legado, interface ultrapassada' },
          { nome: 'CloudBiz', tipo: 'Direto', pontosFortes: 'Preço agressivo e marketing digital forte', pontosFracos: 'Suporte deficiente e muitos bugs' },
          { nome: 'GestãoPro', tipo: 'Indireto', pontosFortes: 'Funcionalidades completas e integrações', pontosFracos: 'Complexidade excessiva, curva de aprendizado alta' },
        ],
        diferenciais: ['Atendimento personalizado', 'Experiência no segmento', 'Qualidade superior', 'Preço justo'],
        publicoAlvo: `Empresas e pessoas que buscam soluções de qualidade em ${segmento.toLowerCase()}`,
        propostaValor: `Oferecemos ${segmento.toLowerCase()} de alta qualidade com atendimento humanizado e resultados comprovados.`,
      },
      icp: {
        caracteristicasDemograficas: 'Empresários de 35-55 anos, donos de empresas de serviços com faturamento entre R$100k-500k/mês, 10-50 funcionários, atuando há mais de 5 anos no mercado.',
        descricao: 'Empresário experiente que já tentou outras soluções de gestão, valoriza simplicidade e suporte humano, está disposto a investir em tecnologia mas tem receio de complexidade.',
        segmentos: ['Serviços B2B', 'Consultorias', 'Agências', 'Clínicas', 'Escritórios de Contabilidade'],
        dores: [
          'Perde tempo demais com planilhas e controles manuais',
          'Não consegue ver os números da empresa em tempo real',
          'Tem medo de tecnologia complexa que a equipe não vai usar',
          'Já tentou outros sistemas e desistiu pela dificuldade',
          'Sente que está perdendo dinheiro mas não sabe onde'
        ],
        dpisos: [
          'Perde tempo demais com planilhas e controles manuais',
          'Não consegue ver os números da empresa em tempo real',
          'Tem medo de tecnologia complexa que a equipe não vai usar'
        ],
        desejos: [
          'Ter controle total da empresa na palma da mão',
          'Tomar decisões baseadas em dados confiáveis',
          'Ter tempo para focar no estratégico, não no operacional',
          'Escalar o negócio com processos organizados',
          'Dormir tranquilo sabendo que está tudo sob controle'
        ],
        necessidades: [
          'Sistema intuitivo que a equipe use de verdade',
          'Suporte rápido e humanizado quando precisar',
          'Relatórios claros para tomada de decisão',
          'Implementação rápida sem parar a operação'
        ],
        comportamento: 'Pesquisa muito antes de comprar, valoriza indicações de outros empresários, prefere ver demonstração antes de fechar, sensível a preço mas paga mais por qualidade comprovada.',
        ondeEncontrar: 'LinkedIn, grupos de empresários no WhatsApp, eventos da ACSP, podcasts de negócios, YouTube (canais de gestão)',
      },
      estrategiasValor: {
        novasOfertas: [
          'Consultoria de Implementação Premium (acompanhamento de 90 dias)',
          'Treinamento in-company para equipes',
          'Dashboard personalizado para o segmento do cliente'
        ],
        novosServicos: [
          'Integração com sistemas contábeis',
          'Automação de cobranças e boletos',
          'Relatórios personalizados sob demanda'
        ],
        pacotes: [
          { nome: 'Starter', descricao: 'Ideal para começar: CRM + Financeiro básico', preco: 'R$ 297/mês' },
          { nome: 'Professional', descricao: 'Mais vendido: Todos os módulos + suporte prioritário', preco: 'R$ 597/mês' },
          { nome: 'Enterprise', descricao: 'Para escalar: Customizações + consultoria mensal', preco: 'R$ 1.497/mês' }
        ],
      },
      precificacao: {
        modelo: 'SaaS com assinatura mensal',
        estrategia: 'Valor percebido com ancoragem no plano Enterprise',
        ancoragem: 'Mostrar economia vs. contratar funcionário para fazer o mesmo trabalho',
        margemDesejada: '70%',
        produtos: [
          { id: '1', nome: 'Módulo CRM', precoAtual: 197, descricao: 'Gestão completa de clientes e oportunidades' },
          { id: '2', nome: 'Módulo Financeiro', precoAtual: 247, descricao: 'Contas a pagar/receber, fluxo de caixa, DRE' },
          { id: '3', nome: 'Módulo RH', precoAtual: 147, descricao: 'Gestão de colaboradores, ponto e férias' },
          { id: '4', nome: 'Consultoria de Implementação', precoAtual: 2500, descricao: 'Setup completo + treinamento da equipe' }
        ],
      },
      motoresCrescimento: {
        motoresPrincipais: ['Indicação de clientes satisfeitos', 'Marketing de conteúdo', 'Parcerias com contadores'],
        canais: ['LinkedIn Ads', 'Google Ads', 'Programa de Afiliados', 'Webinars educativos', 'SEO orgânico'],
        metricas: [
          { nome: 'MRR (Receita Recorrente Mensal)', meta: 'R$ 250.000 até dez/2025' },
          { nome: 'Churn Rate', meta: 'Manter abaixo de 3% ao mês' },
          { nome: 'CAC (Custo de Aquisição)', meta: 'Máximo R$ 800 por cliente' },
          { nome: 'LTV (Lifetime Value)', meta: 'Mínimo R$ 8.000 por cliente' },
          { nome: 'NPS', meta: 'Acima de 70' }
        ],
      },
      organograma: {
        cargos: [
          { titulo: 'CEO / Fundador', nivel: 1, responsabilidades: ['Visão estratégica', 'Relacionamento com investidores', 'Cultura organizacional'], kpis: ['Crescimento MRR', 'Satisfação da equipe'], subordinadoA: '' },
          { titulo: 'Head de Produto', nivel: 2, responsabilidades: ['Roadmap do produto', 'Priorização de features', 'UX/UI'], kpis: ['NPS do produto', 'Tempo de entrega'], subordinadoA: 'CEO' },
          { titulo: 'Head Comercial', nivel: 2, responsabilidades: ['Estratégia de vendas', 'Gestão do time comercial', 'Parcerias'], kpis: ['Meta de vendas', 'Conversão', 'Ticket médio'], subordinadoA: 'CEO' },
          { titulo: 'Head de CS', nivel: 2, responsabilidades: ['Sucesso do cliente', 'Onboarding', 'Retenção'], kpis: ['Churn', 'NPS', 'Tempo de resposta'], subordinadoA: 'CEO' },
          { titulo: 'Desenvolvedores', nivel: 3, responsabilidades: ['Desenvolvimento de features', 'Correção de bugs', 'Code review'], kpis: ['Velocidade de entrega', 'Qualidade do código'], subordinadoA: 'Head de Produto' },
          { titulo: 'SDRs', nivel: 3, responsabilidades: ['Prospecção', 'Qualificação de leads', 'Agendamento de demos'], kpis: ['Leads qualificados', 'Taxa de agendamento'], subordinadoA: 'Head Comercial' }
        ],
      },
      processos: {
        processos: [
          { nome: 'Onboarding de Cliente', descricao: 'Processo de ativação e treinamento de novos clientes', responsavel: 'Head de CS', frequencia: 'A cada novo cliente' },
          { nome: 'Sprint de Desenvolvimento', descricao: 'Ciclo de 2 semanas para entrega de novas funcionalidades', responsavel: 'Head de Produto', frequencia: 'Quinzenal' },
          { nome: 'Reunião de Pipeline', descricao: 'Revisão das oportunidades comerciais e forecast', responsavel: 'Head Comercial', frequencia: 'Semanal' },
          { nome: 'Review Financeiro', descricao: 'Análise de DRE, fluxo de caixa e indicadores', responsavel: 'CEO', frequencia: 'Mensal' },
          { nome: 'All Hands', descricao: 'Reunião geral da empresa para alinhamento e celebrações', responsavel: 'CEO', frequencia: 'Mensal' }
        ],
        lista: [
          { nome: 'Onboarding de Cliente', descricao: 'Processo de ativação e treinamento de novos clientes', responsavel: 'Head de CS', frequencia: 'A cada novo cliente' },
          { nome: 'Sprint de Desenvolvimento', descricao: 'Ciclo de 2 semanas para entrega de novas funcionalidades', responsavel: 'Head de Produto', frequencia: 'Quinzenal' },
          { nome: 'Reunião de Pipeline', descricao: 'Revisão das oportunidades comerciais e forecast', responsavel: 'Head Comercial', frequencia: 'Semanal' },
          { nome: 'Review Financeiro', descricao: 'Análise de DRE, fluxo de caixa e indicadores', responsavel: 'CEO', frequencia: 'Mensal' },
          { nome: 'All Hands', descricao: 'Reunião geral da empresa para alinhamento e celebrações', responsavel: 'CEO', frequencia: 'Mensal' }
        ],
      },
      financeiro: {
        despesasFixas: Math.round(faturamentoMedio * 0.53),
        despesasVariaveis: Math.round(faturamentoMedio * 0.14),
        faturamentoAtual: faturamentoMedio,
        faturamentoMensal: faturamentoMedio,
        margemAtual: 33,
        margemLucro: 33,
        custoFixoMensal: Math.round(faturamentoMedio * 0.53),
        pontoEquilibrio: Math.round(faturamentoMedio * 0.79),
        metaFaturamento: Math.round(faturamentoMedio * 1.67),
        ticketMedio: Math.round(faturamentoMedio / 250),
        quantidadeClientes: 250,
        cac: Math.round(faturamentoMedio * 0.008),
        ltv: Math.round(faturamentoMedio * 0.048),
        prazoMedioRecebimento: 15,
        prazoMedioPagamento: 30,
        capitalGiro: Math.round(faturamentoMedio * 0.47),
        reservaEmergencia: Math.round(faturamentoMedio * 0.67),
        dividas: [
          { descricao: 'Financiamento equipamentos', valorTotal: Math.round(faturamentoMedio * 0.28), parcelasMensais: Math.round(faturamentoMedio * 0.014), parcelasRestantes: 20, taxaJuros: 1.5 },
          { descricao: 'Antecipação de recebíveis', valorTotal: Math.round(faturamentoMedio * 0.08), parcelasMensais: Math.round(faturamentoMedio * 0.029), parcelasRestantes: 3, taxaJuros: 2.8 },
        ],
        totalDividas: Math.round(faturamentoMedio * 0.36),
        comprometimentoReceita: 4.3,
        oportunidades: [
          'Aumentar ticket médio com upsell de produtos/serviços adicionais',
          'Reduzir churn com programa de fidelidade e sucesso do cliente',
          'Expandir para novos segmentos e regiões',
          'Criar modelo de atendimento self-service para reduzir custos',
          'Lançar parcerias estratégicas com players complementares'
        ],
        investimentos: [
          { area: 'Marketing Digital', valor: Math.round(faturamentoMedio * 0.17), prazo: '3 meses', prioridade: 'Alta' },
          { area: 'Expansão de Equipe', valor: Math.round(faturamentoMedio * 0.28), prazo: '6 meses', prioridade: 'Alta' },
          { area: 'Tecnologia e Infraestrutura', valor: Math.round(faturamentoMedio * 0.14), prazo: '6 meses', prioridade: 'Media' }
        ],
        riscos: [
          'Inadimplência acima de 5% pode comprometer fluxo de caixa',
          'Dependência de poucos clientes grandes',
          'Reserva de emergência precisa ser ampliada'
        ],
      },
      swot: {
        forcas: [
          'Produto intuitivo e fácil de usar',
          'Equipe técnica experiente e engajada',
          'Suporte diferenciado e humanizado',
          'Boa reputação no mercado (NPS 72)',
          'Base de clientes fiéis com baixo churn'
        ],
        fraquezas: [
          'Marketing ainda incipiente',
          'Dependência do fundador em vendas enterprise',
          'Falta documentação de processos internos',
          'Time de CS subdimensionado',
          'Poucas integrações com outros sistemas'
        ],
        oportunidades: [
          'Mercado de PMEs em digitalização acelerada',
          'Concorrentes com produtos defasados',
          'Possibilidade de parcerias com grandes contabilidades',
          'Demanda crescente por automação',
          'Expansão para América Latina'
        ],
        ameacas: [
          'Entrada de players internacionais no Brasil',
          'Crise econômica afetando PMEs',
          'Dificuldade de contratar devs qualificados',
          'Mudanças regulatórias (LGPD, fiscal)',
          'Comoditização de funcionalidades básicas'
        ],
        horizontes: {
          curto: 'Dobrar a base de clientes e atingir 500 empresas ativas',
          medio: 'Lançar versão para novos segmentos e expandir para 3 países da LATAM',
          longo: 'Ser líder em gestão para PMEs no Brasil com 10.000+ clientes e preparar para rodada Série A',
        },
      },
      goldenCircle: {
        why: `Acreditamos que ${segmento.toLowerCase()} pode transformar vidas e negócios. Nossa paixão é entregar valor real e criar relacionamentos duradouros com cada cliente.`,
        how: `Desenvolvemos soluções com obsessão por qualidade, ouvimos atentamente nossos clientes e entregamos experiências excepcionais. Cada projeto passa pelo nosso controle de qualidade rigoroso.`,
        what: `Somos especialistas em ${segmento.toLowerCase()}, oferecendo produtos e serviços de alta qualidade com atendimento diferenciado e resultados comprovados.`,
      },
      swotPessoal: {
        forcas: [
          'Visão estratégica clara e inspiradora',
          'Capacidade de recrutar e reter talentos',
          'Conhecimento técnico profundo do produto',
          'Resiliência e persistência em momentos difíceis',
          'Boa comunicação e relacionamento'
        ],
        fraquezas: [
          'Dificuldade de delegar tarefas importantes',
          'Tendência ao perfeccionismo que atrasa entregas',
          'Pouco tempo dedicado a networking',
          'Gestão do tempo ainda precisa melhorar',
          'Evita conflitos mesmo quando necessário'
        ],
        oportunidades: [
          'Participar de programas de mentoria para founders',
          'Desenvolver habilidades de vendas enterprise',
          'Construir marca pessoal no LinkedIn',
          'Fazer MBA executivo para expandir network'
        ],
        ameacas: [
          'Burnout por excesso de responsabilidades',
          'Distanciamento da família pelo trabalho',
          'Dependência excessiva da empresa para identidade pessoal',
          'Falta de exercício e cuidado com saúde'
        ],
      },
      agendaCEO: {
        prioridades: [
          { descricao: 'Fechar 3 contas enterprise este trimestre', importancia: 'alta' },
          { descricao: 'Contratar Head de Marketing', importancia: 'alta' },
          { descricao: 'Implementar OKRs na empresa', importancia: 'media' },
          { descricao: 'Documentar processos críticos', importancia: 'media' },
          { descricao: 'Redesign da página de vendas', importancia: 'baixa' }
        ],
        alocacaoTempo: [
          { atividade: 'Vendas e relacionamento com clientes', percentual: 35 },
          { atividade: 'Gestão e desenvolvimento da equipe', percentual: 25 },
          { atividade: 'Produto e estratégia', percentual: 20 },
          { atividade: 'Financeiro e administrativo', percentual: 10 },
          { atividade: 'Desenvolvimento pessoal e networking', percentual: 10 }
        ],
        rotinas: [
          { atividade: 'Reunião de alinhamento com líderes', frequencia: 'Semanal', dia: 'Segunda' },
          { atividade: 'Review de métricas e KPIs', frequencia: 'Semanal', dia: 'Segunda' },
          { atividade: '1:1 com reports diretos', frequencia: 'Quinzenal', dia: 'Terça' },
          { atividade: 'Análise financeira e DRE', frequencia: 'Mensal', dia: 'Primeira semana' }
        ],
        delegacoes: [
          { atividade: 'Gestão operacional do produto', para: 'Head de Produto' },
          { atividade: 'Atendimento de suporte nível 1', para: 'Head de CS' },
          { atividade: 'Prospecção de leads', para: 'SDRs' }
        ],
        focoTrimestre: 'Dobrar o MRR de R$180k para R$300k através de vendas enterprise e redução de churn.',
      },
    };

    const demoBlocks: BlockStatus[] = initialBlocks.map(b => ({
      ...b,
      completed: true,
      progress: 100
    }));

    const newProjectData: ProjectData = {
      project: demoProject,
      data: demoData,
      blocks: demoBlocks
    };

    setProjectsData(prev => [...prev, newProjectData]);
    setCurrentProjectId(demoProject.id);
    setCurrentBlock('goldenCircle');
  }, []);

  const selectProject = useCallback((id: string) => {
    setCurrentProjectId(id);
    setCurrentBlock('goldenCircle');
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjectsData(prev => prev.filter(pd => pd.project.id !== id));
    if (currentProjectId === id) {
      setCurrentProjectId(null);
    }
  }, [currentProjectId]);

  const goToProjectList = useCallback(() => {
    setCurrentProjectId(null);
  }, []);

  return (
    <ConsultingContext.Provider value={{
      data,
      blocks,
      currentBlock,
      projects,
      currentProject,
      setCurrentBlock,
      updateData,
      updateBlockProgress,
      markBlockComplete,
      getTotalProgress,
      resetAll,
      createProject,
      createDemoProject,
      selectProject,
      deleteProject,
      goToProjectList,
    }}>
      {children}
    </ConsultingContext.Provider>
  );
}

export function useConsulting() {
  const context = useContext(ConsultingContext);
  if (context === undefined) {
    throw new Error('useConsulting must be used within a ConsultingProvider');
  }
  return context;
}
