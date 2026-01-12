import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebaseAdmin";

export async function POST() {
  const snap = await adminDb
    .collection("devotees")
    .where("features.sadhana", "==", true)
    .get();

  const tokens: string[] = [];

  snap.forEach((doc) => {
    const token = doc.data().fcmToken;
    if (token) tokens.push(token);
  });

  if (tokens.length) {
    await adminMessaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "📿 Sadhana Reminder",
        body: "Please fill your Sadhana card 🙏",
      },
    });
  }

  return NextResponse.json({ success: true });
}
