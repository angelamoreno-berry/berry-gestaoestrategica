import { ConsultingData } from "@/types/consulting";

export interface ExecutiveMetrics {
  berryScore: number;
  avgMaturity: number;
  strategicPriority: string;
  objective12Months: string;
  risks: string[];
  opportunities: string[];
}

export function getExecutiveMetrics(data: ConsultingData): ExecutiveMetrics {
  const maturities = [
    data.diagnostico.pessoas.level,
    data.diagnostico.processos.level,
    data.diagnostico.financas.level,
    data.diagnostico.mercado.level,
  ];

  const avgMaturity =
    maturities.reduce((sum, value) => sum + value, 0) / maturities.length;

  const berryScore = Math.min(100, Math.round(avgMaturity * 20));

  const dimensions = [
    {
      key: "pessoas",
      level: data.diagnostico.pessoas.level,
    },
    {
      key: "processos",
      level: data.diagnostico.processos.level,
    },
    {
      key: "financas",
      level: data.diagnostico.financas.level,
    },
    {
      key: "mercado",
      level: data.diagnostico.mercado.level,
    },
  ];

  const priority = dimensions.reduce((a, b) =>
    b.level < a.level ? b : a
  );

  const priorityText: Record<string, string> = {
    pessoas: "Profissionalizar a gestão de pessoas",
    processos: "Padronizar e documentar processos",
    financas: "Estruturar a gestão financeira",
    mercado: "Fortalecer o posicionamento de mercado",
  };

  return {
    berryScore,
    avgMaturity,
    strategicPriority: priorityText[priority.key],
    objective12Months:
      data.swot.horizontes?.longo ??
      data.swot.horizontes?.medio ??
      "",
    risks: Array.from({ length: 3 })
  .map((_, i) =>
    data.swot.fraquezas[i] && data.swot.ameacas[i]
      ? `${data.swot.fraquezas[i]} × ${data.swot.ameacas[i]}`
      : null
  )
  .filter((item): item is string => item !== null),

opportunities: Array.from({ length: 3 })
  .map((_, i) =>
    data.swot.forcas[i] && data.swot.oportunidades[i]
      ? `${data.swot.forcas[i]} × ${data.swot.oportunidades[i]}`
      : null
  )
  .filter((item): item is string => item !== null),
  };
}
