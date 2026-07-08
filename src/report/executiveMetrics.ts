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
  return {
  berryScore: 0,
  avgMaturity: 0,
  strategicPriority: "",
  objective12Months: "",
  risks: [],
  opportunities: [],
};
}
