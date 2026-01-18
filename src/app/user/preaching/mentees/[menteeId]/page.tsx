"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import BackHeaderButton from "@/components/BackHeaderButton";

/* =====================
 TYPES
===================== */
interface Mentee {
    name: string;
    phone: string;
    room?: string;
    address?: string;
    status: string;
}

interface Interaction {
    id: string;
    date: string;
    interactionType: string;
    outcome: string;
}

/* =====================
 PAGE
===================== */
export default function MenteeProfilePage() {
    const { menteeId } = useParams<{ menteeId: string }>();
    const router = useRouter();

    const [mentee, setMentee] = useState<Mentee | null>(null);
    const [interactions, setInteractions] = useState<Interaction[]>([]);

    useEffect(() => {
        if (!menteeId) return;

        const load = async () => {
            // Mentee
            const menteeSnap = await getDoc(
                doc(db, "mentees", menteeId)
            );
            if (menteeSnap.exists()) {
                setMentee(menteeSnap.data() as Mentee);
            }

            // Interactions
            const q = query(
                collection(db, "preaching_tracks"),
                where("menteeId", "==", menteeId)
            );


            const snap = await getDocs(q);
            setInteractions(
                snap.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<Interaction, "id">),
                }))
            );
        };

        load();
    }, [menteeId]);

    if (!mentee) {
        return <div className="pt-32 text-center">Loading…</div>;
    }

    return (
        <div>
            <BackHeaderButton
                title={mentee.name}
                link="/user/preaching/mentees"
                backPageName="Back to Mentees"
            />

            <div className="px-4 pt-4 pb-24 max-w-md mx-auto space-y-4">
                {/* PROFILE */}
                <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm">📞 {mentee.phone}</p>
                    <p className="text-sm text-gray-600">
                        {mentee.room && `Room ${mentee.room} • `}
                        {mentee.address}
                    </p>
                </div>

                {/* INTERACTIONS */}
                <h3 className="font-semibold text-yellow-800">
                    Interaction History
                </h3>

                {interactions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No interactions yet
                    </p>
                ) : (
                    interactions.map((i) => (
                        <div
                            key={i.id}
                            onClick={() =>
                                router.push(
                                    `/user/preaching/interactions/${i.id}`
                                )
                            }
                            className="bg-white border rounded-lg p-3 shadow cursor-pointer hover:bg-yellow-50"
                        >
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    {i.interactionType}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(i.date).toLocaleDateString(
                                        "en-IN",
                                        { day: "numeric", month: "short" }
                                    )}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600">
                                Outcome: {i.outcome}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
