export interface ExecutiveSummaryData {
  berryScore: number;
  maturity: number;

  strategicPriority: string;
  objective12Months: string;

  risks: string[];
  opportunities: string[];
}

export interface RoadmapItem {
  title: string;
  description: string;

  urgency:
    | "critical"
    | "high"
    | "medium"
    | "evolution"
    | "strategic";

  deadline:
    | "30d"
    | "3m"
    | "6m"
    | "9m"
    | "12m";

  expectedResult: string;

  origin: string;
}

export interface ReportV2Data {
  companyName: string;

  generatedAt: Date;

  executive: ExecutiveSummaryData;

  roadmap: RoadmapItem[];
}
