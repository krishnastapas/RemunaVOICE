import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  const snap = await getDoc(doc(db, "daily_quote", "current"));

  if (!snap.exists()) {
    return NextResponse.json({ quote: null });
  }

  return NextResponse.json({
    quote: snap.data(),
  });
}
