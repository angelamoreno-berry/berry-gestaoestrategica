import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';

interface HelpTooltipProps {
  fieldKey: string;
  blockId: string;
  className?: string;
}

type PorteEmpresa = 'micro' | 'pequena' | 'media' | 'grande';

const getPorteEmpresa = (faturamento: number, colaboradores: number): PorteEmpresa => {
  if (faturamento <= 30000 || colaboradores <= 5) return 'micro';
  if (faturamento <= 100000 || colaboradores <= 20) return 'pequena';
  if (faturamento <= 500000 || colaboradores <= 100) return 'media';
  return 'grande';
};

interface HelpContent {
  orientacao: string;
  exemplo: string;
}

const getHelpContent = (
  blockId: string,
  fieldKey: string,
  segmento: string,
  porte: PorteEmpresa
): HelpContent => {
  const segmentoLower = segmento.toLowerCase();
  
  // Base de conhecimento contextual
  const helpDatabase: Record<string, Record<string, (seg: string, porte: PorteEmpresa) => HelpContent>> = {
    diagnostico: {
      pessoas: (seg, porte) => ({
        orientacao: porte === 'micro' 
          ? 'Em empresas menores, foque em definir funções claras mesmo sem cargos formais. O importante é que cada pessoa saiba suas responsabilidades.'
          : porte === 'pequena'
          ? 'Comece a documentar cargos e criar processos de contratação mais estruturados.'
          : 'Invista em desenvolvimento de lideranças e programas de retenção de talentos.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? `Ex: Uma ${porte === 'micro' ? 'startup' : 'empresa'} de ${seg} pode começar com papéis híbridos (dev + suporte) e ir especializando conforme cresce.`
          : seg.includes('varejo') || seg.includes('comercio')
          ? `Ex: No ${seg}, defina claramente funções de atendimento, caixa e reposição, com escalas bem organizadas.`
          : seg.includes('serviço') || seg.includes('consultoria')
          ? `Ex: Em ${seg}, documente as especialidades de cada consultor e crie matriz de competências.`
          : `Ex: Para ${seg}, mapeie as funções essenciais e quem as executa atualmente.`
      }),
      processos: (seg, porte) => ({
        orientacao: porte === 'micro'
          ? 'Documente apenas os processos mais críticos. Use ferramentas simples como checklists.'
          : porte === 'pequena'
          ? 'Padronize os processos principais e comece a usar ferramentas de gestão.'
          : 'Implemente sistemas integrados e busque automações.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? `Ex: Documente o processo de desenvolvimento (sprints, code review, deploy) usando ferramentas como Jira ou Trello.`
          : seg.includes('varejo') || seg.includes('comercio')
          ? `Ex: Crie SOPs para abertura/fechamento de loja, recebimento de mercadorias e atendimento ao cliente.`
          : seg.includes('aliment') || seg.includes('restaurante')
          ? `Ex: Documente fichas técnicas, processos de higienização e controle de estoque.`
          : `Ex: Para ${seg}, comece mapeando o fluxo principal de entrega do seu serviço/produto.`
      }),
      financas: (seg, porte) => ({
        orientacao: porte === 'micro'
          ? 'Priorize separar finanças pessoais das empresariais e controlar fluxo de caixa básico.'
          : porte === 'pequena'
          ? 'Implemente controle de custos por categoria e planejamento financeiro trimestral.'
          : 'Desenvolva análises de rentabilidade por produto/cliente e projeções de cenários.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? `Ex: Controle MRR (receita recorrente mensal), CAC (custo de aquisição) e LTV (valor do cliente).`
          : seg.includes('varejo') || seg.includes('comercio')
          ? `Ex: Monitore margem por categoria de produto, giro de estoque e ticket médio.`
          : seg.includes('serviço') || seg.includes('consultoria')
          ? `Ex: Calcule custo/hora real, rentabilidade por projeto e taxa de utilização da equipe.`
          : `Ex: Para ${seg}, comece separando receitas, custos fixos e variáveis em uma planilha simples.`
      }),
      mercado: (seg, porte) => ({
        orientacao: porte === 'micro'
          ? 'Defina claramente quem é seu cliente ideal. Foque em um nicho específico.'
          : porte === 'pequena'
          ? 'Estruture seu processo comercial e comece a usar CRM para acompanhar vendas.'
          : 'Desenvolva estratégias de marketing integradas e métricas de performance.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? `Ex: Defina se seu ICP são startups, PMEs ou enterprise. Use métricas como MQL, SQL e taxa de conversão.`
          : seg.includes('varejo') || seg.includes('comercio')
          ? `Ex: Analise perfil de clientes por localização, faixa etária e frequência de compra.`
          : seg.includes('serviço') || seg.includes('consultoria')
          ? `Ex: Identifique setores mais rentáveis e crie cases de sucesso para cada segmento atendido.`
          : `Ex: Para ${seg}, liste as 3 características principais do seu melhor cliente.`
      }),
    },
    identidade: {
      visao: (seg, porte) => ({
        orientacao: 'A visão deve ser inspiradora e mostrar onde a empresa quer chegar em 5-10 anos. Deve ser ambiciosa mas alcançável.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Ser a plataforma líder em automação de processos para PMEs na América Latina até 2030."'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "Ser referência em experiência de compra e qualidade de produtos em nossa região."'
          : seg.includes('saúde') || seg.includes('clinica')
          ? 'Ex: "Transformar a saúde preventiva, tornando-a acessível e personalizada para todos."'
          : `Ex: "Ser reconhecida como a melhor empresa de ${seg} do nosso mercado de atuação."`
      }),
      missao: (seg, porte) => ({
        orientacao: 'A missão define o propósito atual da empresa - o que faz, para quem e como gera valor.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Simplificar a gestão de negócios através de tecnologia intuitiva e acessível."'
          : seg.includes('educacao') || seg.includes('escola')
          ? 'Ex: "Desenvolver o potencial de cada aluno através de educação personalizada e inovadora."'
          : seg.includes('aliment') || seg.includes('restaurante')
          ? 'Ex: "Proporcionar experiências gastronômicas memoráveis com ingredientes de qualidade."'
          : `Ex: "Entregar [seu produto/serviço] de excelência que [benefício principal] para [público-alvo]."`
      }),
      valores: (seg, porte) => ({
        orientacao: 'Valores são princípios inegociáveis que guiam decisões e comportamentos na empresa. Escolha 3-5 valores autênticos.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: Inovação, Transparência, Foco no Cliente, Aprendizado Contínuo, Colaboração'
          : seg.includes('saúde') || seg.includes('clinica')
          ? 'Ex: Ética, Humanização, Excelência Técnica, Empatia, Segurança'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Honestidade, Atendimento Excepcional, Qualidade, Compromisso, Respeito'
          : 'Ex: Integridade, Qualidade, Inovação, Respeito, Compromisso com Resultados'
      }),
      posicionamento: (seg, porte) => ({
        orientacao: 'O posicionamento define como você quer ser percebido pelo mercado em relação aos concorrentes.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "A solução mais simples e acessível para pequenas empresas que querem se digitalizar."'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "A loja com o melhor custo-benefício e atendimento personalizado da região."'
          : `Ex: "A empresa de ${seg} que entrega [diferencial principal] com [característica única]."`
      }),
    },
    concorrentes: {
      concorrentes: (seg, porte) => ({
        orientacao: 'Liste seus principais concorrentes diretos e indiretos. Analise pontos fortes e fracos de cada um.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: Liste SaaS similares, consultores que oferecem soluções manuais, e até planilhas como "concorrente".'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Mapeie lojas físicas próximas, e-commerces do segmento e marketplaces.'
          : `Ex: Para ${seg}, identifique quem mais atende seu público-alvo na sua região/mercado.`
      }),
      diferenciais: (seg, porte) => ({
        orientacao: 'Identifique o que torna sua empresa única. O que você faz melhor ou diferente?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Implementação em 24h", "Suporte em português 24/7", "Integração nativa com ERPs brasileiros"'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Metodologia própria comprovada", "Equipe com experiência em grandes empresas", "Garantia de resultados"'
          : `Ex: Para ${seg}: atendimento, qualidade, preço, localização, especialização, velocidade...`
      }),
      publicoAlvo: (seg, porte) => ({
        orientacao: 'Descreva detalhadamente quem são seus clientes ideais.',
        exemplo: porte === 'micro'
          ? `Ex: Para uma ${porte} empresa de ${seg}, foque em um nicho específico que você consegue atender muito bem.`
          : `Ex: "Empresas de ${seg} com faturamento entre X e Y, localizadas em [região], que enfrentam [problema específico]."`
      }),
      propostaValor: (seg, porte) => ({
        orientacao: 'Sua proposta de valor resume por que o cliente deve escolher você.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Reduza 50% do tempo gasto em tarefas manuais com nossa plataforma intuitiva - implementação em 1 dia."'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Aumente seus resultados em até 30% com nossa metodologia testada em +100 empresas."'
          : `Ex: "Para [público], oferecemos [solução] que [benefício principal], diferente de [alternativa]."`
      }),
    },
    icp: {
      caracteristicasDemograficas: (seg, porte) => ({
        orientacao: 'Descreva características objetivas: porte, setor, localização, cargo do decisor (B2B) ou idade, renda, localização (B2C).',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex B2B: "PMEs de 10-50 funcionários, setor de serviços, faturamento R$500k-2M, decisor: diretor de operações"'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex B2C: "Mulheres 25-45 anos, classe B/C, região metropolitana, com interesse em [categoria]"'
          : `Ex: Defina faixa etária, renda, localização e outras características relevantes para ${seg}.`
      }),
      dores: (seg, porte) => ({
        orientacao: 'Liste os principais problemas e frustrações que seu cliente ideal enfrenta.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Perde muito tempo com tarefas manuais", "Não consegue escalar operações", "Falta visibilidade de dados"'
          : seg.includes('saúde') || seg.includes('clinica')
          ? 'Ex: "Demora para conseguir atendimento", "Falta de acompanhamento", "Tratamentos impessoais"'
          : `Ex: Para ${seg}, pense nos problemas que fazem seu cliente procurar uma solução como a sua.`
      }),
      desejos: (seg, porte) => ({
        orientacao: 'O que seu cliente ideal sonha alcançar? Quais são suas aspirações?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Ter mais tempo para estratégia", "Crescer sem aumentar equipe proporcionalmente", "Dados em tempo real"'
          : seg.includes('educacao') || seg.includes('escola')
          ? 'Ex: "Filhos preparados para o mercado", "Desenvolvimento integral", "Ambiente seguro e estimulante"'
          : `Ex: Para ${seg}, liste o estado ideal que seu cliente quer atingir.`
      }),
      comportamento: (seg, porte) => ({
        orientacao: 'Como seu cliente ideal se comporta? Onde busca informações? Como toma decisões?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Pesquisa no Google e YouTube, lê reviews, pede indicação em grupos, testa antes de comprar"'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "Compara preços online, valoriza indicações, influenciado por redes sociais, busca promoções"'
          : `Ex: Descreva a jornada de compra típica do seu cliente em ${seg}.`
      }),
      ondeEncontrar: (seg, porte) => ({
        orientacao: 'Onde você pode encontrar e alcançar seu cliente ideal?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "LinkedIn, eventos de tecnologia, comunidades no Slack/Discord, webinars, Google Ads"'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "Instagram, shopping centers, eventos locais, Google Meu Negócio, influenciadores locais"'
          : `Ex: Para ${seg}, liste canais físicos e digitais onde seu público está presente.`
      }),
    },
    estrategiasValor: {
      novasOfertas: (seg, porte) => ({
        orientacao: 'Pense em produtos ou serviços complementares que você poderia oferecer aos clientes atuais.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Consultoria de implementação", "Treinamento avançado", "Integrações personalizadas", "API para desenvolvedores"'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Mentoria individual", "Workshops in-company", "Diagnóstico expresso", "Acompanhamento recorrente"'
          : `Ex: Para ${seg}, que serviços/produtos adicionais agregariam valor ao que você já oferece?`
      }),
      novosServicos: (seg, porte) => ({
        orientacao: 'Considere serviços que resolvam problemas adjacentes dos seus clientes.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Suporte premium 24/7", "Migração de dados", "Business Intelligence", "Automação de marketing"'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "Personal shopper", "Clube de assinatura", "Entrega expressa", "Customização de produtos"'
          : `Ex: Que serviços você poderia adicionar para resolver mais problemas do seu cliente de ${seg}?`
      }),
      pacotes: (seg, porte) => ({
        orientacao: 'Crie combinações de produtos/serviços que entreguem mais valor e aumentem o ticket médio.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Starter (software), Pro (software + suporte), Enterprise (software + suporte + consultoria)"'
          : seg.includes('saúde') || seg.includes('clinica')
          ? 'Ex: "Check-up básico, Check-up executivo, Programa de acompanhamento anual"'
          : `Ex: Para ${seg}, agrupe ofertas em pacotes Bronze, Prata e Ouro com valores crescentes.`
      }),
    },
    precificacao: {
      modelo: (seg, porte) => ({
        orientacao: 'Escolha como você cobra: por hora, projeto, recorrência, produto ou resultado.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: SaaS geralmente usa recorrência mensal. Consultorias podem cobrar por projeto ou hora.'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: Considere migrar de hora para projeto/pacote para não limitar seu faturamento ao tempo.'
          : `Ex: Para ${seg}, avalie qual modelo seus concorrentes usam e qual faz mais sentido para seu cliente.`
      }),
      estrategia: (seg, porte) => ({
        orientacao: 'Defina se quer entrar com preço baixo (penetração), premium (skimming) ou alinhado ao mercado.',
        exemplo: porte === 'micro'
          ? 'Ex: Empresas novas podem usar penetração para ganhar clientes, mas cuidado para não desvalorizar seu trabalho.'
          : porte === 'pequena'
          ? 'Ex: Considere posicionamento de valor - não o mais barato, mas o melhor custo-benefício.'
          : 'Ex: Com marca estabelecida, você pode praticar premium pricing em segmentos específicos.'
      }),
      ancoragem: (seg, porte) => ({
        orientacao: 'Use referências de preço para mostrar valor. Compare com alternativas ou mostre economia gerada.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Por menos que um funcionário CLT (R$5k), automatize todo seu processo" ou "ROI em 3 meses"'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Investimento de R$X para resultado de R$Y" ou "Equivale a X% do faturamento mensal"'
          : `Ex: Para ${seg}, compare seu preço com o custo de não resolver o problema ou com alternativas inferiores.`
      }),
      margemDesejada: (seg, porte) => ({
        orientacao: 'Defina sua margem de lucro alvo considerando custos, mercado e valor entregue.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: SaaS costuma ter margens de 70-80%. Serviços de consultoria entre 30-50%.'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Varejo trabalha com margens de 30-100% dependendo do produto e posicionamento.'
          : `Ex: Para ${seg}, pesquise margens típicas do setor e defina seu objetivo.`
      }),
    },
    motoresCrescimento: {
      motorPrincipal: (seg, porte) => ({
        orientacao: 'Escolha seu principal motor: Pago (anúncios), Viral (indicações), ou Sticky (retenção).',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: SaaS B2B costuma focar em Sticky (retenção alta). Produtos B2C podem usar Viral.'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: Serviços profissionais crescem muito por indicação (Viral) e relacionamento.'
          : `Ex: Para ${seg} de ${porte} porte, geralmente indicação e conteúdo funcionam melhor que tráfego pago no início.`
      }),
      canais: (seg, porte) => ({
        orientacao: 'Liste os canais de aquisição que você usa ou pretende usar para atrair clientes.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: Google Ads, LinkedIn Ads, Content Marketing, SEO, Parcerias, Eventos, Product-led Growth'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Instagram, Google Meu Negócio, Influenciadores locais, Panfletagem, Parcerias locais'
          : `Ex: Para ${seg}, foque em 2-3 canais principais antes de diversificar.`
      }),
      metricas: (seg, porte) => ({
        orientacao: 'Defina KPIs de crescimento que você vai acompanhar regularmente.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: MRR, Churn Rate, CAC, LTV, NRR, Leads qualificados, Taxa de conversão'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Faturamento, Ticket médio, Frequência de compra, Taxa de retorno, NPS'
          : `Ex: Para ${seg}: Novos clientes/mês, Taxa de conversão, Custo por aquisição, Receita por cliente`
      }),
    },
    organograma: {
      cargos: (seg, porte) => ({
        orientacao: porte === 'micro'
          ? 'Em empresas pequenas, uma pessoa pode ter múltiplas funções. Documente as funções, não necessariamente cargos formais.'
          : 'Defina cargos claros com responsabilidades específicas e linhas de reporte.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? porte === 'micro'
            ? 'Ex: Sócio 1 (Produto + Vendas), Sócio 2 (Desenvolvimento + Suporte), Freelancer (Marketing)'
            : 'Ex: CEO, CTO, Líder de Produto, Desenvolvedores, Customer Success, Marketing'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Proprietário/Gerente, Supervisor, Vendedores, Caixa, Estoquista'
          : `Ex: Para ${seg} de ${porte} porte, comece com as funções essenciais para operação.`
      }),
    },
    processos: {
      processos: (seg, porte) => ({
        orientacao: 'Documente os processos principais que fazem sua empresa funcionar.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: Desenvolvimento (sprint), Deploy, Onboarding de cliente, Suporte, Cobrança, Vendas'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Compras, Recebimento, Precificação, Atendimento, Fechamento de caixa, Inventário'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: Proposta comercial, Kick-off, Execução, Entrega, Follow-up, Cobrança'
          : `Ex: Para ${seg}, mapeie da entrada do cliente/pedido até a entrega final.`
      }),
    },
    financeiro: {
      despesasFixas: (seg, porte) => ({
        orientacao: 'Liste todas as despesas que você paga independente do faturamento.',
        exemplo: `Ex: Aluguel, salários, contador, software, internet, energia, seguros - some todos os custos fixos mensais.`
      }),
      despesasVariaveis: (seg, porte) => ({
        orientacao: 'Custos que variam conforme vendas: comissões, insumos, frete, taxas.',
        exemplo: seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: CMV (custo da mercadoria), comissões de vendedores, taxas de cartão, embalagens'
          : `Ex: Para ${seg}, calcule a média mensal de custos que aumentam com mais vendas.`
      }),
      faturamentoAtual: (seg, porte) => ({
        orientacao: 'Informe a média de faturamento bruto mensal dos últimos 3-6 meses.',
        exemplo: 'Ex: Some todas as receitas mensais e calcule a média. Seja realista para um bom diagnóstico.'
      }),
      margemAtual: (seg, porte) => ({
        orientacao: 'Margem = (Receita - Custos) / Receita. Quanto sobra de cada R$100 faturado?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: SaaS costuma ter 60-80% de margem bruta. Serviços 40-60%.'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: Varejo trabalha com 30-50% de markup. Calcule sua margem real após todos os custos.'
          : 'Ex: Se fatura R$100k e sobram R$30k, sua margem é 30%.'
      }),
      metaFaturamento: (seg, porte) => ({
        orientacao: 'Defina uma meta realista de faturamento para os próximos 12 meses.',
        exemplo: porte === 'micro'
          ? 'Ex: Para empresas iniciantes, crescimento de 50-100% ao ano é agressivo mas possível.'
          : 'Ex: Empresas estabelecidas podem mirar 20-30% de crescimento sustentável.'
      }),
      oportunidades: (seg, porte) => ({
        orientacao: 'Identifique formas de aumentar receita ou reduzir custos.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: Upsell para planos maiores, redução de churn, automação de suporte, expansion revenue'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: Produtização de serviços, aumento de preços, redução de inadimplência, novos serviços'
          : `Ex: Para ${seg}: novos produtos, otimização de custos, aumento de ticket médio, retenção`
      }),
    },
    swot: {
      forcas: (seg, porte) => ({
        orientacao: 'O que sua empresa faz muito bem? Quais são suas vantagens competitivas internas?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Equipe técnica experiente", "Produto intuitivo", "Suporte rápido", "Integrações únicas"'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Metodologia comprovada", "Network forte", "Especialização no setor", "Cases de sucesso"'
          : `Ex: Para ${seg}: experiência, localização, equipe, qualidade, relacionamentos, reputação`
      }),
      fraquezas: (seg, porte) => ({
        orientacao: 'Onde sua empresa precisa melhorar? Quais são as limitações internas?',
        exemplo: porte === 'micro'
          ? 'Ex: "Dependência do fundador", "Falta de processos", "Caixa limitado", "Marca desconhecida"'
          : 'Ex: "Processos não documentados", "Alta rotatividade", "Sistemas desintegrados", "Margem baixa"'
      }),
      oportunidades: (seg, porte) => ({
        orientacao: 'Que tendências ou mudanças externas podem beneficiar seu negócio?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Digitalização de PMEs", "IA generativa", "Trabalho remoto", "Open banking"'
          : seg.includes('saúde') || seg.includes('clinica')
          ? 'Ex: "Telemedicina", "Saúde preventiva", "Envelhecimento da população", "Planos de saúde corporativos"'
          : `Ex: Para ${seg}: tendências do setor, novos mercados, mudanças regulatórias favoráveis`
      }),
      ameacas: (seg, porte) => ({
        orientacao: 'Que fatores externos podem prejudicar seu negócio?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Big techs entrando no mercado", "Mudanças em regulação de dados", "Comoditização"'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "Marketplaces", "Inflação", "Mudança de hábitos de consumo", "Concorrência online"'
          : `Ex: Para ${seg}: novos concorrentes, mudanças econômicas, regulação, tecnologias disruptivas`
      }),
      horizontes: (seg, porte) => ({
        orientacao: 'Defina metas e ações para curto (3 meses), médio (1 ano) e longo prazo (3+ anos).',
        exemplo: porte === 'micro'
          ? 'Ex: Curto: validar produto/mercado. Médio: atingir break-even. Longo: escalar operação.'
          : 'Ex: Curto: otimizar processos. Médio: expandir para novos mercados. Longo: liderança no segmento.'
      }),
    },
    goldenCircle: {
      why: (seg, porte) => ({
        orientacao: 'Por que sua empresa existe? Qual o propósito maior além de ganhar dinheiro?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Acreditamos que toda empresa merece acesso a ferramentas que antes só grandes corporações tinham."'
          : seg.includes('educacao') || seg.includes('escola')
          ? 'Ex: "Acreditamos que educação de qualidade transforma vidas e comunidades."'
          : `Ex: Para ${seg}: "Acreditamos que [crença/causa] e por isso existimos para [impacto]."`
      }),
      how: (seg, porte) => ({
        orientacao: 'Como você entrega seu propósito? Qual sua forma única de fazer as coisas?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Através de tecnologia intuitiva, suporte humanizado e melhoria contínua baseada em feedback."'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Combinando metodologia comprovada, personalização e acompanhamento próximo."'
          : `Ex: "Através de [metodologia/abordagem única] que [diferencial]."`
      }),
      what: (seg, porte) => ({
        orientacao: 'O que você vende? Produtos e serviços concretos.',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Plataforma SaaS de gestão, consultoria de implementação, treinamentos."'
          : seg.includes('varejo') || seg.includes('comercio')
          ? 'Ex: "Produtos [categoria] de alta qualidade, experiência de compra diferenciada."'
          : `Ex: Liste seus principais produtos/serviços de forma clara e objetiva.`
      }),
    },
    swotPessoal: {
      forcas: (seg, porte) => ({
        orientacao: 'Quais são suas forças pessoais como líder/empreendedor?',
        exemplo: 'Ex: "Visão estratégica", "Comunicação", "Resiliência", "Conhecimento técnico", "Networking"'
      }),
      fraquezas: (seg, porte) => ({
        orientacao: 'Em que você precisa se desenvolver ou buscar apoio?',
        exemplo: 'Ex: "Delegação", "Gestão financeira", "Paciência", "Organização", "Gestão de pessoas"'
      }),
      oportunidades: (seg, porte) => ({
        orientacao: 'Que oportunidades de desenvolvimento você pode aproveitar?',
        exemplo: 'Ex: "Mentoria", "MBA", "Networking em eventos", "Desenvolvimento de soft skills"'
      }),
      ameacas: (seg, porte) => ({
        orientacao: 'Que fatores pessoais podem atrapalhar seu sucesso?',
        exemplo: 'Ex: "Burnout", "Falta de equilíbrio trabalho-vida", "Dependência excessiva do negócio"'
      }),
    },
    agendaCEO: {
      prioridades: (seg, porte) => ({
        orientacao: 'Defina as 3-5 prioridades principais que você deve focar como líder.',
        exemplo: porte === 'micro'
          ? 'Ex: "Vendas", "Produto", "Primeiras contratações" - em empresas pequenas, o fundador faz de tudo.'
          : 'Ex: "Estratégia", "Cultura", "Grandes clientes", "Captação" - delegue operação.'
      }),
      alocacaoTempo: (seg, porte) => ({
        orientacao: 'Como você deveria dividir seu tempo entre diferentes atividades?',
        exemplo: porte === 'micro'
          ? 'Ex: 40% vendas, 30% produto/entrega, 20% administrativo, 10% estratégia'
          : 'Ex: 40% estratégia, 30% pessoas, 20% grandes clientes, 10% operações'
      }),
      focoTrimestre: (seg, porte) => ({
        orientacao: 'Qual deve ser O foco principal dos próximos 90 dias?',
        exemplo: seg.includes('tecnologia') || seg.includes('software')
          ? 'Ex: "Atingir product-market fit", "Dobrar MRR", "Estruturar time de vendas"'
          : seg.includes('serviço') || seg.includes('consultoria')
          ? 'Ex: "Fechar 5 novos clientes", "Sistematizar metodologia", "Contratar primeiro funcionário"'
          : `Ex: Para ${seg}: defina 1-3 metas SMART para o trimestre.`
      }),
    },
  };

  // Busca conteúdo específico ou retorna um padrão
  const blockHelp = helpDatabase[blockId];
  if (blockHelp && blockHelp[fieldKey]) {
    return blockHelp[fieldKey](segmento, porte);
  }

  // Conteúdo padrão
  return {
    orientacao: 'Preencha este campo com informações relevantes sobre sua empresa.',
    exemplo: `Ex: Considere as características específicas do segmento de ${segmento} e o porte da sua empresa.`
  };
};

export function HelpTooltip({ fieldKey, blockId, className = '' }: HelpTooltipProps) {
  const { currentProject } = useConsulting();
  
  const segmento = currentProject?.segmento || 'serviços';
  const faturamento = currentProject?.faturamentoMedio || 0;
  const colaboradores = currentProject?.quantidadeColaboradores || 1;
  
  const porte = getPorteEmpresa(faturamento, colaboradores);
  const content = getHelpContent(blockId, fieldKey, segmento, porte);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors ${className}`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-sm p-4 space-y-2"
          sideOffset={8}
        >
          <p className="text-sm font-medium text-foreground">{content.orientacao}</p>
          <p className="text-xs text-muted-foreground italic">{content.exemplo}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
