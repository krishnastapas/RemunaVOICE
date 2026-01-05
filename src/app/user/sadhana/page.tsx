"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// ---------- TYPES ----------
type YesNo = 0 | 1;

interface SadhanaForm {
    // Soul
    japaBefore10: YesNo;
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
            <span className="text-sm">{label}</span>
            {children}
        </div>
    );
}

// ---------- PAGE ----------
export default function SadhanaPage() {
    const { user, loading: authLoading } = useAuth();

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [form, setForm] = useState<SadhanaForm>(defaultForm);
    const [saving, setSaving] = useState(false);
    const [dateLoading, setDateLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (authLoading) {
        return <div className="pt-32 text-center">Loading...</div>;
    }

    if (!user) {
        return <div className="pt-32 text-center">Please login</div>;
    }

    const docId = `${user.uid}_${date}`;

    // ---------- LOAD ON DATE CHANGE ----------
    useEffect(() => {
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
    }, [docId]);

    // ---------- SAVE ----------
    const saveSadhana = async () => {
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

    const update = (key: keyof SadhanaForm, value: YesNo) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const disabled = saving || dateLoading;

    // ---------- UI ----------
    return (
        <div className="pt-[110px] pb-[90px] px-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-center mb-4">
                🧘 Sadhana Card
            </h1>

            {/* DATE */}
            <div className="relative mb-4">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    disabled={dateLoading}
                />

                {dateLoading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-medium">
                        Loading data…
                    </div>
                )}
            </div>

            {/* SOUL */}
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                🟡 Soul
            </h2>

            <Row label="Japa completed before 10 AM">
                <YesNoToggle value={form.japaBefore10} onChange={(v) => update("japaBefore10", v)} />
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

            <Row label="slept 
(working<10:00PM
Student<9:45PM)">
                <YesNoToggle value={form.sleptBeforeTime} onChange={(v) => update("sleptBeforeTime", v)} />
            </Row>

            <Row label=" Wake up
(working<4:00AM
Student<3:45AM)">
                <YesNoToggle value={form.wakeUpBeforeTime} onChange={(v) => update("wakeUpBeforeTime", v)} />
            </Row>

            <Row label="Students(Study) and
Working (Preaching) >1hr">
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
                <p className="text-center mt-3 font-medium">{message}</p>
            )}
        </div>
    );
}
