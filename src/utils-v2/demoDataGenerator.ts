import { ConsultingData, Project } from '@/types/consulting';

interface DemoParams {
  segmento: string;
  faturamentoMedio: number;
  quantidadeColaboradores: number;
}

function getCompanySize(colaboradores: number): 'micro' | 'pequena' | 'media' | 'grande' {
  if (colaboradores <= 5) return 'micro';
  if (colaboradores <= 19) return 'pequena';
  if (colaboradores <= 99) return 'media';
  return 'grande';
}

function getRevenueSize(faturamento: number): 'inicial' | 'pequeno' | 'medio' | 'alto' {
  if (faturamento <= 50000) return 'inicial';
  if (faturamento <= 200000) return 'pequeno';
  if (faturamento <= 500000) return 'medio';
  return 'alto';
}

function generateCompanyName(segmento: string): string {
  const prefixes = ['Alpha', 'Prime', 'Excellence', 'Master', 'Top', 'Premium', 'Plus', 'Pro', 'Elite', 'Superior'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Extrair a primeira palavra relevante do segmento
  const segmentoWords = segmento.split(' ').filter(w => w.length > 3);
  const mainWord = segmentoWords[0] || segmento.split(' ')[0];
  
  return `${randomPrefix} ${mainWord}`;
}

function generateIdentidade(segmento: string, size: string, revenueSize: string) {
  const segmentoLower = segmento.toLowerCase();
  
  const visaoBySize = {
    micro: `Ser reconhecida como a melhor opção em ${segmentoLower} na nossa região, oferecendo um atendimento único e personalizado para nossos clientes.`,
    pequena: `Tornar-se referência em ${segmentoLower} na região, expandindo nossa atuação e impactando positivamente a vida de milhares de clientes até 2028.`,
    media: `Liderar o mercado de ${segmentoLower} no estado, sendo reconhecida pela excelência, inovação e impacto positivo na comunidade e colaboradores.`,
    grande: `Ser a principal referência nacional em ${segmentoLower}, expandindo para novos mercados e consolidando nossa posição de liderança com sustentabilidade.`
  };

  const missaoBySize = {
    micro: `Entregar ${segmentoLower} com qualidade excepcional e atendimento personalizado, construindo relacionamentos duradouros com cada cliente.`,
    pequena: `Oferecer soluções de ${segmentoLower} que superam expectativas, com foco na satisfação do cliente e desenvolvimento contínuo da nossa equipe.`,
    media: `Proporcionar ${segmentoLower} de excelência, investindo em pessoas, processos e tecnologia para gerar valor sustentável para clientes e colaboradores.`,
    grande: `Transformar o mercado de ${segmentoLower} através de inovação contínua, excelência operacional e compromisso inabalável com resultados e sustentabilidade.`
  };

  const valoresBySize = {
    micro: ['Qualidade', 'Honestidade', 'Dedicação', 'Proximidade com o cliente'],
    pequena: ['Excelência', 'Foco no Cliente', 'Integridade', 'Trabalho em Equipe', 'Melhoria Contínua'],
    media: ['Inovação', 'Excelência', 'Colaboração', 'Transparência', 'Responsabilidade', 'Foco em Resultados'],
    grande: ['Liderança', 'Inovação', 'Sustentabilidade', 'Diversidade', 'Excelência', 'Integridade', 'Orientação ao Cliente']
  };

  return {
    visao: visaoBySize[size as keyof typeof visaoBySize] || visaoBySize.pequena,
    missao: missaoBySize[size as keyof typeof missaoBySize] || missaoBySize.pequena,
    valores: valoresBySize[size as keyof typeof valoresBySize] || valoresBySize.pequena,
    posicionamento: `Somos especialistas em ${segmentoLower}, oferecendo um diferencial único através de atendimento personalizado, qualidade comprovada e compromisso genuíno com os resultados dos nossos clientes.`
  };
}

function generateGoldenCircle(segmento: string, size: string) {
  const segmentoLower = segmento.toLowerCase();
  
  return {
    why: `Acreditamos que ${segmentoLower} tem o poder de transformar vidas e negócios. Nossa paixão é ver nossos clientes prosperarem, e cada entrega é uma oportunidade de fazer a diferença.`,
    how: `Combinamos expertise técnica em ${segmentoLower} com um atendimento verdadeiramente humano. Ouvimos atentamente, entendemos as necessidades específicas e entregamos soluções sob medida.`,
    what: `Oferecemos ${segmentoLower} de alta qualidade, com foco em resultados mensuráveis, atendimento diferenciado e relacionamento de longo prazo com cada cliente.`
  };
}

function generateSWOT(segmento: string, size: string, colaboradores: number) {
  const segmentoLower = segmento.toLowerCase();
  
  const forcasBySize = {
    micro: [
      'Atendimento personalizado e próximo ao cliente',
      'Agilidade na tomada de decisões',
      'Flexibilidade para adaptar ofertas',
      'Conhecimento profundo do nicho local'
    ],
    pequena: [
      `Expertise consolidada em ${segmentoLower}`,
      'Equipe engajada e comprometida',
      'Boa reputação no mercado local',
      'Relacionamento próximo com clientes',
      'Capacidade de customização'
    ],
    media: [
      `Liderança técnica em ${segmentoLower}`,
      'Processos bem estruturados',
      'Marca reconhecida regionalmente',
      'Equipe multidisciplinar qualificada',
      'Base de clientes diversificada'
    ],
    grande: [
      `Referência de mercado em ${segmentoLower}`,
      'Escala e poder de negociação',
      'Investimento contínuo em inovação',
      'Processos padronizados e eficientes',
      'Marca forte e reconhecida nacionalmente'
    ]
  };

  const fraquezasBySize = {
    micro: [
      'Recursos financeiros limitados',
      'Dependência do proprietário',
      'Pouca visibilidade de marca',
      'Dificuldade de escalar operações'
    ],
    pequena: [
      'Marketing ainda em desenvolvimento',
      'Processos não totalmente documentados',
      'Equipe enxuta para a demanda',
      'Dependência de poucos clientes-chave',
      'Falta de sistemas integrados'
    ],
    media: [
      'Comunicação entre áreas pode melhorar',
      'Alguns processos ainda manuais',
      'Turnover em posições operacionais',
      'Necessidade de mais automação',
      'Gestão de conhecimento deficiente'
    ],
    grande: [
      'Burocracia em alguns processos',
      'Agilidade reduzida em decisões',
      'Custo operacional elevado',
      'Dependência de sistemas legados',
      'Comunicação entre unidades'
    ]
  };

  const oportunidadesBySize = {
    micro: [
      'Mercado local ainda pouco explorado',
      'Digitalização de processos',
      'Parcerias com empresas complementares',
      'Novos canais de venda online'
    ],
    pequena: [
      `Crescimento da demanda por ${segmentoLower}`,
      'Expansão para cidades vizinhas',
      'Desenvolvimento de novos produtos/serviços',
      'Marketing digital para atrair novos clientes',
      'Parcerias estratégicas'
    ],
    media: [
      'Expansão regional agressiva',
      'Aquisição de concorrentes menores',
      'Lançamento de linha premium',
      'Internacionalização para LATAM',
      'Novos segmentos de mercado'
    ],
    grande: [
      'Consolidação através de M&A',
      'Expansão internacional',
      'Diversificação de portfólio',
      'Liderança em inovação do setor',
      'ESG como diferencial competitivo'
    ]
  };

  const ameacasBySize = {
    micro: [
      'Concorrentes com mais recursos',
      'Instabilidade econômica',
      'Mudanças nos hábitos do consumidor',
      'Dificuldade de atrair talentos'
    ],
    pequena: [
      'Entrada de grandes players no mercado',
      `Commoditização de ${segmentoLower}`,
      'Crise econômica afetando clientes',
      'Aumento de custos operacionais',
      'Mudanças regulatórias'
    ],
    media: [
      'Concorrência acirrada de grandes players',
      'Disrupção tecnológica no setor',
      'Pressão por redução de preços',
      'Escassez de mão de obra qualificada',
      'Mudanças regulatórias complexas'
    ],
    grande: [
      'Disrupção por startups inovadoras',
      'Mudanças regulatórias impactantes',
      'Crises econômicas globais',
      'Guerra de preços com concorrentes',
      'Mudanças tecnológicas aceleradas'
    ]
  };

  return {
    forcas: forcasBySize[size as keyof typeof forcasBySize] || forcasBySize.pequena,
    fraquezas: fraquezasBySize[size as keyof typeof fraquezasBySize] || fraquezasBySize.pequena,
    oportunidades: oportunidadesBySize[size as keyof typeof oportunidadesBySize] || oportunidadesBySize.pequena,
    ameacas: ameacasBySize[size as keyof typeof ameacasBySize] || ameacasBySize.pequena,
    horizontes: {
      curto: size === 'micro' 
        ? 'Estabilizar operações e aumentar base de clientes em 50%'
        : size === 'pequena'
        ? 'Dobrar o faturamento e estruturar processos-chave'
        : size === 'media'
        ? 'Expandir para 3 novas regiões e aumentar market share em 20%'
        : 'Consolidar liderança e preparar expansão internacional',
      medio: size === 'micro'
        ? 'Contratar equipe e triplicar o faturamento'
        : size === 'pequena'
        ? `Ser referência local em ${segmentoLower} e expandir para cidades vizinhas`
        : size === 'media'
        ? 'Tornar-se líder regional e iniciar operações em outros estados'
        : 'Liderar nacionalmente e iniciar operações na América Latina',
      longo: size === 'micro'
        ? `Tornar-se referência regional em ${segmentoLower}`
        : size === 'pequena'
        ? `Liderar o mercado regional de ${segmentoLower} com múltiplas unidades`
        : size === 'media'
        ? `Ser top 3 nacional em ${segmentoLower} e explorar novos mercados`
        : `Liderar globalmente em ${segmentoLower} com presença em múltiplos países`
    }
  };
}

function generateICP(segmento: string, faturamento: number, size: string) {
  const segmentoLower = segmento.toLowerCase();
  const ticketMedio = Math.round(faturamento / 200);
  
  const icpBySize = {
    micro: {
      caracteristicasDemograficas: `Pessoas físicas ou pequenos empresários da região, 25-55 anos, que buscam ${segmentoLower} de qualidade com atendimento próximo e personalizado.`,
      descricao: `Cliente que valoriza relacionamento, qualidade e confiança. Prefere indicações e atendimento humanizado. Busca solução para ${segmentoLower} com bom custo-benefício.`,
      segmentos: ['Consumidores locais', 'Pequenos negócios da região', 'Indicações de clientes atuais'],
    },
    pequena: {
      caracteristicasDemograficas: `Empresas de pequeno e médio porte ou consumidores exigentes, 30-55 anos, com poder aquisitivo médio-alto, que valorizam qualidade em ${segmentoLower}.`,
      descricao: `Cliente que já teve experiências ruins com concorrentes, valoriza profissionalismo e busca parceria de longo prazo. Está disposto a pagar mais por qualidade comprovada.`,
      segmentos: ['PMEs da região', 'Profissionais liberais', 'Classe média-alta', 'Empresas em crescimento'],
    },
    media: {
      caracteristicasDemograficas: `Empresas de médio porte ou consumidores premium, decisores de 35-55 anos, faturamento anual acima de R$ 1 milhão, buscando parceiros estratégicos em ${segmentoLower}.`,
      descricao: `Cliente sofisticado que entende de ${segmentoLower}, compara alternativas, valoriza track record e busca parceria estratégica. Processo de decisão mais estruturado.`,
      segmentos: ['Médias empresas', 'Corporações regionais', 'Franquias', 'Redes de negócios'],
    },
    grande: {
      caracteristicasDemograficas: `Grandes empresas e corporações, decisores C-level, operações acima de R$ 10 milhões anuais, buscando líderes de mercado em ${segmentoLower}.`,
      descricao: `Cliente corporativo com processo de compra estruturado, RFPs, múltiplos stakeholders. Valoriza solidez, compliance, escalabilidade e parceria de longo prazo.`,
      segmentos: ['Grandes corporações', 'Multinacionais', 'Órgãos públicos', 'Grandes redes'],
    }
  };

  const selected = icpBySize[size as keyof typeof icpBySize] || icpBySize.pequena;

  return {
    ...selected,
    dores: [
      `Dificuldade em encontrar ${segmentoLower} de qualidade consistente`,
      'Experiências anteriores frustrantes com fornecedores',
      'Falta de transparência nos preços e processos',
      'Atendimento impessoal e demorado',
      'Preocupação com prazos e entregas'
    ],
    dpisos: [
      `Dificuldade em encontrar ${segmentoLower} de qualidade`,
      'Experiências frustrantes com fornecedores anteriores',
      'Falta de transparência e comunicação'
    ],
    desejos: [
      `Encontrar um parceiro confiável em ${segmentoLower}`,
      'Ter previsibilidade de qualidade e prazos',
      'Construir relacionamento de longo prazo',
      'Receber atendimento personalizado',
      'Obter resultados que superem expectativas'
    ],
    necessidades: [
      `Solução confiável para ${segmentoLower}`,
      'Comunicação clara e transparente',
      'Flexibilidade para necessidades específicas',
      'Suporte quando precisar'
    ],
    comportamento: 'Pesquisa online e pede indicações antes de decidir. Valoriza avaliações de outros clientes. Prefere testar antes de compromissos grandes. Sensível a preço mas paga mais por qualidade comprovada.',
    ondeEncontrar: 'Google (pesquisa local), Instagram, indicações de conhecidos, grupos de WhatsApp, LinkedIn, eventos do setor, associações comerciais'
  };
}

function generateConcorrentes(segmento: string, size: string) {
  const segmentoLower = segmento.toLowerCase();
  
  const concorrentesBySize = {
    micro: [
      { nome: 'Concorrente Local A', pontoForte: 'Preço mais baixo', pontoFraco: 'Qualidade inconsistente' },
      { nome: 'Concorrente Local B', pontoForte: 'Localização privilegiada', pontoFraco: 'Atendimento impessoal' }
    ],
    pequena: [
      { nome: 'Líder Regional', pontoForte: 'Marca conhecida e boa reputação', pontoFraco: 'Atendimento massificado, pouca personalização' },
      { nome: 'Concorrente Direto', pontoForte: 'Preço competitivo', pontoFraco: 'Qualidade inferior, muitas reclamações' },
      { nome: 'Novo Entrante', pontoForte: 'Marketing agressivo, visual moderno', pontoFraco: 'Sem experiência, equipe inexperiente' }
    ],
    media: [
      { nome: 'Líder de Mercado', pontoForte: 'Escala, marca forte, presença nacional', pontoFraco: 'Burocrático, atendimento engessado' },
      { nome: 'Concorrente Regional', pontoForte: 'Forte presença local, bons preços', pontoFraco: 'Tecnologia defasada, processos manuais' },
      { nome: 'Startup Inovadora', pontoForte: 'Tecnologia de ponta, UX moderna', pontoFraco: 'Pouca experiência, suporte limitado' }
    ],
    grande: [
      { nome: 'Multinacional A', pontoForte: 'Recursos ilimitados, marca global', pontoFraco: 'Lento para adaptar, custo alto' },
      { nome: 'Multinacional B', pontoForte: 'Tecnologia avançada, inovação', pontoFraco: 'Distante do cliente, suporte terceirizado' },
      { nome: 'Nacional Consolidada', pontoForte: 'Conhecimento do mercado local', pontoFraco: 'Gestão familiar, resistente a mudanças' }
    ]
  };

  const concorrentes = concorrentesBySize[size as keyof typeof concorrentesBySize] || concorrentesBySize.pequena;

  return {
    concorrentes,
    principais: concorrentes.map((c, i) => ({
      nome: c.nome,
      tipo: i === 0 ? 'Direto' : i === 1 ? 'Direto' : 'Indireto',
      pontosFortes: c.pontoForte,
      pontosFracos: c.pontoFraco
    })),
    diferenciais: [
      'Atendimento personalizado e humanizado',
      `Especialização profunda em ${segmentoLower}`,
      'Compromisso com prazos e qualidade',
      'Flexibilidade para necessidades específicas',
      'Relacionamento de longo prazo'
    ],
    publicoAlvo: `Clientes que buscam ${segmentoLower} de qualidade, com atendimento diferenciado e resultados comprovados`,
    propostaValor: `Oferecemos ${segmentoLower} de excelência com atendimento personalizado, garantia de qualidade e compromisso genuíno com os resultados de cada cliente.`
  };
}

function generateOrganograma(colaboradores: number, size: string) {
  if (colaboradores <= 3) {
    return {
      cargos: [
        { titulo: 'Proprietário/Gestor', nivel: 1 as const, responsabilidades: ['Gestão geral', 'Vendas', 'Financeiro'], kpis: ['Faturamento', 'Satisfação do cliente'], subordinadoA: '' },
        { titulo: 'Assistente/Operacional', nivel: 2 as const, responsabilidades: ['Operação', 'Atendimento', 'Suporte'], kpis: ['Qualidade de entrega', 'Produtividade'], subordinadoA: 'Proprietário' }
      ]
    };
  } else if (colaboradores <= 10) {
    return {
      cargos: [
        { titulo: 'Diretor/Fundador', nivel: 1 as const, responsabilidades: ['Estratégia', 'Vendas-chave', 'Gestão de equipe'], kpis: ['Crescimento', 'Margem', 'Clima'], subordinadoA: '' },
        { titulo: 'Coordenador Comercial', nivel: 2 as const, responsabilidades: ['Vendas', 'Relacionamento', 'Metas'], kpis: ['Receita', 'Conversão'], subordinadoA: 'Diretor' },
        { titulo: 'Coordenador Operacional', nivel: 2 as const, responsabilidades: ['Produção/Serviço', 'Qualidade', 'Logística'], kpis: ['Entregas', 'Qualidade'], subordinadoA: 'Diretor' },
        { titulo: 'Administrativo/Financeiro', nivel: 2 as const, responsabilidades: ['Financeiro', 'RH', 'Compras'], kpis: ['Fluxo de caixa', 'Custos'], subordinadoA: 'Diretor' }
      ]
    };
  } else if (colaboradores <= 30) {
    return {
      cargos: [
        { titulo: 'CEO/Diretor Geral', nivel: 1 as const, responsabilidades: ['Estratégia', 'Cultura', 'Investidores'], kpis: ['Crescimento', 'EBITDA', 'NPS'], subordinadoA: '' },
        { titulo: 'Gerente Comercial', nivel: 2 as const, responsabilidades: ['Vendas', 'Marketing', 'Parcerias'], kpis: ['Receita', 'CAC', 'Conversão'], subordinadoA: 'CEO' },
        { titulo: 'Gerente de Operações', nivel: 2 as const, responsabilidades: ['Produção', 'Qualidade', 'Processos'], kpis: ['Eficiência', 'Qualidade', 'Prazo'], subordinadoA: 'CEO' },
        { titulo: 'Gerente Financeiro', nivel: 2 as const, responsabilidades: ['Finanças', 'Contabilidade', 'Controladoria'], kpis: ['Margem', 'Fluxo', 'DRE'], subordinadoA: 'CEO' },
        { titulo: 'Coordenador de RH', nivel: 3 as const, responsabilidades: ['Recrutamento', 'Treinamento', 'Clima'], kpis: ['Turnover', 'Clima', 'Vagas'], subordinadoA: 'CEO' }
      ]
    };
  } else {
    return {
      cargos: [
        { titulo: 'CEO', nivel: 1 as const, responsabilidades: ['Visão estratégica', 'Governança', 'Stakeholders'], kpis: ['Crescimento', 'Valor da empresa', 'ESG'], subordinadoA: '' },
        { titulo: 'COO', nivel: 2 as const, responsabilidades: ['Operações', 'Eficiência', 'Escalabilidade'], kpis: ['Eficiência operacional', 'Custos', 'SLAs'], subordinadoA: 'CEO' },
        { titulo: 'CFO', nivel: 2 as const, responsabilidades: ['Finanças', 'M&A', 'Investidores'], kpis: ['EBITDA', 'ROI', 'Valuation'], subordinadoA: 'CEO' },
        { titulo: 'CCO', nivel: 2 as const, responsabilidades: ['Comercial', 'Marketing', 'Expansão'], kpis: ['Receita', 'Market share', 'LTV'], subordinadoA: 'CEO' },
        { titulo: 'CHRO', nivel: 2 as const, responsabilidades: ['Pessoas', 'Cultura', 'Talentos'], kpis: ['Engajamento', 'Turnover', 'Diversidade'], subordinadoA: 'CEO' },
        { titulo: 'Gerentes de Área', nivel: 3 as const, responsabilidades: ['Gestão de times', 'Execução', 'Resultados'], kpis: ['Metas da área', 'Desenvolvimento'], subordinadoA: 'Diretoria' }
      ]
    };
  }
}

function generateProcessos(size: string, segmento: string) {
  const segmentoLower = segmento.toLowerCase();
  
  const processosBySize = {
    micro: [
      { nome: 'Atendimento ao Cliente', descricao: `Processo de atendimento e venda de ${segmentoLower}`, responsavel: 'Proprietário', frequencia: 'Contínuo' },
      { nome: 'Compras e Estoque', descricao: 'Reposição de materiais e controle de estoque', responsavel: 'Proprietário', frequencia: 'Semanal' },
      { nome: 'Fechamento de Caixa', descricao: 'Conferência de vendas e fechamento diário', responsavel: 'Proprietário', frequencia: 'Diário' }
    ],
    pequena: [
      { nome: 'Prospecção e Vendas', descricao: 'Captação de leads e conversão em clientes', responsavel: 'Comercial', frequencia: 'Contínuo' },
      { nome: 'Entrega/Produção', descricao: `Execução e entrega de ${segmentoLower}`, responsavel: 'Operações', frequencia: 'Contínuo' },
      { nome: 'Pós-venda', descricao: 'Acompanhamento de satisfação e fidelização', responsavel: 'Comercial', frequencia: 'Após cada entrega' },
      { nome: 'Gestão Financeira', descricao: 'Contas a pagar/receber, fluxo de caixa', responsavel: 'Administrativo', frequencia: 'Diário' },
      { nome: 'Reunião de Equipe', descricao: 'Alinhamento de metas e prioridades', responsavel: 'Diretor', frequencia: 'Semanal' }
    ],
    media: [
      { nome: 'Pipeline de Vendas', descricao: 'Gestão de oportunidades do lead ao fechamento', responsavel: 'Gerente Comercial', frequencia: 'Contínuo' },
      { nome: 'Onboarding de Clientes', descricao: 'Processo de ativação e treinamento de novos clientes', responsavel: 'CS', frequencia: 'A cada novo cliente' },
      { nome: 'Produção/Operação', descricao: `Execução padronizada de ${segmentoLower}`, responsavel: 'Gerente de Operações', frequencia: 'Contínuo' },
      { nome: 'Review Financeiro', descricao: 'Análise de DRE, indicadores e projeções', responsavel: 'Financeiro', frequencia: 'Mensal' },
      { nome: 'Reunião de Liderança', descricao: 'Alinhamento estratégico entre gestores', responsavel: 'CEO', frequencia: 'Semanal' },
      { nome: 'Avaliação de Desempenho', descricao: 'Feedback e desenvolvimento de colaboradores', responsavel: 'RH', frequencia: 'Trimestral' }
    ],
    grande: [
      { nome: 'Planejamento Estratégico', descricao: 'Definição de OKRs e metas corporativas', responsavel: 'CEO', frequencia: 'Trimestral' },
      { nome: 'Gestão de Portfólio', descricao: 'Gestão de produtos e serviços ofertados', responsavel: 'COO', frequencia: 'Mensal' },
      { nome: 'Governança', descricao: 'Reunião de diretoria e conselho', responsavel: 'CEO', frequencia: 'Mensal' },
      { nome: 'Gestão de Riscos', descricao: 'Identificação e mitigação de riscos', responsavel: 'CFO', frequencia: 'Mensal' },
      { nome: 'Gestão de Talentos', descricao: 'Desenvolvimento e retenção de pessoas-chave', responsavel: 'CHRO', frequencia: 'Contínuo' },
      { nome: 'Inovação', descricao: 'Pipeline de novos produtos e melhorias', responsavel: 'COO', frequencia: 'Mensal' }
    ]
  };

  const processos = processosBySize[size as keyof typeof processosBySize] || processosBySize.pequena;
  return {
    processos,
    lista: processos
  };
}

function generateFinanceiro(faturamento: number, colaboradores: number) {
  const custoMedioPorColaborador = 4500;
  const custoFolha = colaboradores * custoMedioPorColaborador;
  const despesasFixas = Math.round(faturamento * 0.35 + custoFolha);
  const despesasVariaveis = Math.round(faturamento * 0.25);
  const margem = Math.round(((faturamento - despesasFixas - despesasVariaveis) / faturamento) * 100);
  
  return {
    despesasFixas,
    despesasVariaveis,
    faturamentoAtual: faturamento,
    faturamentoMensal: faturamento,
    margemAtual: Math.max(margem, 5),
    margemLucro: Math.max(margem, 5),
    custoFixoMensal: despesasFixas,
    pontoEquilibrio: Math.round(despesasFixas / 0.4),
    metaFaturamento: Math.round(faturamento * 1.5),
    ticketMedio: Math.round(faturamento / (colaboradores * 25)),
    quantidadeClientes: colaboradores * 25,
    cac: Math.round(faturamento * 0.02 / colaboradores),
    ltv: Math.round(faturamento * 0.1),
    prazoMedioRecebimento: 15,
    prazoMedioPagamento: 30,
    capitalGiro: Math.round(faturamento * 0.5),
    reservaEmergencia: Math.round(despesasFixas * 3),
    dividas: faturamento > 100000 ? [
      { descricao: 'Financiamento de equipamentos', valorTotal: Math.round(faturamento * 0.3), parcelasMensais: Math.round(faturamento * 0.015), parcelasRestantes: 20, taxaJuros: 1.5 }
    ] : [],
    totalDividas: faturamento > 100000 ? Math.round(faturamento * 0.3) : 0,
    comprometimentoReceita: faturamento > 100000 ? 1.5 : 0,
    oportunidades: [
      'Aumentar ticket médio com produtos/serviços complementares',
      'Melhorar retenção de clientes existentes',
      'Reduzir custos operacionais com automação',
      'Expandir para novos canais de venda',
      'Desenvolver parcerias estratégicas'
    ],
    investimentos: [
      { area: 'Marketing e Vendas', valor: Math.round(faturamento * 0.1), prazo: '3 meses', prioridade: 'Alta' as const },
      { area: 'Tecnologia e Sistemas', valor: Math.round(faturamento * 0.05), prazo: '6 meses', prioridade: 'Media' as const }
    ],
    riscos: [
      'Concentração de receita em poucos clientes',
      'Inadimplência pode afetar fluxo de caixa',
      'Dependência de pessoas-chave'
    ]
  };
}

function generateAgendaCEO(size: string, faturamento: number) {
  const prioridadesBySize = {
    micro: [
      { descricao: 'Aumentar base de clientes em 50%', importancia: 'alta' as const },
      { descricao: 'Organizar finanças e criar controles básicos', importancia: 'alta' as const },
      { descricao: 'Definir processos essenciais do negócio', importancia: 'media' as const }
    ],
    pequena: [
      { descricao: 'Dobrar o faturamento no próximo ano', importancia: 'alta' as const },
      { descricao: 'Contratar e desenvolver equipe-chave', importancia: 'alta' as const },
      { descricao: 'Estruturar marketing digital', importancia: 'media' as const },
      { descricao: 'Implementar sistema de gestão', importancia: 'media' as const }
    ],
    media: [
      { descricao: 'Expandir para novas regiões/mercados', importancia: 'alta' as const },
      { descricao: 'Contratar lideranças para as áreas-chave', importancia: 'alta' as const },
      { descricao: 'Implementar OKRs e gestão por metas', importancia: 'media' as const },
      { descricao: 'Desenvolver marca e posicionamento', importancia: 'media' as const },
      { descricao: 'Estruturar governança corporativa', importancia: 'baixa' as const }
    ],
    grande: [
      { descricao: 'Preparar empresa para rodada de investimento', importancia: 'alta' as const },
      { descricao: 'Expandir operações internacionais', importancia: 'alta' as const },
      { descricao: 'M&A de empresas complementares', importancia: 'media' as const },
      { descricao: 'Implementar programa ESG robusto', importancia: 'media' as const },
      { descricao: 'Desenvolver plano de sucessão', importancia: 'baixa' as const }
    ]
  };

  const alocacaoBySize = {
    micro: [
      { atividade: 'Vendas e atendimento ao cliente', percentual: 50 },
      { atividade: 'Operação e entrega', percentual: 30 },
      { atividade: 'Administrativo e financeiro', percentual: 20 }
    ],
    pequena: [
      { atividade: 'Vendas e relacionamento', percentual: 40 },
      { atividade: 'Gestão da equipe', percentual: 25 },
      { atividade: 'Estratégia e planejamento', percentual: 20 },
      { atividade: 'Administrativo e financeiro', percentual: 15 }
    ],
    media: [
      { atividade: 'Estratégia e planejamento', percentual: 30 },
      { atividade: 'Gestão de pessoas e cultura', percentual: 25 },
      { atividade: 'Vendas e parcerias estratégicas', percentual: 20 },
      { atividade: 'Financeiro e investidores', percentual: 15 },
      { atividade: 'Desenvolvimento pessoal', percentual: 10 }
    ],
    grande: [
      { atividade: 'Estratégia e visão de longo prazo', percentual: 30 },
      { atividade: 'Stakeholders e investidores', percentual: 25 },
      { atividade: 'Cultura e desenvolvimento de líderes', percentual: 20 },
      { atividade: 'Governança e compliance', percentual: 15 },
      { atividade: 'Networking e representação', percentual: 10 }
    ]
  };

  return {
    prioridades: prioridadesBySize[size as keyof typeof prioridadesBySize] || prioridadesBySize.pequena,
    alocacaoTempo: alocacaoBySize[size as keyof typeof alocacaoBySize] || alocacaoBySize.pequena,
    rotinas: [
      { atividade: 'Revisão de indicadores e metas', frequencia: 'Semanal', dia: 'Segunda' },
      { atividade: 'Reunião com equipe/líderes', frequencia: 'Semanal', dia: 'Segunda' },
      { atividade: 'Análise financeira', frequencia: 'Mensal', dia: 'Primeira semana' }
    ],
    delegacoes: [
      { atividade: 'Operações do dia-a-dia', para: 'Gerente/Coordenador' },
      { atividade: 'Atendimento a clientes recorrentes', para: 'Equipe comercial' }
    ],
    focoTrimestre: `Aumentar o faturamento de R$ ${(faturamento / 1000).toFixed(0)}k para R$ ${((faturamento * 1.25) / 1000).toFixed(0)}k através de novas vendas e aumento de ticket médio.`
  };
}

function generateSWOTPessoal(size: string) {
  return {
    forcas: [
      'Conhecimento técnico profundo do negócio',
      'Capacidade de relacionamento e networking',
      'Resiliência e determinação',
      'Visão empreendedora'
    ],
    fraquezas: [
      'Dificuldade de delegar tarefas',
      'Gestão do tempo pode melhorar',
      'Tendência ao perfeccionismo',
      'Pouco tempo para desenvolvimento pessoal'
    ],
    oportunidades: [
      'Participar de grupos de empresários',
      'Investir em capacitação em gestão',
      'Construir marca pessoal no mercado',
      'Desenvolver habilidades de liderança'
    ],
    ameacas: [
      'Risco de burnout por excesso de trabalho',
      'Desequilíbrio entre vida pessoal e profissional',
      'Dependência excessiva do próprio esforço'
    ]
  };
}

function generateDiagnostico(segmento: string, size: string, faturamento: number, colaboradores: number) {
  const segmentoLower = segmento.toLowerCase();
  
  // Gerar níveis aleatórios baseados no tamanho da empresa (com variação)
  const baseLevel = size === 'micro' ? 1 : size === 'pequena' ? 2 : size === 'media' ? 3 : 4;
  const variation = () => Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
  const clampLevel = (level: number) => Math.max(1, Math.min(5, level));
  
  const pessoasLevel = clampLevel(baseLevel + variation());
  const processosLevel = clampLevel(baseLevel + variation());
  const financasLevel = clampLevel(baseLevel + variation());
  const mercadoLevel = clampLevel(baseLevel + variation());
  
  // Notas contextuais baseadas no nível
  const pessoasNotes: Record<number, string[]> = {
    1: [
      'Equipe muito enxuta, proprietário faz múltiplas funções',
      'Sem estrutura formal de RH ou desenvolvimento',
      'Alta dependência do fundador para todas as decisões'
    ],
    2: [
      `Equipe de ${colaboradores} pessoas em formação inicial`,
      'Processos de contratação informais, sem descrição de cargos',
      'Treinamentos acontecem de forma pontual e não estruturada'
    ],
    3: [
      `Time de ${colaboradores} colaboradores com funções definidas`,
      'Início de estruturação de RH e políticas internas',
      'Planos de desenvolvimento individual em fase inicial'
    ],
    4: [
      `Equipe de ${colaboradores} profissionais bem estruturada`,
      'Processos de RH definidos, avaliações periódicas implementadas',
      'Plano de carreira e desenvolvimento contínuo em andamento'
    ],
    5: [
      `Time de alta performance com ${colaboradores} colaboradores`,
      'RH estratégico com programas de retenção e desenvolvimento',
      'Cultura organizacional forte e bem definida'
    ]
  };

  const processosNotes: Record<number, string[]> = {
    1: [
      'Processos totalmente informais e dependentes de pessoas',
      'Sem documentação ou padrões estabelecidos',
      'Retrabalho frequente por falta de processos'
    ],
    2: [
      'Alguns processos-chave identificados mas não documentados',
      'Início de padronização nas atividades principais',
      'Ainda há muita variação na forma de executar tarefas'
    ],
    3: [
      'Processos principais mapeados e em fase de documentação',
      'Indicadores básicos de acompanhamento implementados',
      'Melhoria contínua acontecendo de forma estruturada'
    ],
    4: [
      'Processos bem documentados e seguidos consistentemente',
      'Sistema de gestão com indicadores e metas claras',
      'Ciclos de melhoria contínua funcionando regularmente'
    ],
    5: [
      'Excelência operacional com processos otimizados',
      'Automação e tecnologia integradas aos processos',
      'Benchmarking e inovação contínua em processos'
    ]
  };

  const financasNotes: Record<number, string[]> = {
    1: [
      `Faturamento de R$ ${(faturamento / 1000).toFixed(0)}k/mês sem controle formal`,
      'Mistura entre finanças pessoais e da empresa',
      'Sem fluxo de caixa ou DRE estruturados'
    ],
    2: [
      `Receita de R$ ${(faturamento / 1000).toFixed(0)}k/mês com controles básicos`,
      'Início de separação entre finanças PJ e PF',
      'Fluxo de caixa simples, precisa de mais estrutura'
    ],
    3: [
      `Faturamento de R$ ${(faturamento / 1000).toFixed(0)}k/mês com gestão em evolução`,
      'DRE e balanço básicos, controle de custos implementado',
      'Planejamento financeiro de curto prazo existente'
    ],
    4: [
      `R$ ${(faturamento / 1000).toFixed(0)}k/mês com gestão financeira estruturada`,
      'Indicadores financeiros acompanhados mensalmente',
      'Orçamento anual e planejamento de médio prazo'
    ],
    5: [
      `Faturamento robusto de R$ ${(faturamento / 1000).toFixed(0)}k/mês`,
      'Gestão financeira estratégica com análises avançadas',
      'Planejamento de longo prazo e gestão de investimentos'
    ]
  };

  const mercadoNotes: Record<number, string[]> = {
    1: [
      `Atuando em ${segmentoLower} de forma reativa`,
      'Sem estratégia de marketing definida',
      'Dependência de indicações espontâneas'
    ],
    2: [
      `Posicionamento inicial em ${segmentoLower}`,
      'Marketing básico, principalmente redes sociais',
      'Conhecimento superficial dos concorrentes'
    ],
    3: [
      `Posição em desenvolvimento no mercado de ${segmentoLower}`,
      'Estratégia de marketing em estruturação',
      'ICP definido, análise competitiva em andamento'
    ],
    4: [
      `Boa posição no mercado de ${segmentoLower}`,
      'Marketing estruturado com múltiplos canais',
      'Diferenciação clara e proposta de valor definida'
    ],
    5: [
      `Referência em ${segmentoLower} na região/segmento`,
      'Liderança de mercado com marca forte',
      'Estratégia de expansão e inovação contínua'
    ]
  };

  const randomNote = (notes: string[]) => notes[Math.floor(Math.random() * notes.length)];

  return {
    pessoas: { 
      area: 'Pessoas', 
      level: pessoasLevel, 
      notes: randomNote(pessoasNotes[pessoasLevel]) 
    },
    processos: { 
      area: 'Processos', 
      level: processosLevel, 
      notes: randomNote(processosNotes[processosLevel]) 
    },
    financas: { 
      area: 'Finanças', 
      level: financasLevel, 
      notes: randomNote(financasNotes[financasLevel]) 
    },
    mercado: { 
      area: 'Mercado', 
      level: mercadoLevel, 
      notes: randomNote(mercadoNotes[mercadoLevel]) 
    }
  };
}

export function generateDemoData(params: DemoParams): { project: Omit<Project, 'id' | 'dataCriacao'>, data: ConsultingData } {
  const { segmento, faturamentoMedio, quantidadeColaboradores } = params;
  const size = getCompanySize(quantidadeColaboradores);
  const revenueSize = getRevenueSize(faturamentoMedio);

  const nomeEmpresa = generateCompanyName(segmento);

  const project: Omit<Project, 'id' | 'dataCriacao'> = {
    nomeEmpresa,
    responsavel: 'Empresário Demonstração',
    segmento,
    faturamentoMedio,
    quantidadeColaboradores,
    emailResponsavel: 'contato@empresa.com.br',
    projectType: 'simulation'
  };

  const data: ConsultingData = {
    clienteNome: nomeEmpresa,
    consultorNome: 'Consultor Demo',
    dataInicio: new Date().toISOString().split('T')[0],
    diagnostico: generateDiagnostico(segmento, size, faturamentoMedio, quantidadeColaboradores),
    identidade: generateIdentidade(segmento, size, revenueSize),
    goldenCircle: generateGoldenCircle(segmento, size),
    swot: generateSWOT(segmento, size, quantidadeColaboradores),
    icp: generateICP(segmento, faturamentoMedio, size),
    concorrentes: generateConcorrentes(segmento, size),
    organograma: generateOrganograma(quantidadeColaboradores, size),
    processos: generateProcessos(size, segmento),
    financeiro: generateFinanceiro(faturamentoMedio, quantidadeColaboradores),
    agendaCEO: generateAgendaCEO(size, faturamentoMedio),
    swotPessoal: generateSWOTPessoal(size),
    estrategiasValor: {
      novasOfertas: [
        `Pacote premium de ${segmento.toLowerCase()} com acompanhamento personalizado`,
        'Programa de fidelidade para clientes recorrentes',
        'Consultoria especializada no segmento'
      ],
      novosServicos: [
        'Atendimento VIP com prioridade',
        'Suporte estendido e acompanhamento',
        'Serviços complementares sob demanda'
      ],
      pacotes: [
        { nome: 'Essencial', descricao: 'Ideal para começar: serviço básico com qualidade', preco: `R$ ${Math.round(faturamentoMedio / 400)}/mês` },
        { nome: 'Profissional', descricao: 'Mais completo: inclui suporte e acompanhamento', preco: `R$ ${Math.round(faturamentoMedio / 200)}/mês` },
        { nome: 'Premium', descricao: 'Experiência completa com atendimento VIP', preco: `R$ ${Math.round(faturamentoMedio / 100)}/mês` }
      ]
    },
    precificacao: {
      modelo: 'Baseado em valor entregue',
      estrategia: 'Diferenciação por qualidade e atendimento',
      ancoragem: 'Comparação com custo de não resolver o problema',
      margemDesejada: `${Math.round(40 + (faturamentoMedio / 100000) * 5)}%`,
      produtos: [
        { id: '1', nome: 'Serviço Principal', precoAtual: Math.round(faturamentoMedio / 300), descricao: `Serviço core de ${segmento.toLowerCase()}` },
        { id: '2', nome: 'Serviço Complementar', precoAtual: Math.round(faturamentoMedio / 500), descricao: 'Serviço adicional de valor agregado' }
      ]
    },
    motoresCrescimento: {
      motoresPrincipais: ['Indicação de clientes satisfeitos', 'Marketing digital', 'Parcerias estratégicas'],
      canais: ['Google/SEO', 'Instagram', 'Indicações', 'Parcerias', 'LinkedIn'],
      metricas: [
        { nome: 'Faturamento Mensal', meta: `R$ ${((faturamentoMedio * 1.5) / 1000).toFixed(0)}k até final do ano` },
        { nome: 'Base de Clientes', meta: `${Math.round(quantidadeColaboradores * 30)} clientes ativos` },
        { nome: 'NPS', meta: 'Acima de 70' }
      ]
    }
  };

  return { project, data };
}
