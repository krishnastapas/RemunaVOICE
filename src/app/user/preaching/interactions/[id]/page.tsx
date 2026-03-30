"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import BackHeaderButton from "@/components/BackHeaderButton";

/* =====================
 TYPES
===================== */

interface Interaction {
  mentorId: string;
  menteeId: string;
  interactionType: string;
  date: string;
  duration?: number;
  issues: string;
  guidance: string;
  comments?: string;
  outcome: string;
  followUp?: string;
}

/* =====================
 PAGE
===================== */

export default function InteractionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [interaction, setInteraction] =
    useState<Interaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const ref = doc(db, "preaching_tracks", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setInteraction(snap.data() as Interaction);
      }
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 text-center">
        Loading interaction…
      </div>
    );
  }

  if (!interaction) {
    return (
      <div className="pt-32 text-center text-red-600">
        Interaction not found
      </div>
    );
  }

  return (
    <div>
      <BackHeaderButton
        title="Interaction Details"
        link="/user/preaching/interactions"
        backPageName="Back to Interactions"
      />

      <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-4">
        {/* BASIC INFO */}
        <InfoRow label="Date" value={interaction.date} />
        <InfoRow
          label="Interaction Type"
          value={interaction.interactionType}
        />
        <InfoRow label="Outcome" value={interaction.outcome} />

        {interaction.duration && (
          <InfoRow
            label="Duration"
            value={`${interaction.duration} min`}
          />
        )}

        {/* ISSUES */}
        <Section title="Problems / Issues">
          {interaction.issues}
        </Section>

        {/* GUIDANCE */}
        <Section title="Guidance Given">
          {interaction.guidance}
        </Section>

        {/* COMMENTS */}
        {interaction.comments && (
          <Section title="Important Comments">
            {interaction.comments}
          </Section>
        )}

        {/* FOLLOW UP */}
        {interaction.followUp && (
          <Section title="Follow‑up Plan">
            {interaction.followUp}
          </Section>
        )}
      </div>
    </div>
  );
}

/* =====================
 SMALL UI HELPERS
===================== */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b py-2 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-yellow-800 mb-1">
        {title}
      </h3>
      <div className="text-sm text-gray-700 border rounded p-3 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
