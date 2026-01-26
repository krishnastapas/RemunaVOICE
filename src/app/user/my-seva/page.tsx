"use client";

import BackPageName from "@/components/BackHeaderButton";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

/* =====================
 TYPES
===================== */

interface Person {
  uid: string;
  name: string;
  completed?: boolean;
  completedAt?: string; // ✅ actual completion time
}

interface Section {
  title: string;
  time?: string; // ✅ FIXED seva time (never changes)
  people?: Person[];
  times?: {
    Morning?: Person[];
    Afternoon?: Person[];
    Evening?: Person[];
  };
}

interface MySevaItem {
  title: string;
  slot?: string;
  sevaTime?: string;        // ✅ scheduled time
  completed: boolean;
  completedAt?: string;    // ✅ actual completed time
  source: "daily" | "morning";
}

/* =====================
 HELPERS
===================== */

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function nowISO() {
  return new Date().toISOString();
}

/* =====================
 PAGE
===================== */

export default function MySevaPage() {
  const { user } = useAuth();

  const [dailySeva, setDailySeva] = useState<MySevaItem[]>([]);
  const [morningSeva, setMorningSeva] = useState<MySevaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadSeva = async () => {
      const date = todayKey();

      /* DAILY SEVA */
      const dailySnap = await getDoc(
        doc(db, "dailySevaBoardAllotments", date)
      );
      if (dailySnap.exists()) {
        setDailySeva(
          extractMySeva(
            dailySnap.data()?.sections ?? [],
            user.uid,
            "daily"
          )
        );
      }

      /* MORNING PROGRAM */
      const morningSnap = await getDoc(
        doc(db, "morningProgramAllotments", date)
      );
      if (morningSnap.exists()) {
        setMorningSeva(
          extractMySeva(
            morningSnap.data()?.sections ?? [],
            user.uid,
            "morning"
          )
        );
      }

      setLoading(false);
    };

    loadSeva();
  }, [user]);

  /* =====================
   MARK COMPLETE (ONLY updates completedAt)
  ===================== */

  const markComplete = async (item: MySevaItem) => {
    if (!user) return;

    const ok = confirm(
      `Mark "${item.title}${item.slot ? ` (${item.slot})` : ""}" as completed?`
    );
    if (!ok) return;

    const ref = doc(
      db,
      item.source === "daily"
        ? "dailySevaBoardAllotments"
        : "morningProgramAllotments",
      todayKey()
    );

    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const sections: Section[] = snap.data()?.sections ?? [];

    sections.forEach((sec) => {
      if (sec.title !== item.title) return;

      /* PEOPLE BASED */
      sec.people?.forEach((p) => {
        if (p.uid === user.uid) {
          p.completed = true;
          p.completedAt = nowISO();
        }
      });

      /* SLOT BASED */
      if (sec.times && item.slot) {
        sec.times[item.slot as keyof typeof sec.times]?.forEach((p) => {
          if (p.uid === user.uid) {
            p.completed = true;
            p.completedAt = nowISO();
          }
        });
      }
    });

    await updateDoc(ref, { sections });

    const updateUI = (list: MySevaItem[]) =>
      list.map((s) =>
        s.title === item.title && s.slot === item.slot
          ? { ...s, completed: true, completedAt: nowISO() }
          : s
      );

    item.source === "daily"
      ? setDailySeva(updateUI)
      : setMorningSeva(updateUI);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-yellow-700 font-semibold">
        Loading your seva...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <BackPageName
        link="/user/dashboard"
        title="My Seva"
        backPageName="Back to Dashboard"
      />

      <SectionBlock
        title="Daily Seva"
        items={dailySeva}
        onComplete={markComplete}
      />

      <SectionBlock
        title="Morning Program Seva"
        items={morningSeva}
        onComplete={markComplete}
      />
    </div>
  );
}

/* =====================
 SAFE EXTRACTOR
===================== */

function extractMySeva(
  sections: Section[],
  uid: string,
  source: "daily" | "morning"
): MySevaItem[] {
  const list: MySevaItem[] = [];

  sections.forEach((sec) => {
    /* MAIN SEVA */
    sec.people?.forEach((p) => {
      if (p.uid === uid) {
        list.push({
          title: sec.title,
          sevaTime: sec.time, // ✅ fixed time
          completed: !!p.completed,
          completedAt: p.completedAt,
          source,
        });
      }
    });

    /* SLOT SEVA */
    if (sec.times) {
      (["Morning", "Afternoon", "Evening"] as const).forEach((slot) => {
        sec.times?.[slot]?.forEach((p) => {
          if (p.uid === uid) {
            list.push({
              title: sec.title,
              slot,
              sevaTime: sec.time, // ✅ still fixed
              completed: !!p.completed,
              completedAt: p.completedAt,
              source,
            });
          }
        });
      });
    }
  });

  return list;
}

/* =====================
 UI BLOCK
===================== */

function SectionBlock({
  title,
  items,
  onComplete,
}: {
  title: string;
  items: MySevaItem[];
  onComplete: (item: MySevaItem) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-yellow-800 mb-2">{title}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
          No seva assigned 🙏
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((s, i) => (
            <div
              key={i}
              className="border border-yellow-300 rounded-lg p-3 bg-yellow-50"
            >
              <p className="font-semibold text-yellow-900">{s.title}</p>

              {s.slot && (
                <p className="text-xs text-gray-600">⏱ {s.slot}</p>
              )}

              {s.sevaTime && (
                <p className="text-xs text-blue-700">
                  🕒 Seva Time: <strong>{s.sevaTime}</strong>
                </p>
              )}

              {/* {s.completedAt && (
                <p className="text-xs text-green-700">
                  ✅ Completed At:{" "}
                  {new Date(s.completedAt).toLocaleTimeString()}
                </p>
              )} */}

              <button
                disabled={s.completed}
                onClick={() => onComplete(s)}
                className={`mt-2 w-full py-1.5 rounded font-semibold text-sm ${
                  s.completed
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : "bg-yellow-700 text-white hover:bg-yellow-800"
                }`}
              >
                {s.completed ? "✅ Completed" : "Mark as Complete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
