"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import BackHeader from "@/components/BackHeader";
import { useRouter } from "next/navigation";
// ---------- TYPES ----------
type YesNo = 0 | 1;

// 🔴 ONLY CHANGE: Japa is now 0 | 1 | 2
type JapaTime = 0 | 1 | 2;
/*
0 = No
1 = Before 10 AM
2 = Before 1 AM
*/

interface SadhanaForm {
  // Soul
  japaBefore10: JapaTime;
  personalHearing1hr: YesNo;
  spBookReading1hr: YesNo;
  bookReadingAttended: YesNo;
  slokaLearnt: YesNo;

  // Body
  dayRestBelow30: YesNo;
  sleptBeforeTime: YesNo;
  wakeUpBeforeTime: YesNo;
  studyOrPreaching1hr: YesNo;
}

// ---------- DEFAULT ----------
const defaultForm: SadhanaForm = {
  japaBefore10: 0,
  personalHearing1hr: 0,
  spBookReading1hr: 0,
  bookReadingAttended: 0,
  slokaLearnt: 0,

  dayRestBelow30: 0,
  sleptBeforeTime: 0,
  wakeUpBeforeTime: 0,
  studyOrPreaching1hr: 0,
};

// ---------- YES / NO ----------
function YesNoToggle({
  value,
  onChange,
  disabled,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(0)}
        className={`px-3 py-1 rounded text-sm font-semibold ${value === 0 ? "bg-red-600 text-white" : "bg-gray-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        No
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(1)}
        className={`px-3 py-1 rounded text-sm font-semibold ${value === 1 ? "bg-green-600 text-white" : "bg-gray-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Yes
      </button>
    </div>
  );
}

// ---------- JAPA TOGGLE (ONLY NEW COMPONENT) ----------
function JapaToggle({
  value,
  onChange,
  disabled,
}: {
  value: JapaTime;
  onChange: (v: JapaTime) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(1)}
        className={`px-3 py-1 rounded text-sm font-semibold ${value === 1 ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
      >
        Before 10 AM
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(2)}
        className={`px-3 py-1 rounded text-sm font-semibold ${value === 2 ? "bg-yellow-600 text-white" : "bg-gray-200"
          }`}
      >
        Before 1 PM
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(0)}
        className={`px-3 py-1 rounded text-sm font-semibold ${value === 0 ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
      >
        No
      </button>
    </div>
  );
}

// ---------- ROW ----------
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center border-b py-2 gap-4">
      <span className="text-sm whitespace-pre-line">{label}</span>
      {children}
    </div>
  );
}

// ---------- PAGE ----------
export default function SadhanaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [form, setForm] = useState<SadhanaForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [dateLoading, setDateLoading] = useState(false);
  const [message, setMessage] = useState("");

  const docId = user ? `${user.uid}_${date}` : null;

  // ---------- LOAD ----------
  useEffect(() => {
    if (!user || !docId) return;

    let active = true;

    const loadData = async () => {
      setDateLoading(true);
      setMessage("");

      try {
        const ref = doc(db, "sadhana_cards", docId);
        const snap = await getDoc(ref);

        if (!active) return;

        if (snap.exists()) {
          setForm(snap.data() as SadhanaForm);
        } else {
          setForm(defaultForm);
        }
      } finally {
        if (active) setDateLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [docId, user]);

  // ---------- SAVE ----------
  const saveSadhana = async () => {
    if (!user || !docId) return;

    setSaving(true);
    setMessage("");

    try {
      await setDoc(
        doc(db, "sadhana_cards", docId),
        {
          userId: user.uid,
          date,
          ...form,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("✅ Sadhana saved successfully");
    } catch {
      setMessage("❌ Failed to save sadhana");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SadhanaForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const disabled = saving || dateLoading;

  if (authLoading) return <div className="pt-32 text-center">Loading...</div>;
  if (!user) return <div className="pt-32 text-center">Please login</div>;
  return (
    <div>
      <BackHeader title="Sadhana" />
      <div className="pt-[10px] pb-[90px] px-4 max-w-md mx-auto">

        <div>
          <h1 className="text-xl font-bold text-center mb-4">
            🧘 Sadhana Card
          </h1>
          <button
            onClick={() => router.push("/user/sadhana-analysis")}
            className="absolute mt-5 right-4 top-0 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow"
          >
            📊 Analysis
          </button>

        </div>

        {/* DATE */}
        <div className="relative mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={dateLoading}
          />
        </div>


        {/* SOUL */}
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          🟡 Soul
        </h2>

        {/* 🔴 ONLY THIS ROW CHANGED */}
        <Row label="Japa completed">
          <JapaToggle
            value={form.japaBefore10}
            onChange={(v) => update("japaBefore10", v)}
          />
        </Row>

        <Row label="Personal hearing > 1 hour per day">
          <YesNoToggle value={form.personalHearing1hr} onChange={(v) => update("personalHearing1hr", v)} />
        </Row>

        <Row label="Read SP book > 1 hour">
          <YesNoToggle value={form.spBookReading1hr} onChange={(v) => update("spBookReading1hr", v)} />
        </Row>

        <Row label="Book reading class attended">
          <YesNoToggle value={form.bookReadingAttended} onChange={(v) => update("bookReadingAttended", v)} />
        </Row>

        <Row label="Sloka learnt">
          <YesNoToggle value={form.slokaLearnt} onChange={(v) => update("slokaLearnt", v)} />
        </Row>

        {/* BODY */}
        <h2 className="text-lg font-semibold text-green-800 mt-6 mb-2">
          🟢 Body
        </h2>

        <Row label="Day rest < 30 minutes">
          <YesNoToggle value={form.dayRestBelow30} onChange={(v) => update("dayRestBelow30", v)} />
        </Row>

        <Row label={`Slept before time\n(Working < 10:00 PM\nStudent < 9:45 PM)`}>
          <YesNoToggle value={form.sleptBeforeTime} onChange={(v) => update("sleptBeforeTime", v)} />
        </Row>

        <Row label={`Wake up before time\n(Working < 4:00 AM\nStudent < 3:45 AM)`}>
          <YesNoToggle value={form.wakeUpBeforeTime} onChange={(v) => update("wakeUpBeforeTime", v)} />
        </Row>

        <Row label={`Students (Study) /\nWorking (Preaching) > 1 hr`}>
          <YesNoToggle value={form.studyOrPreaching1hr} onChange={(v) => update("studyOrPreaching1hr", v)} />
        </Row>

        <button
          onClick={saveSadhana}
          disabled={disabled}
          className={`w-full mt-6 py-2 rounded text-white ${disabled ? "bg-gray-400" : "bg-yellow-700"
            }`}
        >
          {saving ? "Saving..." : "Save Sadhana"}
        </button>

        {message && (
          <p className="text-center mt-3 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
