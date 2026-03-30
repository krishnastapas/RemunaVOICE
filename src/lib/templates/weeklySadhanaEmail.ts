export function weeklySadhanaEmail({
  from,
  to,
  rows,
}: {
  from: string;
  to: string;
  rows: {
    name: string;
    days: number;
    percent: number;
  }[];
}) {
  return `
  <div style="font-family: Arial, sans-serif">
    <h2>📿 Weekly Sadhana Report</h2>
    <p><strong>Week:</strong> ${from} – ${to}</p>

    <table border="1" cellpadding="6" cellspacing="0" width="100%">
      <tr style="background:#f3f3f3">
        <th>Name</th>
        <th>Days Filled</th>
        <th>%</th>
      </tr>
      ${rows
        .map(
          (r) => `
        <tr>
          <td>${r.name}</td>
          <td>${r.days}</td>
          <td>${r.percent}%</td>
        </tr>`
        )
        .join("")}
    </table>

    <p style="margin-top:16px">
      🙏 This report is auto‑generated every Sunday at 8:00 AM.
    </p>
  </div>
  `;
}
