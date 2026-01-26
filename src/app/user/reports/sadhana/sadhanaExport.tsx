import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =====================
 CONFIG
===================== */

const SOUL_KEYS = [
  { key: "japaBefore10", label: "Japa", marks: 2 },
  { key: "personalHearing1hr", label: "Hearing", marks: 1 },
  { key: "spBookReading1hr", label: "SP Reading", marks: 1 },
  { key: "bookReadingAttended", label: "Book Class", marks: 1 },
  { key: "slokaLearnt", label: "Sloka", marks: 1 },
];

const BODY_KEYS = [
  { key: "dayRestBelow30", label: "Day Rest", marks: 1 },
  { key: "sleptBeforeTime", label: "Sleep", marks: 1 },
  { key: "wakeUpBeforeTime", label: "Wake Up", marks: 1 },
  { key: "studyOrPreaching1hr", label: "Study / Preach", marks: 1 },
];

const DAILY_TOTAL = 10;

/* =====================
 HELPERS
===================== */

function percent(v: number, t: number) {
  return t === 0 ? 0 : Math.round((v / t) * 100);
}

function bgColor(p: number) {
  if (p >= 90) return "90EE90";
  if (p >= 60) return "FFD966";
  if (p >= 40) return "F4B084";
  return "FF6B6B";
}

/* =====================
 EXCEL EXPORT
===================== */

export function exportSadhanaExcel(
  devotees: any[],
  records: any[],
  mode: string
) {
  const rows: any[] = [];

  const eligible = devotees.filter((d) => d.features?.sadhana);

  eligible.forEach((d) => {
    const userRecords = records.filter((r) => r.userId === d.id);

    let total = 0;

    const row: any = {
      Name: `${d.firstName} ${d.lastName ?? ""} Pr`,
    };

    [...SOUL_KEYS, ...BODY_KEYS].forEach((k) => {
      const score = userRecords.reduce(
        (s, r) => s + (r[k.key] === 1 ? k.marks : 0),
        0
      );
      row[k.label] = score;
      total += score;
    });

    row.Total = total;
    row.Percentage = percent(total, records.length * DAILY_TOTAL);

    rows.push(row);
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  Object.keys(ws).forEach((cell) => {
    if (cell.startsWith("!")) return;
    const v = ws[cell].v;
    if (typeof v === "number") {
      ws[cell].s = {
        fill: {
          fgColor: { rgb: bgColor(v) },
        },
      };
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sadhana");

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([buf], { type: "application/octet-stream" }),
    `Sadhana-${mode}.xlsx`
  );
}

/* =====================
 PDF EXPORT
===================== */

export function exportSadhanaPDF(
  devotees: any[],
  records: any[],
  mode: string
) {
  const doc = new jsPDF("landscape");

  const eligible = devotees.filter((d) => d.features?.sadhana);

  const head = [
    "Name",
    ...SOUL_KEYS.map((k) => k.label),
    ...BODY_KEYS.map((k) => k.label),
    "Total",
    "%",
  ];

  const body = eligible.map((d) => {
    const userRecords = records.filter((r) => r.userId === d.id);
    let total = 0;

    const row = [
      `${d.firstName} ${d.lastName ?? ""} Pr`,
    ];

    [...SOUL_KEYS, ...BODY_KEYS].forEach((k) => {
      const score = userRecords.reduce(
        (s, r) => s + (r[k.key] === 1 ? k.marks : 0),
        0
      );
      total += score;
      row.push(score);
    });

    const pct = percent(total, records.length * DAILY_TOTAL);
    row.push(total);
    row.push(`${pct}%`);

    return row;
  });

  autoTable(doc, {
    head: [head],
    body,
    styles: { fontSize: 8 },
    theme: "grid",
  });

  doc.save(`Sadhana-${mode}.pdf`);
}
