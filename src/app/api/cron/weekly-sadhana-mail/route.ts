import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getLastWeekRange, ymd } from "@/utils/week";
import { sendMail } from "@/lib/mailer";
import { weeklySadhanaEmail } from "@/lib/templates/weeklySadhanaEmail";

export async function GET() {
  const { start, end } = getLastWeekRange();

  /* =========================
     FETCH DEVOTEES (ADMIN SDK)
     ========================= */

  const devoteesSnap = await db.collection("devotees").get();
  const devotees = devoteesSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (d: any) => d.features?.sadhana === true && d.email
    );

  /* =========================
     FETCH SADHANA RECORDS
     ========================= */

  const recordsSnap = await db.collection("sadhana_cards").get();
  const records = recordsSnap.docs.map((d) => d.data());

  /* =========================
     BUILD WEEKLY REPORT
     ========================= */

  const rows = devotees.map((d: any) => {
    const userRecords = records.filter(
      (r: any) =>
        r.userId === d.id &&
        new Date(r.date) >= start &&
        new Date(r.date) <= end
    );

    const days = new Set(userRecords.map((r: any) => r.date)).size;

    // Weekly marks logic (10 marks per day)
    const maxMarks = days * 10;
    const obtainedMarks = userRecords.length * 10;

    const percent =
      maxMarks === 0
        ? 0
        : Math.round((obtainedMarks / maxMarks) * 100);

    return {
      name: `${d.firstName} ${d.lastName ?? ""} Pr`,
      days,
      percent,
    };
  });

  /* =========================
     SEND EMAIL
     ========================= */

  await sendMail({
    to: devotees.map((d: any) => d.email),
    cc: [process.env.ADMIN_EMAIL!],
    subject: "📿 Weekly Sadhana Report",
    html: weeklySadhanaEmail({
      from: ymd(start),
      to: ymd(end),
      rows,
    }),
  });

  return NextResponse.json({
    success: true,
    sentTo: devotees.length,
  });
}
