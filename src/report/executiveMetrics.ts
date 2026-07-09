import { ConsultingData } from "@/types/consulting";

export interface ExecutiveMetrics {
  berryScore: number;
  avgMaturity: number;
  maturityLabel: string;
  maturityBreakdown: string;
  berryScoreInterpretation: string;
  strategicPriority: string;
  objective12Months: string;
  risks: string[];
  opportunities: string[];
  risksDetailed: string[];
  opportunitiesDetailed: string[];
}

function getMaturityLabel(avg: number): string {
  if (avg <= 1) return "Nascente";
  if (avg <= 2) return "Básico";
  if (avg <= 3) return "Estruturado";
  if (avg <= 4) return "Consolidado";
  return "Excelência";
}

function getScoreInterpretation(score: number): string {
  if (score <= 20) return "Empresa em estágio inicial.";
  if (score <= 40) return "Empresa em estruturação.";
  if (score <= 60) return "Empresa em consolidação.";
  if (score <= 80) return "Empresa madura.";
  return "Excelência operacional.";
}

export function getExecutiveMetrics(data: ConsultingData): ExecutiveMetrics {
  const d = data.diagnostico;
  const avgMaturity = (d.pessoas.level + d.processos.level + d.financas.level + d.mercado.level) / 4;
  const berryScore = Math.min(100, Math.round(avgMaturity * 20));
  const dims = [
    { key: "pessoas", level: d.pessoas.level },
    { key: "processos", level: d.processos.level },
    { key: "financas", level: d.financas.level },
    { key: "mercado", level: d.mercado.level },
  ];
  const priority = dims.reduce((a, b) => (b.level < a.level ? b : a));
  const pt: Record<string, string> = {
    pessoas: "Profissionalizar gestão de pessoas",
    processos: "Padronizar processos",
    financas: "Estruturar gestão financeira",
    mercado: "Fortalecer posicionamento de mercado",
  };
  const s = data.swot;
  const rd: string[] = [];
  const od: string[] = [];
  for (let i = 0; i < 3; i++) {
    if (s.fraquezas?.[i] && s.ameacas?.[i]) rd.push(s.fraquezas[i] + " × " + s.ameacas[i]);
    if (s.forcas?.[i] && s.oportunidades?.[i]) od.push(s.forcas[i] + " × " + s.oportunidades[i]);
  }
  return {
    berryScore, avgMaturity,
    maturityLabel: getMaturityLabel(avgMaturity),
    maturityBreakdown: "Pessoas " + d.pessoas.level + " · Processos " + d.processos.level + " · Finanças " + d.financas.level + " · Mercado " + d.mercado.level,
    berryScoreInterpretation: getScoreInterpretation(berryScore),
    strategicPriority: pt[priority.key] || "Estruturar gestão",
    objective12Months: s.horizontes?.longo || s.horizontes?.medio || "",
    risks: rd,
    opportunities: od,
    risksDetailed: rd,
    opportunitiesDetailed: od,
  };
}