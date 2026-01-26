"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Select from "react-select";

/* =====================
 TYPES
===================== */

interface DevoteeOption {
  value: string;
  label: string;
}

interface Person {
  uid: string;
  name: string;
  completed: boolean;
}

interface Section {
  title: string;
  type: "people" | "time" | "text";
  people?: Person[];
  value?: string;
}

/* =====================
 MORNING PROGRAM TEMPLATE
===================== */

const MORNING_TEMPLATE: Section[] = [
  { title: "Deity Wake Up", type: "people", people: [] },
  { title: "Temple Hall Mopping", type: "people", people: [] },

  { title: "Wake Up Time", type: "time", value: "" },
  { title: "Mangal Arti Time", type: "time", value: "" },
  { title: "Class Time", type: "time", value: "" },

  { title: "Deity Worship", type: "people", people: [] },
  { title: "Tulsi Worship", type: "people", people: [] },

  { title: "Mangal Arti", type: "people", people: [] },
  { title: "Narashimha Arti", type: "people", people: [] },
  { title: "Tulsi Pranam", type: "people", people: [] },
  { title: "Sayan Kirtan", type: "people", people: [] },

  { title: "Class Place", type: "text", value: "" },
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/* =====================
 DATE HELPERS
===================== */

function getDateForDay(dayName: string) {
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 7 : today.getDay();
  const targetIndex = WEEK_DAYS.indexOf(dayName) + 1;

  let diff = targetIndex - todayIndex;
  if (diff < 0) diff += 7;

  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d;
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

/* =====================
 PAGE
===================== */

export default function AdminMorningProgram() {
  const [devotees, setDevotees] = useState<DevoteeOption[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedDate, setSelectedDate] = useState("");
  const [saving, setSaving] = useState(false);

  /* 🔹 LOAD DEVOTEES */
  useEffect(() => {
    const loadDevotees = async () => {
      const snap = await getDocs(collection(db, "devotees"));
      setDevotees(
        snap.docs.map((d) => ({
          value: d.id,
          label: `${d.data().firstName || ""} ${
            d.data().lastName || ""
          } Pr`.trim(),
        }))
      );
    };
    loadDevotees();
  }, []);

  /* 🔹 LOAD DAY DATA */
  useEffect(() => {
    const loadDay = async () => {
      const dateObj = getDateForDay(selectedDay);
      const dateStr = formatDate(dateObj);
      setSelectedDate(dateStr);

      const ref = doc(db, "morningProgramAllotments", dateStr);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSections(snap.data().sections);
      } else {
        setSections(JSON.parse(JSON.stringify(MORNING_TEMPLATE)));
      }
    };

    loadDay();
  }, [selectedDay]);

  /* 🔹 SAVE */
  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "morningProgramAllotments", selectedDate), {
      date: selectedDate,
      sections,
    });
    setSaving(false);
    alert("✅ Morning Program saved for " + selectedDate);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-2">
        Morning Program Allotment
      </h1>

      <p className="text-center text-sm text-gray-600 mb-4">
        Date: <strong>{selectedDate}</strong>
      </p>

      {/* DAY BUTTONS */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {WEEK_DAYS.map((d) => {
          const date = formatDate(getDateForDay(d));
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1 rounded text-sm font-semibold ${
                selectedDay === d
                  ? "bg-yellow-700 text-white"
                  : "bg-yellow-200"
              }`}
            >
              {d}
              <div className="text-xs">{date}</div>
            </button>
          );
        })}
      </div>

      {/* SECTIONS */}
      {sections.map((sec, i) => (
        <div
          key={i}
          className="border rounded p-4 mb-4 bg-yellow-50"
        >
          <h2 className="font-bold mb-2">{sec.title}</h2>

          {/* PEOPLE */}
          {sec.type === "people" && (
            <Select
              options={devotees}
              isMulti
              value={sec.people?.map((p) => ({
                value: p.uid,
                label: p.name,
              }))}
              onChange={(vals) => {
                const copy = [...sections];
                copy[i].people =
                  vals?.map((v) => ({
                    uid: v.value,
                    name: v.label,
                    completed: false,
                  })) || [];
                setSections(copy);
              }}
            />
          )}

          {/* TIME */}
          {sec.type === "time" && (
            <input
              type="time"
              value={sec.value || ""}
              onChange={(e) => {
                const copy = [...sections];
                copy[i].value = e.target.value;
                setSections(copy);
              }}
              className="border px-3 py-2 rounded w-full"
            />
          )}

          {/* TEXT */}
          {sec.type === "text" && (
            <input
              value={sec.value || ""}
              onChange={(e) => {
                const copy = [...sections];
                copy[i].value = e.target.value;
                setSections(copy);
              }}
              placeholder="Enter details"
              className="border px-3 py-2 rounded w-full"
            />
          )}
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-yellow-700 text-white py-3 rounded font-semibold"
      >
        {saving ? "Saving..." : "💾 Save Morning Program"}
      </button>
    </div>
  );
}
