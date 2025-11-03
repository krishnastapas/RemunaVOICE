"use client";
import React from "react";
import { ShoppingBag, Trash2, Scissors, Droplet, BookOpen, Utensils } from "lucide-react";

// Next.js page showing the seva duty board with icons, colors, and responsiveness
// Use inside /app/seva-board/page.tsx

const boardData = {
  date: "03/11/2025",
  day: "Monday",
  sections: [
    { icon: ShoppingBag, title: "Vegetable Purchasing", people: ["Shivam PR", "P. Hemanth PR"] },
    { icon: Trash2, title: "Garbage Cleaning", people: ["Y/S Tapas"] },
    { icon: Scissors, title: "Vegetable Cutting", people: ["Anshu PR", "Anand Pr "] },
    { icon: Droplet, title: "Vessel Washing", people: ["Ravi Pr", "Sarthak PR"] },
    { icon: Utensils, title: "Mini Cleaning", people: [] },
    {
      icon: Utensils,
      title: "Offering",
      times: {
        Morning: ["Somesh PR"],
        Afternoon: ["Anshu PR"],
        Evening: ["Jaleshwar PR"],
      },
    },
    {
      icon: Utensils,
      title: "Serving",
      times: {
        Morning: ["Deepak PR"],
        Afternoon: ["HG HKP PRJI"],
        Evening: ["Prateek PR"],
      },
    },
    { icon: BookOpen, title: "Book Reading", people: ["HG SKP Prji"] },
    {
      icon: Droplet,
      title: "Mopping",
      times: {
        Morning: ["Devnath PR"],
        Afternoon: ["Rahul PR"],
        Evening: ["Barun PR"],
      },
    },
  ],
};

export default function SevaBoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-white to-yellow-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl bg-white border-4 border-yellow-700 rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-yellow-800">DATE:</h1>
            <p className="text-lg font-semibold text-gray-700">{boardData.date}</p>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-yellow-800">DAY:</h1>
            <p className="text-lg font-semibold text-gray-700">{boardData.day}</p>
          </div>
        </div>

        <div className="text-center border-b-4 border-yellow-700 mb-6 pb-2">
          <h2 className="text-3xl font-extrabold tracking-wide uppercase text-yellow-900">
            Seva  Board
          </h2>
        </div>

        <div className="space-y-4">
          {boardData.sections.map((sec, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-3 shadow-sm bg-yellow-50 hover:bg-yellow-100 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {sec.icon && <sec.icon className="w-5 h-5 text-yellow-800" />}
                  <div className="text-lg font-bold uppercase text-yellow-900">{sec.title}</div>
                </div>
              </div>

              {sec.times ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {Object.entries(sec.times).map(([time, people]) => (
                    <div key={time} className="border rounded-md p-2 bg-white">
                      <span className="font-semibold text-sm text-yellow-700">{time}</span>
                      {people.length > 0 ? (
                        <div className="flex flex-wrap gap-x-2 mt-1">
                          {people.map((p, i) => (
                            <span key={i} className="text-gray-800 font-medium whitespace-nowrap">
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-gray-400">-</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-4 gap-y-1 ml-7">
                  {sec.people && sec.people.length > 0 ? (
                    sec.people.map((p, i) => (
                      <span key={i} className="text-gray-800 font-medium whitespace-nowrap">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-gray-400">-</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-center text-yellow-700 mt-6 border-t pt-2 font-medium">
          REMUNA VOICE  — Seva Board for Devotees
        </div>
      </div>
    </div>
  );
}