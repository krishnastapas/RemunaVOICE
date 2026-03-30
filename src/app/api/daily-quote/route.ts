import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

function todayYMD() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export async function GET() {
  const today = todayYMD();

  const q = query(
    collection(db, "daily_quotes"),
    where("date", "==", today),
    where("active", "==", true)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return NextResponse.json({ quote: null });
  }

  const doc = snap.docs[0].data();

  return NextResponse.json({
    quote: {
      text: doc.text,
      imageUrl: doc.imageUrl || null,
    },
  });
}
