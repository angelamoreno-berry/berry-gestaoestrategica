export interface ReportSection {
  id: string;
  title: string;
  enabled: boolean;
}

export const REPORT_STRUCTURE: ReportSection[] = [
  {
    id: "cover",
    title: "Capa",
    enabled: true,
  },
  {
    id: "executive-summary",
    title: "Resumo Executivo",
    enabled: true,
  },
  {
    id: "strategic-diagnosis",
    title: "Diagnóstico Estratégico",
    enabled: true,
  },
  {
    id: "roadmap",
    title: "Roadmap Executivo",
    enabled: true,
  },
  {
    id: "chapters",
    title: "Capítulos",
    enabled: true,
  },
  {
    id: "next-steps",
    title: "Próximos Passos",
    enabled: true,
  },
];
