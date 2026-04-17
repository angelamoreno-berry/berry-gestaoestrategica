import { Project } from '@/types-v2/consulting';

interface BlockSuggestions {
  goldenCircle: {
    why: string;
    how: string;
    what: string;
  };
  identidade: {
    visao: string;
    missao: string;
    valores: string[];
    posicionamento: string;
  };
  swot: {
    forcas: string[];
    fraquezas: string[];
    oportunidades: string[];
    ameacas: string[];
  };
  icp: {
    caracteristicasDemograficas: string;
    dores: string[];
    desejos: string[];
  };
  concorrentes: {
    publicoAlvo: string;
    propostaValor: string;
    diferenciais: string[];
  };
  swotPessoal: {
    forcas: string[];
    fraquezas: string[];
    oportunidades: string[];
    ameacas: string[];
  };
  agendaCEO: {
    focoTrimestre: string;
    prioridades: string[];
    alocacaoTempo: Array<{ atividade: string; percentual: number }>;
  };
}

function getCompanySize(colaboradores: number): 'micro' | 'pequena' | 'media' {
  if (colaboradores <= 10) return 'micro';
  if (colaboradores <= 50) return 'pequena';
  return 'media';
}

function getRevenueRange(faturamento: number): string {
  if (faturamento < 50000) return 'até R$50k/mês';
  if (faturamento < 150000) return 'R$50k-150k/mês';
  if (faturamento < 500000) return 'R$150k-500k/mês';
  return 'acima de R$500k/mês';
}

export function generateSuggestions(project: Project): BlockSuggestions {
  const { segmento, nomeEmpresa, quantidadeColaboradores, faturamentoMedio } = project;
  const size = getCompanySize(quantidadeColaboradores);
  const revenueRange = getRevenueRange(faturamentoMedio);
  
  // Templates adaptáveis baseados no segmento
  const segmentoLower = segmento.toLowerCase();
  
  // Determinar tipo de negócio para personalização
  const isServicos = segmentoLower.includes('serviço') || segmentoLower.includes('consultoria') || segmentoLower.includes('agência');
  const isTecnologia = segmentoLower.includes('tecnologia') || segmentoLower.includes('software') || segmentoLower.includes('digital');
  const isVarejo = segmentoLower.includes('varejo') || segmentoLower.includes('loja') || segmentoLower.includes('comércio');
  const isSaude = segmentoLower.includes('saúde') || segmentoLower.includes('clínica') || segmentoLower.includes('médic');
  const isAlimentacao = segmentoLower.includes('alimenta') || segmentoLower.includes('restaurante') || segmentoLower.includes('food');
  
  return {
    goldenCircle: {
      why: generateWhySuggestion(segmento, nomeEmpresa, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      how: generateHowSuggestion(segmento, size, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      what: generateWhatSuggestion(segmento, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
    },
    identidade: {
      visao: `Ser referência em ${segmento} na nossa região até 2028, reconhecidos pela excelência e inovação no atendimento aos nossos clientes.`,
      missao: `Entregar soluções de ${segmento} que transformam a vida dos nossos clientes, com qualidade, proximidade e compromisso com resultados.`,
      valores: generateValoresSuggestion({ isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      posicionamento: `A ${nomeEmpresa} é para ${getPublicoAlvo(segmento)} que buscam ${getBeneficioPrincipal(segmento)}. Diferente de outros players, entregamos ${getDiferencialChave(segmento)}.`,
    },
    swot: {
      forcas: generateForcasSuggestion(size, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      fraquezas: generateFraquezasSuggestion(size, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      oportunidades: generateOportunidadesSuggestion(segmento, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      ameacas: generateAmeacasSuggestion(segmento, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
    },
    icp: {
      caracteristicasDemograficas: generateICPDemografico(segmento, revenueRange, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      dores: generateDoresSuggestion(segmento, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      desejos: generateDesejosSuggestion(segmento, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
    },
    concorrentes: {
      publicoAlvo: getPublicoAlvo(segmento),
      propostaValor: `Entregamos ${getBeneficioPrincipal(segmento)} de forma única, combinando ${getDiferencialChave(segmento)} com atendimento personalizado.`,
      diferenciais: generateDiferenciaisSuggestion({ isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
    },
    swotPessoal: {
      forcas: generateSwotPessoalForcas(size),
      fraquezas: generateSwotPessoalFraquezas(size),
      oportunidades: generateSwotPessoalOportunidades(),
      ameacas: generateSwotPessoalAmeacas(),
    },
    agendaCEO: {
      focoTrimestre: generateFocoTrimestreSuggestion(size, { isServicos, isTecnologia, isVarejo, isSaude, isAlimentacao }),
      prioridades: generatePrioridadesSuggestion(size),
      alocacaoTempo: generateAlocacaoTempoSuggestion(size),
    },
  };
}

interface BusinessType {
  isServicos: boolean;
  isTecnologia: boolean;
  isVarejo: boolean;
  isSaude: boolean;
  isAlimentacao: boolean;
}

function generateWhySuggestion(segmento: string, nomeEmpresa: string, type: BusinessType): string {
  if (type.isTecnologia) {
    return `Acreditamos que a tecnologia deve simplificar a vida das pessoas e empresas, não complicar. Existimos para democratizar o acesso a soluções que antes só grandes empresas podiam ter.`;
  }
  if (type.isSaude) {
    return `Acreditamos que toda pessoa merece acesso a cuidados de saúde de qualidade, com humanização e respeito. Existimos para transformar a experiência de saúde dos nossos pacientes.`;
  }
  if (type.isAlimentacao) {
    return `Acreditamos que a alimentação vai além de nutrir o corpo - ela conecta pessoas e cria memórias. Existimos para proporcionar experiências gastronômicas que fazem a diferença no dia a dia.`;
  }
  if (type.isVarejo) {
    return `Acreditamos que cada cliente merece uma experiência de compra excepcional. Existimos para oferecer produtos de qualidade com um atendimento que faz o cliente se sentir especial.`;
  }
  if (type.isServicos) {
    return `Acreditamos que nossos clientes merecem parceiros que realmente se importam com seus resultados. Existimos para entregar valor real e construir relacionamentos duradouros.`;
  }
  return `Acreditamos que empresas de ${segmento} podem alcançar resultados extraordinários quando têm o parceiro certo. Existimos para ser esse parceiro e impulsionar o sucesso dos nossos clientes.`;
}

function generateHowSuggestion(segmento: string, size: string, type: BusinessType): string {
  const sizeContext = size === 'micro' ? 'atendimento próximo e personalizado' : 
                      size === 'pequena' ? 'processos ágeis e equipe dedicada' : 
                      'metodologia estruturada e escala com qualidade';
  
  if (type.isTecnologia) {
    return `Através de soluções intuitivas, suporte humanizado e implementação simplificada. Combinamos ${sizeContext} com tecnologia de ponta.`;
  }
  if (type.isSaude) {
    return `Através de protocolos de excelência, equipe qualificada e foco na experiência do paciente. Oferecemos ${sizeContext} com humanização em cada etapa.`;
  }
  if (type.isAlimentacao) {
    return `Através de ingredientes selecionados, receitas desenvolvidas com carinho e ambiente acolhedor. Mantemos ${sizeContext} sem abrir mão da qualidade.`;
  }
  return `Através de ${sizeContext}, compromisso com prazos e transparência total em cada etapa do processo. Nossa metodologia garante resultados consistentes.`;
}

function generateWhatSuggestion(segmento: string, type: BusinessType): string {
  if (type.isTecnologia) {
    return `Soluções tecnológicas que incluem: software/sistemas personalizados, suporte técnico especializado, treinamento de equipes, consultoria de implementação e acompanhamento contínuo de resultados.`;
  }
  if (type.isSaude) {
    return `Serviços de saúde que incluem: consultas e atendimentos especializados, procedimentos com tecnologia de ponta, acompanhamento personalizado, programas de prevenção e bem-estar.`;
  }
  if (type.isAlimentacao) {
    return `Experiências gastronômicas que incluem: pratos preparados com ingredientes frescos, cardápio diversificado, atendimento caloroso, ambiente agradável e opções para diferentes ocasiões e preferências.`;
  }
  if (type.isVarejo) {
    return `Produtos e serviços que incluem: curadoria de itens de qualidade, consultoria de compra personalizada, entrega facilitada, pós-venda atencioso e programa de fidelidade.`;
  }
  return `Soluções completas de ${segmento} que incluem: diagnóstico inicial, planejamento estratégico, execução com acompanhamento, suporte contínuo e otimização de resultados.`;
}

function generateValoresSuggestion(type: BusinessType): string[] {
  const base = ['Compromisso com Resultados', 'Transparência', 'Inovação'];
  
  if (type.isSaude) return [...base, 'Humanização', 'Ética Profissional'];
  if (type.isTecnologia) return [...base, 'Simplicidade', 'Agilidade'];
  if (type.isAlimentacao) return [...base, 'Qualidade', 'Hospitalidade'];
  if (type.isVarejo) return [...base, 'Excelência no Atendimento', 'Confiança'];
  return [...base, 'Proximidade com o Cliente', 'Excelência'];
}

function getPublicoAlvo(segmento: string): string {
  return `empresas e pessoas que buscam soluções de ${segmento}`;
}

function getBeneficioPrincipal(segmento: string): string {
  return `qualidade, confiabilidade e resultados comprovados em ${segmento}`;
}

function getDiferencialChave(segmento: string): string {
  return `expertise específica no segmento com atendimento personalizado`;
}

function generateForcasSuggestion(size: string, type: BusinessType): string[] {
  const base = ['Conhecimento profundo do mercado', 'Relacionamento próximo com clientes'];
  
  if (size === 'micro') {
    return [...base, 'Agilidade na tomada de decisão', 'Flexibilidade para personalizar'];
  }
  if (size === 'pequena') {
    return [...base, 'Equipe qualificada e engajada', 'Processos em estruturação'];
  }
  return [...base, 'Estrutura consolidada', 'Capacidade de escala'];
}

function generateFraquezasSuggestion(size: string, type: BusinessType): string[] {
  if (size === 'micro') {
    return ['Recursos limitados para investimento', 'Dependência de poucos clientes', 'Falta de processos documentados'];
  }
  if (size === 'pequena') {
    return ['Necessidade de profissionalizar gestão', 'Marketing ainda incipiente', 'Processos não totalmente documentados'];
  }
  return ['Possível lentidão em decisões', 'Custos fixos elevados', 'Dificuldade de inovar rapidamente'];
}

function generateOportunidadesSuggestion(segmento: string, type: BusinessType): string[] {
  const base = ['Expansão digital e novos canais', 'Parcerias estratégicas'];
  
  if (type.isTecnologia) return [...base, 'Crescimento da digitalização', 'Novos nichos de mercado'];
  if (type.isSaude) return [...base, 'Telemedicina em crescimento', 'Maior consciência sobre prevenção'];
  if (type.isAlimentacao) return [...base, 'Delivery e dark kitchens', 'Alimentação saudável em alta'];
  return [...base, 'Mercado em expansão', 'Novas tecnologias disponíveis'];
}

function generateAmeacasSuggestion(segmento: string, type: BusinessType): string[] {
  return [
    'Aumento da concorrência',
    'Mudanças econômicas e de comportamento',
    'Novos entrantes com modelos disruptivos',
    'Pressão por redução de preços'
  ];
}

function generateICPDemografico(segmento: string, revenueRange: string, type: BusinessType): string {
  if (type.isTecnologia) {
    return `Empresas de serviços e comércio com 10-100 funcionários, faturamento de ${revenueRange}, localizadas em centros urbanos, que buscam modernizar operações e estão abertas a investir em tecnologia.`;
  }
  if (type.isSaude) {
    return `Adultos de 25-60 anos, classes B e C, que valorizam saúde e bem-estar, buscam praticidade no atendimento e estão dispostos a pagar por qualidade e conveniência.`;
  }
  if (type.isAlimentacao) {
    return `Pessoas de 18-50 anos, classes B e C, que valorizam experiências gastronômicas, buscam praticidade ou momentos especiais, ativas em redes sociais e influenciadas por avaliações online.`;
  }
  return `Empresas e consumidores que buscam soluções de ${segmento}, valorizam qualidade e atendimento, com capacidade de investimento e interesse em relacionamentos de longo prazo.`;
}

function generateDoresSuggestion(segmento: string, type: BusinessType): string[] {
  if (type.isTecnologia) {
    return [
      'Perdem tempo com processos manuais e planilhas',
      'Não conseguem ter visão clara dos números do negócio',
      'Já tentaram outras soluções sem sucesso',
      'Têm medo de sistemas complexos demais'
    ];
  }
  if (type.isSaude) {
    return [
      'Dificuldade de agendar e espera longa',
      'Falta de acolhimento humanizado',
      'Comunicação confusa sobre tratamentos',
      'Preocupação com custos inesperados'
    ];
  }
  return [
    'Dificuldade em encontrar fornecedores confiáveis',
    'Experiências ruins com soluções anteriores',
    'Falta de tempo para pesquisar opções',
    'Receio de não ter o resultado esperado'
  ];
}

function generateDesejosSuggestion(segmento: string, type: BusinessType): string[] {
  if (type.isTecnologia) {
    return [
      'Ter controle total do negócio na palma da mão',
      'Tomar decisões baseadas em dados confiáveis',
      'Ganhar tempo para focar no estratégico',
      'Escalar sem perder qualidade'
    ];
  }
  if (type.isSaude) {
    return [
      'Ser bem atendido e se sentir acolhido',
      'Ter clareza sobre seu tratamento e custos',
      'Resolver problemas de saúde com praticidade',
      'Confiar no profissional que o atende'
    ];
  }
  return [
    'Encontrar um parceiro de confiança',
    'Ter resultados consistentes e previsíveis',
    'Simplificar processos do dia a dia',
    'Crescer de forma sustentável'
  ];
}

function generateDiferenciaisSuggestion(type: BusinessType): string[] {
  return [
    'Atendimento personalizado e humanizado',
    'Agilidade na entrega e resposta',
    'Transparência em todas as etapas',
    'Foco obsessivo em resultados'
  ];
}

// SWOT Pessoal functions
function generateSwotPessoalForcas(size: string): string[] {
  const base = ['Visão estratégica', 'Conhecimento do mercado', 'Relacionamento com clientes'];
  if (size === 'micro') {
    return [...base, 'Agilidade na tomada de decisão', 'Flexibilidade'];
  }
  if (size === 'pequena') {
    return [...base, 'Capacidade de liderança', 'Resiliência'];
  }
  return [...base, 'Experiência em gestão', 'Networking consolidado'];
}

function generateSwotPessoalFraquezas(size: string): string[] {
  if (size === 'micro') {
    return ['Dificuldade em delegar', 'Centralização de decisões', 'Falta de tempo para estratégia', 'Gestão financeira pessoal'];
  }
  if (size === 'pequena') {
    return ['Delegação em desenvolvimento', 'Gestão de conflitos', 'Equilíbrio vida-trabalho', 'Desenvolvimento de líderes'];
  }
  return ['Dificuldade de inovar', 'Resistência a mudanças', 'Comunicação com novas gerações', 'Atualização tecnológica'];
}

function generateSwotPessoalOportunidades(): string[] {
  return [
    'Mentoria com empresários experientes',
    'Cursos de liderança e gestão',
    'Networking em associações do setor',
    'Coaching executivo',
    'Grupos de mastermind'
  ];
}

function generateSwotPessoalAmeacas(): string[] {
  return [
    'Burnout e esgotamento',
    'Síndrome do impostor',
    'Isolamento profissional',
    'Falta de atualização do mercado',
    'Dependência excessiva do negócio'
  ];
}

// Agenda CEO functions
function generateFocoTrimestreSuggestion(size: string, type: BusinessType): string {
  if (size === 'micro') {
    return 'Estruturar os processos básicos da empresa e definir métricas claras de acompanhamento para sair do operacional e ter mais tempo para o estratégico.';
  }
  if (size === 'pequena') {
    return 'Desenvolver a equipe atual para assumir responsabilidades operacionais, liberando tempo para focar em vendas e parcerias estratégicas.';
  }
  return 'Profissionalizar a gestão com indicadores claros por área e preparar a empresa para o próximo nível de crescimento.';
}

function generatePrioridadesSuggestion(size: string): string[] {
  if (size === 'micro') {
    return ['Vendas e prospecção de clientes', 'Estruturação de processos', 'Gestão financeira', 'Primeira contratação estratégica'];
  }
  if (size === 'pequena') {
    return ['Desenvolvimento da equipe', 'Vendas e parcerias', 'Melhoria de processos', 'Gestão financeira', 'Cultura organizacional'];
  }
  return ['Estratégia e visão de longo prazo', 'Desenvolvimento de líderes', 'Relacionamento com stakeholders', 'Inovação e novos mercados', 'Governança'];
}

function generateAlocacaoTempoSuggestion(size: string): Array<{ atividade: string; percentual: number }> {
  if (size === 'micro') {
    return [
      { atividade: 'Vendas e Clientes', percentual: 40 },
      { atividade: 'Operação', percentual: 30 },
      { atividade: 'Estratégia e Planejamento', percentual: 20 },
      { atividade: 'Administrativo/Financeiro', percentual: 10 }
    ];
  }
  if (size === 'pequena') {
    return [
      { atividade: 'Estratégia e Planejamento', percentual: 30 },
      { atividade: 'Pessoas e Liderança', percentual: 25 },
      { atividade: 'Vendas e Relacionamento', percentual: 25 },
      { atividade: 'Operação', percentual: 15 },
      { atividade: 'Administrativo', percentual: 5 }
    ];
  }
  return [
    { atividade: 'Estratégia e Visão', percentual: 35 },
    { atividade: 'Pessoas e Cultura', percentual: 25 },
    { atividade: 'Relacionamento Externo', percentual: 20 },
    { atividade: 'Inovação e Novos Negócios', percentual: 15 },
    { atividade: 'Governança', percentual: 5 }
  ];
}
