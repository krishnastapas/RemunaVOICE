"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import BackHeader from "@/components/BackHeader";

export default function AdminDailyQuote() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  

  return (
    <div>
      <BackHeader title="Account Management" />

     
    </div>
  );
}
