import { ExecutiveSummaryData } from "../types";

export default function ExecutiveSummary(data: ExecutiveSummaryData): string {
  return `
    <section class="executive-summary">

      <h1>Resumo Executivo</h1>

      <div class="summary-grid">

        <div class="metric-card">
          <h3>Berry Score</h3>
          <p>${data.berryScore}</p>
        </div>

        <div class="metric-card">
          <h3>Maturidade</h3>
          <p>${data.maturity.toFixed(1)}</p>
        </div>

        <div class="metric-card">
          <h3>Prioridade Estratégica</h3>
          <p>${data.strategicPriority}</p>
        </div>

        <div class="metric-card">
          <h3>Objetivo 12 meses</h3>
          <p>${data.objective12Months}</p>
        </div>

      </div>

      <h2>Principais Riscos</h2>

      <ul>
        ${data.risks.map(risk => `<li>${risk}</li>`).join("")}
      </ul>

      <h2>Principais Oportunidades</h2>

      <ul>
        ${data.opportunities.map(item => `<li>${item}</li>`).join("")}
      </ul>

    </section>
  `;
}
