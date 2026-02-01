"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BackPageName from "@/components/BackHeaderButton";
import { SadhanaDaily, Devotee } from "./types";
import { calculateWeeklyScore } from "./scoring";

/* ================= UTIL ================= */

function getWeekRange(base: Date) {
  const d = new Date(base);
  const day = d.getDay();

  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function percent(v: number, t: number) {
  return t === 0 ? 0 : Math.round((v / t) * 100);
}

function colorByPercent(p: number) {
  if (p >= 90) return "bg-green-600 text-white";
  if (p >= 60) return "bg-yellow-400 text-black";
  if (p >= 40) return "bg-orange-400 text-black";
  return "bg-red-600 text-white";
}

/* ================= PAGE ================= */

export default function WeeklySadhanaReport() {
  const [records, setRecords] = useState<SadhanaDaily[]>([]);
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [weekDate, setWeekDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const rSnap = await getDocs(
        collection(db, "sadhana_entries")
      );
      setRecords(rSnap.docs.map((d) => d.data() as SadhanaDaily));

      const uSnap = await getDocs(collection(db, "devotees"));
      setDevotees(
        uSnap.docs.map((d) => ({
          id: d.id,
          firstName: d.data().firstName || "Devotee",
          features: d.data().features || {},
        }))
      );

      setLoading(false);
    };

    load();
  }, []);

  const { start, end } = getWeekRange(weekDate);

  const weeklyRecords = records.filter((r) => {
    const d = new Date(r.date);
    return d >= start && d <= end;
  });

  const eligibleDevotees = devotees.filter(
    (d) => d.features?.sadhana
  );

  /* 🔒 FULL WEEK CONSTANTS */
  const FULL_WEEK_DAYS = 7;
  const FULL_SOUL_MAX = 35;
  const FULL_BODY_MAX = 35;
  const FULL_WEEK_TOTAL = 70;

  return (
    <div className="p-4 space-y-4">
      <BackPageName
        title="Weekly Sadhana Report"
        link="/user/sadhana"
      />

      {/* WEEK NAV */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() =>
            setWeekDate(
              new Date(weekDate.getTime() - 7 * 86400000)
            )
          }
          className="border px-3 py-1 rounded"
        >
          ◀ Prev
        </button>

        <span className="font-semibold text-sm">
          {start.toLocaleDateString("en-IN")} –{" "}
          {end.toLocaleDateString("en-IN")}
        </span>

        <button
          onClick={() =>
            setWeekDate(
              new Date(weekDate.getTime() + 7 * 86400000)
            )
          }
          className="border px-3 py-1 rounded"
        >
          Next ▶
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-center">Loading…</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-xs border">
            <thead className="bg-yellow-100">
              <tr>
                <th rowSpan={2} className="border p-2">Name</th>
                <th colSpan={5} className="border p-2 bg-yellow-200">🟡 Soul</th>
                <th colSpan={6} className="border p-2 bg-green-200">🟢 Body</th>
                <th rowSpan={2} className="border p-2 bg-green-300">Total</th>
              </tr>
              <tr>
                <th className="border p-1">Japa</th>
                <th className="border p-1">Hearing</th>
                <th className="border p-1">SP Book</th>
                <th className="border p-1">Sloka</th>
                <th className="border p-1">Soul %</th>

                <th className="border p-1">Class</th>
                <th className="border p-1">Rest</th>
                <th className="border p-1">Sleep</th>
                <th className="border p-1">Wake</th>
                <th className="border p-1">Study</th>
                <th className="border p-1">Body %</th>
              </tr>
            </thead>

            <tbody>
              {eligibleDevotees.map((d) => {
                const userRecords = weeklyRecords.filter(
                  (r) => r.userId === d.id
                );

                const score = calculateWeeklyScore(userRecords);

                const soulMarks =
                  score.japaMarks +
                  score.hearingMarks +
                  score.readingMarks +
                  score.slokaMarks;

                const bodyMarks = score.disciplineMarks;

                const soulPct = percent(soulMarks, FULL_SOUL_MAX);
                const bodyPct = percent(bodyMarks, FULL_BODY_MAX);

                const obtained = soulMarks + bodyMarks;
                const totalPct = percent(obtained, FULL_WEEK_TOTAL);

                return (
                  <tr key={d.id} className="hover:bg-yellow-50">
                    <td className="border p-2 font-semibold">
                      {d.firstName} Pr
                    </td>

                    <td className="border p-2 text-center">
                      {score.japaMarks}/14
                    </td>

                    <td className="border p-2 text-center">
                      {score.hearingMarks}/7 ({score.hearingMin}m)
                    </td>

                    <td className="border p-2 text-center">
                      {score.readingMarks}/7 ({score.readingMin}m)
                    </td>

                    <td className="border p-2 text-center">
                      {score.slokaMarks}/7 ({score.slokaCount})
                    </td>

                    <td
                      className={`border p-2 text-center font-bold ${colorByPercent(
                        soulPct
                      )}`}
                    >
                      {soulPct}%
                    </td>

                    <td className="border p-2 text-center">
                      {userRecords.reduce(
                        (s, r) => s + (r.bookReadingClass ? 1 : 0),
                        0
                      )}/{FULL_WEEK_DAYS}
                    </td>

                    <td className="border p-2 text-center">
                      {userRecords.reduce(
                        (s, r) => s + (r.dayRestBelow30 ? 1 : 0),
                        0
                      )}/{FULL_WEEK_DAYS}
                    </td>

                    <td className="border p-2 text-center">
                      {userRecords.reduce(
                        (s, r) => s + (r.sleptBeforeTime ? 1 : 0),
                        0
                      )}/{FULL_WEEK_DAYS}
                    </td>

                    <td className="border p-2 text-center">
                      {userRecords.reduce(
                        (s, r) => s + (r.wakeUpBeforeTime ? 1 : 0),
                        0
                      )}/{FULL_WEEK_DAYS}
                    </td>

                    <td className="border p-2 text-center">
                      {userRecords.reduce(
                        (s, r) => s + (r.studyOrPreaching1hr ? 1 : 0),
                        0
                      )}/{FULL_WEEK_DAYS}
                    </td>

                    <td
                      className={`border p-2 text-center font-bold ${colorByPercent(
                        bodyPct
                      )}`}
                    >
                      {bodyPct}%
                    </td>

                    <td
                      className={`border p-2 text-center font-bold ${colorByPercent(
                        totalPct
                      )}`}
                    >
                      {obtained}/70 ({totalPct}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
