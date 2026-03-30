"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // 🔒 Protect routes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/");
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.push("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-800 font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
     

      {/* CONTENT */}
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
}
