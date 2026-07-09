import { ReportV2Data } from "./types";

import Cover from "./sections/01Cover";
import ExecutiveSummary from "./sections/02ExecutiveSummary";

export function generateReportV2(
  data: ReportV2Data
): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
<meta charset="UTF-8">
<title>Plano Estratégico</title>
</head>

<body>

${Cover(data)}

${ExecutiveSummary(data.executive)}

</body>

</html>
`;
}
