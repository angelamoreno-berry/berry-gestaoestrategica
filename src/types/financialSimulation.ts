// Financial Simulation Types

export interface MaturidadeProcessosData {
  padronizacao: number; // 1-5
  rotinas: number;
  controles: number;
  previsibilidade: number;
  usoDeDados: number;
  notes: string;
  answers?: Record<string, number>;
}

export interface GovernancaFinanceiraData {
  separacaoCpfCnpj: number; // 1-5
  disciplinaGestao: number;
  tomadaDecisao: number;
  proLabore: number;
  planejamentoTributario: number;
  notes: string;
  answers?: Record<string, number>;
}

export interface AnaliseFinanceiraData {
  faturamentoMensal: number;
  despesasFixas: number;
  despesasVariaveis: number;
  lucroLiquido: number;
  margemLiquida: number;
  ticketMedio: number;
  quantidadeClientes: number;
  notes: string;
}

export interface FluxoCaixaData {
  saldoAtual: number;
  entradasPrevistas30d: number;
  saidasPrevistas30d: number;
  entradasPrevistas60d: number;
  saidasPrevistas60d: number;
  entradasPrevistas90d: number;
  saidasPrevistas90d: number;
  notes: string;
}

export interface EstruturaCustosData {
  custosFixos: Array<{ descricao: string; valor: number }>;
  custosVariaveis: Array<{ descricao: string; percentual: number }>;
  pontoEquilibrio: number;
  margemContribuicao: number;
  notes: string;
}

export interface CapitalGiroData {
  prazoMedioRecebimento: number;
  prazoMedioPagamento: number;
  prazoMedioEstoque: number;
  cicloOperacional: number;
  cicloFinanceiro: number;
  necessidadeCapitalGiro: number;
  capitalGiroDisponivel: number;
  notes: string;
}

export interface MargensRentabilidadeData {
  margemBruta: number;
  margemContribuicao: number;
  margemLiquida: number;
  roe: number; // Return on Equity
  roiMedio: number;
  notes: string;
}

export interface IndicadoresKPIsData {
  ebitda: number;
  ebitdaMargin: number;
  geracaoCaixa: number;
  eficienciaOperacional: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  notes: string;
}

export interface RiscoEndividamentoData {
  totalDividas: number;
  parcelasMensais: number;
  comprometimentoReceita: number;
  reservaEmergencia: number;
  mesesReserva: number;
  sensibilidadeQueda10: string; // o que acontece se receita cair 10%
  sensibilidadeQueda20: string;
  capacidadePagamento: string;
  notes: string;
}

export interface CenarioSimulacao {
  nome: string;
  tipo: 'preco' | 'custo' | 'equipe' | 'investimento';
  descricao: string;
  impactoReceita: number;
  impactoCusto: number;
  impactoLucro: number;
}

export interface SimuladorDecisoesData {
  cenarios: CenarioSimulacao[];
  notes: string;
}

export interface ScoreGeralData {
  scoreProcessos: number; // 0-100
  scoreFinanceiro: number; // 0-100
  scoreGeral: number; // 0-100
  classificacao: string; // 'Crítico' | 'Em Desenvolvimento' | 'Estruturado' | 'Otimizado' | 'Excelência'
  recomendacoes: string[];
  notes: string;
}

export interface FinancialSimulationData {
  maturidadeProcessos: MaturidadeProcessosData;
  governancaFinanceira: GovernancaFinanceiraData;
  analiseFinanceira: AnaliseFinanceiraData;
  fluxoCaixa: FluxoCaixaData;
  estruturaCustos: EstruturaCustosData;
  capitalGiro: CapitalGiroData;
  margensRentabilidade: MargensRentabilidadeData;
  indicadoresKPIs: IndicadoresKPIsData;
  riscoEndividamento: RiscoEndividamentoData;
  simuladorDecisoes: SimuladorDecisoesData;
  scoreGeral: ScoreGeralData;
}

export const initialFinancialData: FinancialSimulationData = {
  maturidadeProcessos: { padronizacao: 0, rotinas: 0, controles: 0, previsibilidade: 0, usoDeDados: 0, notes: '' },
  governancaFinanceira: { separacaoCpfCnpj: 0, disciplinaGestao: 0, tomadaDecisao: 0, proLabore: 0, planejamentoTributario: 0, notes: '' },
  analiseFinanceira: { faturamentoMensal: 0, despesasFixas: 0, despesasVariaveis: 0, lucroLiquido: 0, margemLiquida: 0, ticketMedio: 0, quantidadeClientes: 0, notes: '' },
  fluxoCaixa: { saldoAtual: 0, entradasPrevistas30d: 0, saidasPrevistas30d: 0, entradasPrevistas60d: 0, saidasPrevistas60d: 0, entradasPrevistas90d: 0, saidasPrevistas90d: 0, notes: '' },
  estruturaCustos: { custosFixos: [], custosVariaveis: [], pontoEquilibrio: 0, margemContribuicao: 0, notes: '' },
  capitalGiro: { prazoMedioRecebimento: 0, prazoMedioPagamento: 0, prazoMedioEstoque: 0, cicloOperacional: 0, cicloFinanceiro: 0, necessidadeCapitalGiro: 0, capitalGiroDisponivel: 0, notes: '' },
  margensRentabilidade: { margemBruta: 0, margemContribuicao: 0, margemLiquida: 0, roe: 0, roiMedio: 0, notes: '' },
  indicadoresKPIs: { ebitda: 0, ebitdaMargin: 0, geracaoCaixa: 0, eficienciaOperacional: 0, cac: 0, ltv: 0, ltvCacRatio: 0, notes: '' },
  riscoEndividamento: { totalDividas: 0, parcelasMensais: 0, comprometimentoReceita: 0, reservaEmergencia: 0, mesesReserva: 0, sensibilidadeQueda10: '', sensibilidadeQueda20: '', capacidadePagamento: '', notes: '' },
  simuladorDecisoes: { cenarios: [], notes: '' },
  scoreGeral: { scoreProcessos: 0, scoreFinanceiro: 0, scoreGeral: 0, classificacao: '', recomendacoes: [], notes: '' },
};

export const financialBlocks = [
  { id: 'maturidadeProcessos', name: 'Maturidade de Processos', icon: '⚙️', completed: false, progress: 0 },
  { id: 'governancaFinanceira', name: 'Governança Financeira', icon: '🏛️', completed: false, progress: 0 },
  { id: 'analiseFinanceira', name: 'Análise Financeira', icon: '📊', completed: false, progress: 0 },
  { id: 'fluxoCaixa', name: 'Fluxo de Caixa & Projeções', icon: '💧', completed: false, progress: 0 },
  { id: 'estruturaCustos', name: 'Custos & Ponto de Equilíbrio', icon: '⚖️', completed: false, progress: 0 },
  { id: 'capitalGiro', name: 'Capital de Giro & Ciclo', icon: '🔄', completed: false, progress: 0 },
  { id: 'margensRentabilidade', name: 'Margens & Rentabilidade', icon: '📈', completed: false, progress: 0 },
  { id: 'indicadoresKPIs', name: 'Indicadores (KPIs)', icon: '🎯', completed: false, progress: 0 },
  { id: 'riscoEndividamento', name: 'Risco & Endividamento', icon: '⚠️', completed: false, progress: 0 },
  { id: 'simuladorDecisoes', name: 'Simulador de Decisões', icon: '🧪', completed: false, progress: 0 },
  { id: 'scoreGeral', name: 'Score Geral de Maturidade', icon: '🏆', completed: false, progress: 0 },
];
