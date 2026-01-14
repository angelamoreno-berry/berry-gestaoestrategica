import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProjectInfo {
  segmento: string;
  nomeEmpresa: string;
  faturamentoMedio: number;
  quantidadeColaboradores: number;
}

interface GenerateRequest {
  blockId: string;
  project: ProjectInfo;
}

function getCompanySize(colaboradores: number): string {
  if (colaboradores <= 5) return 'microempresa (até 5 funcionários)';
  if (colaboradores <= 19) return 'pequena empresa (6-19 funcionários)';
  if (colaboradores <= 99) return 'média empresa (20-99 funcionários)';
  return 'grande empresa (100+ funcionários)';
}

function getRevenueRange(faturamento: number): string {
  if (faturamento <= 30000) return 'faturamento inicial (até R$30k/mês)';
  if (faturamento <= 100000) return 'faturamento em crescimento (R$30k-100k/mês)';
  if (faturamento <= 500000) return 'faturamento consolidado (R$100k-500k/mês)';
  return 'alto faturamento (acima de R$500k/mês)';
}

function getBlockPrompt(blockId: string, project: ProjectInfo): string {
  const { segmento, nomeEmpresa, faturamentoMedio, quantidadeColaboradores } = project;
  const companySize = getCompanySize(quantidadeColaboradores);
  const revenueRange = getRevenueRange(faturamentoMedio);

  const baseContext = `
Você é um consultor estratégico experiente ajudando a empresa "${nomeEmpresa}".
Contexto da empresa:
- Segmento: ${segmento}
- Porte: ${companySize}
- ${revenueRange}
- ${quantidadeColaboradores} colaboradores

IMPORTANTE: Gere conteúdo específico e relevante para o segmento "${segmento}". 
Use exemplos, termos e métricas típicas deste setor.
Evite respostas genéricas - seja específico para o nicho.
`;

  const prompts: Record<string, string> = {
    goldenCircle: `${baseContext}
Gere o Golden Circle (baseado em Simon Sinek) específico para uma empresa de ${segmento}.

Retorne um JSON com:
{
  "why": "O propósito profundo da empresa - por que ela existe? Qual é a crença ou causa que move a empresa? (2-3 frases inspiradoras e específicas para ${segmento})",
  "how": "Como a empresa entrega valor de forma única? Qual é a metodologia, abordagem ou diferencial? (2-3 frases específicas para ${segmento})",
  "what": "O que a empresa entrega concretamente? Quais produtos e serviços? (lista de 3-5 itens típicos de ${segmento})"
}`,

    identidade: `${baseContext}
Gere os pilares de identidade organizacional específicos para uma empresa de ${segmento}.

Retorne um JSON com:
{
  "visao": "Onde a empresa quer chegar em 5-10 anos? Meta inspiradora e ambiciosa específica para ${segmento} (1-2 frases)",
  "missao": "Qual é o propósito diário da empresa? O que ela faz e para quem? (1-2 frases específicas para ${segmento})",
  "valores": ["5-7 valores fundamentais relevantes para ${segmento}"],
  "posicionamento": "Como a empresa quer ser percebida no mercado de ${segmento}? Qual é sua promessa única? (2-3 frases)"
}`,

    swot: `${baseContext}
Gere uma análise SWOT realista e específica para uma empresa de ${segmento} com ${quantidadeColaboradores} funcionários.

Retorne um JSON com:
{
  "forcas": ["4-5 forças típicas de uma empresa de ${segmento} deste porte"],
  "fraquezas": ["4-5 fraquezas comuns em empresas de ${segmento} deste tamanho"],
  "oportunidades": ["4-5 oportunidades de mercado atuais para ${segmento}"],
  "ameacas": ["4-5 ameaças do mercado de ${segmento}"],
  "horizontes": {
    "curto": "Meta para 6-12 meses específica para ${segmento} (1 frase)",
    "medio": "Meta para 2-3 anos específica para ${segmento} (1 frase)",
    "longo": "Meta para 5+ anos específica para ${segmento} (1 frase)"
  }
}`,

    diagnostico: `${baseContext}
Gere um diagnóstico de maturidade realista para uma empresa de ${segmento} com ${quantidadeColaboradores} funcionários e faturamento de R$${faturamentoMedio.toLocaleString('pt-BR')}/mês.

Retorne um JSON com:
{
  "pessoas": {
    "level": (número de 1 a 5 baseado no porte),
    "notes": "Descrição do estado atual da área de pessoas em uma empresa de ${segmento} deste porte"
  },
  "processos": {
    "level": (número de 1 a 5 baseado no porte),
    "notes": "Descrição do estado atual dos processos em uma empresa de ${segmento} deste porte"
  },
  "financas": {
    "level": (número de 1 a 5 baseado no porte),
    "notes": "Descrição do estado atual das finanças considerando o faturamento de R$${faturamentoMedio.toLocaleString('pt-BR')}/mês"
  },
  "mercado": {
    "level": (número de 1 a 5 baseado no porte),
    "notes": "Descrição do posicionamento atual no mercado de ${segmento}"
  }
}`,

    concorrentes: `${baseContext}
Gere uma análise de mercado e concorrência específica para ${segmento}.

Retorne um JSON com:
{
  "concorrentes": [
    {"nome": "Tipo de concorrente 1 em ${segmento}", "pontoForte": "Força típica", "pontoFraco": "Fraqueza típica"},
    {"nome": "Tipo de concorrente 2 em ${segmento}", "pontoForte": "Força típica", "pontoFraco": "Fraqueza típica"},
    {"nome": "Tipo de concorrente 3 em ${segmento}", "pontoForte": "Força típica", "pontoFraco": "Fraqueza típica"}
  ],
  "diferenciais": ["5-6 diferenciais competitivos relevantes para ${segmento}"],
  "publicoAlvo": "Descrição detalhada do público-alvo típico de ${segmento} (2-3 frases)",
  "propostaValor": "Proposta de valor única e específica para ${segmento} (2-3 frases)"
}`,

    icp: `${baseContext}
Gere o Perfil de Cliente Ideal (ICP) específico para uma empresa de ${segmento}.

Retorne um JSON com:
{
  "caracteristicasDemograficas": "Perfil demográfico detalhado do cliente ideal de ${segmento}: idade, gênero, localização, renda, profissão ou porte de empresa (3-4 frases)",
  "descricao": "Descrição psicográfica: como esse cliente pensa, o que valoriza, como toma decisões (2-3 frases)",
  "segmentos": ["3-4 segmentos ou nichos dentro do público de ${segmento}"],
  "dores": ["5-6 dores e problemas específicos do cliente de ${segmento}"],
  "desejos": ["5-6 desejos e aspirações do cliente de ${segmento}"],
  "necessidades": ["4-5 necessidades funcionais do cliente de ${segmento}"],
  "comportamento": "Como o cliente de ${segmento} pesquisa, compara e decide (2-3 frases)",
  "ondeEncontrar": "Onde encontrar clientes de ${segmento}: canais, redes, eventos, comunidades (lista)"
}`,

    estrategiasValor: `${baseContext}
Gere estratégias de valor agregado específicas para ${segmento}.

Retorne um JSON com:
{
  "novasOfertas": ["5-6 novas ofertas ou produtos que uma empresa de ${segmento} pode criar"],
  "novosServicos": ["5-6 novos serviços que agregam valor em ${segmento}"],
  "pacotes": [
    {"nome": "Nome do pacote básico", "descricao": "Descrição para ${segmento}", "preco": "Faixa de preço sugerida"},
    {"nome": "Nome do pacote intermediário", "descricao": "Descrição para ${segmento}", "preco": "Faixa de preço sugerida"},
    {"nome": "Nome do pacote premium", "descricao": "Descrição para ${segmento}", "preco": "Faixa de preço sugerida"}
  ]
}`,

    precificacao: `${baseContext}
Gere estratégias de precificação específicas para ${segmento}.

Retorne um JSON com:
{
  "modelo": "Modelo de precificação recomendado para ${segmento} (ex: por projeto, hora, resultado, assinatura)",
  "estrategia": "Estratégia de precificação para ${segmento} (2-3 frases)",
  "ancoragem": "Técnica de ancoragem específica para ${segmento}",
  "margemDesejada": "Margem típica saudável para ${segmento}",
  "produtos": [
    {"id": "1", "nome": "Produto/Serviço principal de ${segmento}", "precoSugerido": valor numérico, "descricao": "Descrição"},
    {"id": "2", "nome": "Produto/Serviço complementar de ${segmento}", "precoSugerido": valor numérico, "descricao": "Descrição"}
  ]
}`,

    motoresCrescimento: `${baseContext}
Gere estratégias de crescimento específicas para ${segmento}.

Retorne um JSON com:
{
  "motoresPrincipais": ["5-6 motores de crescimento mais efetivos para ${segmento}"],
  "canais": ["5-6 canais de aquisição de clientes mais relevantes para ${segmento}"],
  "metricas": [
    {"nome": "Métrica 1 importante para ${segmento}", "meta": "Meta sugerida"},
    {"nome": "Métrica 2 importante para ${segmento}", "meta": "Meta sugerida"},
    {"nome": "Métrica 3 importante para ${segmento}", "meta": "Meta sugerida"}
  ]
}`,

    organograma: `${baseContext}
Gere uma estrutura organizacional ideal para uma empresa de ${segmento} com ${quantidadeColaboradores} funcionários.

Retorne um JSON com:
{
  "cargos": [
    {
      "titulo": "Título do cargo",
      "nivel": 1, 2 ou 3 (1=diretoria, 2=gerência, 3=operacional),
      "responsabilidades": ["3-4 responsabilidades principais"],
      "kpis": ["2-3 KPIs do cargo"],
      "subordinadoA": "Título do cargo superior ou vazio se for o mais alto"
    }
    // Incluir todos os cargos necessários para ${quantidadeColaboradores} funcionários
  ]
}`,

    processos: `${baseContext}
Gere os processos essenciais para uma empresa de ${segmento}.

Retorne um JSON com:
{
  "processos": [
    {
      "nome": "Nome do processo típico de ${segmento}",
      "descricao": "Descrição detalhada do processo",
      "responsavel": "Cargo responsável",
      "frequencia": "Frequência de execução"
    }
    // 5-8 processos essenciais para ${segmento}
  ]
}`,

    financeiro: `${baseContext}
Gere indicadores e metas financeiras para uma empresa de ${segmento} com faturamento de R$${faturamentoMedio.toLocaleString('pt-BR')}/mês.

Retorne um JSON com:
{
  "metaFaturamento": valor numérico (meta de faturamento mensal),
  "margemLucroSugerida": percentual típico para ${segmento},
  "ticketMedioSugerido": valor numérico típico para ${segmento},
  "oportunidades": ["5-6 oportunidades de melhoria financeira para ${segmento}"],
  "investimentos": [
    {"area": "Área de investimento", "valor": valor numérico sugerido, "prazo": "prazo", "prioridade": "Alta/Media/Baixa"}
  ],
  "riscos": ["4-5 riscos financeiros típicos de ${segmento}"]
}`,

    swotPessoal: `${baseContext}
Gere uma análise SWOT pessoal típica para o empreendedor/gestor de uma empresa de ${segmento}.

Retorne um JSON com:
{
  "forcas": ["5-6 forças comuns em empreendedores de ${segmento}"],
  "fraquezas": ["5-6 fraquezas comuns em empreendedores de ${segmento}"],
  "oportunidades": ["5-6 oportunidades de desenvolvimento pessoal para quem atua em ${segmento}"],
  "ameacas": ["5-6 ameaças ou desafios pessoais para empreendedores de ${segmento}"]
}`,

    agendaCEO: `${baseContext}
Gere uma agenda estratégica do CEO/proprietário para uma empresa de ${segmento} com ${quantidadeColaboradores} funcionários.

Retorne um JSON com:
{
  "prioridades": [
    {"descricao": "Prioridade específica para ${segmento}", "importancia": "alta/media/baixa"}
    // 4-6 prioridades
  ],
  "alocacaoTempo": [
    {"atividade": "Atividade relevante para ${segmento}", "percentual": número de 5 a 40}
    // 4-6 atividades que somem 100%
  ],
  "rotinas": [
    {"atividade": "Rotina importante para ${segmento}", "frequencia": "Diária/Semanal/Mensal", "dia": "dia da semana ou período"}
  ],
  "delegacoes": [
    {"atividade": "O que delegar em ${segmento}", "para": "Para quem delegar"}
  ],
  "focoTrimestre": "Foco principal do próximo trimestre para uma empresa de ${segmento} deste porte (2-3 frases)"
}`
  };

  return prompts[blockId] || prompts.goldenCircle;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blockId, project } = await req.json() as GenerateRequest;

    if (!blockId || !project?.segmento) {
      return new Response(
        JSON.stringify({ error: 'blockId e project.segmento são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = getBlockPrompt(blockId, project);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `Você é um consultor estratégico experiente especializado em ${project.segmento}. 
Sempre responda em português do Brasil.
Retorne APENAS JSON válido, sem markdown, sem explicações, sem código de formatação.
O JSON deve estar pronto para ser parseado diretamente.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI Gateway error:', error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    // Parse to validate it's valid JSON
    const parsedContent = JSON.parse(cleanContent);

    return new Response(
      JSON.stringify({ success: true, data: parsedContent, blockId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error generating content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar conteúdo';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
