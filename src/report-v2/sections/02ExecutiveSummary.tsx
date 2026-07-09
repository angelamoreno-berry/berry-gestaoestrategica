import { ExecutiveSummaryData } from "../types";

export default function ExecutiveSummary(
  data: ExecutiveSummaryData
): string {
  return `
    <section id="executive-summary">

      <h2>Resumo Executivo</h2>

      <div class="summary-grid">

        <div class="card">
          <span>Berry Score</span>
          <strong>${data.berryScore}</strong>
        </div>

        <div class="card">
          <span>Maturidade</span>
          <strong>${data.maturity.toFixed(1)}</strong>
        </div>

        <div class="card">
          <span>Prioridade Estratégica</span>
          <strong>${data.strategicPriority}</strong>
        </div>

        <div class="card">
          <span>Objetivo 12 meses</span>
          <strong>${data.objective12Months}</strong>
        </div>

      </div>

    </section>
  `;
}
