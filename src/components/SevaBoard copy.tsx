"use client";
import React, { useEffect, useState } from "react";

// Digital Whiteboard component (single-file React + Tailwind)
// Features:
// - Editable date / day
// - Editable list of sections (title + names)
// - Add / remove sections and names
// - Save to localStorage and export JSON
// - Clean, print-friendly layout

export type Section = {
  id: string;
  title: string;
  notes?: string;
  people: string[]; // list of names
};

const sampleSections: Section[] = [
  { id: "s1", title: "Vegetable Purchasing", people: ["Dhiraj PR", "P. Katinash PR"] },
  { id: "s2", title: "Garbage Cleaning", people: ["Y/S Tapas"] },
  { id: "s3", title: "Vegetable Cutting", people: ["Anand PR", "Devnath PR"] },
  { id: "s4", title: "Vessel Washing", people: ["HG HDKPRJI", "Niloy PR"] },
  { id: "s5", title: "Mini Cleaning", people: [] },
  { id: "s6", title: "Offering", people: ["Somesh PR", "Sarthak PR", "Jaleshwar PR"] },
  { id: "s7", title: "Serving", people: ["Anshu PR", "Deepak PR", "Prateek PR"] },
  { id: "s8", title: "Book Reading", people: [] },
  { id: "s9", title: "Mopping", people: ["Ravi PR", "Nikhil PR", "Barun PR"] },
];

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function DigitalWhiteboard() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // yyyy-mm-dd
  });
  const [day, setDay] = useState(() => {
    return new Date().toLocaleDateString(undefined, { weekday: "long" });
  });
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const raw = localStorage.getItem("digital_board_v1");
      if (raw) return JSON.parse(raw) as Section[];
    } catch (e) {
      console.warn(e);
    }
    return sampleSections;
  });

  useEffect(() => {
    localStorage.setItem("digital_board_v1", JSON.stringify(sections));
  }, [sections]);

  // Section operations
  const updateSectionTitle = (id: string, title: string) => {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, title } : sec)));
  };

  const updatePerson = (sectionId: string, idx: number, value: string) => {
    setSections((s) =>
      s.map((sec) =>
        sec.id === sectionId ? { ...sec, people: sec.people.map((p, i) => (i === idx ? value : p)) } : sec
      )
    );
  };

  const addPerson = (sectionId: string) => {
    setSections((s) => s.map((sec) => (sec.id === sectionId ? { ...sec, people: [...sec.people, ""] } : sec)));
  };

  const removePerson = (sectionId: string, idx: number) => {
    setSections((s) => s.map((sec) => (sec.id === sectionId ? { ...sec, people: sec.people.filter((_, i) => i !== idx) } : sec)));
  };

  const addSection = () => {
    const newSec: Section = { id: uid("s"), title: "New Section", people: [] };
    setSections((s) => [...s, newSec]);
  };

  const removeSection = (id: string) => {
    setSections((s) => s.filter((sec) => sec.id !== id));
  };

  const clearBoard = () => {
    if (!confirm("Clear the whole board? This cannot be undone.")) return;
    setSections([]);
  };

  const exportJson = () => {
    const dataStr = JSON.stringify({ date, day, sections }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `board-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const j = JSON.parse(String(reader.result));
        if (Array.isArray(j)) setSections(j);
        else if (j && j.sections) {
          setDate(j.date || date);
          setDay(j.day || day);
          setSections(j.sections);
        }
      } catch (e) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">DATE</div>
            <input
              aria-label="board-date"
              className="border rounded px-3 py-1 mt-2"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <div className="text-2xl font-bold text-right">DAY</div>
            <input
              aria-label="board-day"
              className="border rounded px-3 py-1 mt-2 text-right"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-2 bg-slate-700 text-white rounded shadow"
              onClick={() => {
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                setDate(nextDay.toISOString().slice(0, 10));
                setDay(nextDay.toLocaleDateString(undefined, { weekday: "long" }));
              }}
            >
              Next Day
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={exportJson}>
              Export JSON
            </button>
            <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer">
              Import
              <input className="hidden" type="file" accept="application/json" onChange={importJson} />
            </label>
            <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={clearBoard}>
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h1 className="text-3xl font-extrabold mb-4 text-center">Daily Duty Board</h1>
          <div className="grid gap-4">
            {sections.map((sec) => (
              <div key={sec.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <input
                    className="text-xl font-semibold w-2/3 border-b focus:outline-none"
                    value={sec.title}
                    onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                  />
                  <div className="flex gap-2 items-center">
                    <button
                      className="px-2 py-1 bg-yellow-400 rounded"
                      onClick={() => addPerson(sec.id)}
                      title="Add person"
                    >
                      + Person
                    </button>
                    <button className="px-2 py-1 bg-red-400 rounded" onClick={() => removeSection(sec.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {sec.people.length === 0 && (
                    <div className="text-gray-400 italic">No people assigned. Click "+ Person" to add.</div>
                  )}

                  {sec.people.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="flex-1 border rounded px-2 py-1"
                        value={p}
                        onChange={(e) => updatePerson(sec.id, idx, e.target.value)}
                        placeholder="Name"
                      />
                      <button className="px-2 py-1 bg-red-200 rounded" onClick={() => removePerson(sec.id, idx)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={addSection}>
                + Add Section
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => {
                  // quick tidy: trim names and drop empties
                  setSections((s) =>
                    s.map((sec) => ({ ...sec, people: sec.people.map((p) => p.trim()).filter(Boolean) }))
                  );
                }}
              >
                Tidy Names
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>Auto-saved to localStorage.</div>
          <div>
            <button
              className="underline"
              onClick={() => {
                // reset to sample
                if (!confirm("Reset to sample board?")) return;
                setSections(sampleSections.map((s) => ({ ...s, id: uid("s") })));
                setDate(new Date().toISOString().slice(0, 10));
                setDay(new Date().toLocaleDateString(undefined, { weekday: "long" }));
              }}
            >
              Load Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}