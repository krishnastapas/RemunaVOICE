"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, AuthError } from "firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Auto redirect if admin already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/admin/dashboard");
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      console.log("Logged in user:", user);
      console.log(process.env.NEXT_PUBLIC_ADMIN_EMAIL);

      // Check if admin
      if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setMessage("✅ Welcome Admin!");
        router.push("/admin/dashboard");
      } else {
        setMessage("❌ Access Denied! You are not an admin.");
      }
    } catch (error) {
      const err = error as AuthError;
      setMessage(`❌ ${err.code}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-yellow-600">
        <h2 className="text-2xl font-bold text-center text-yellow-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border border-yellow-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full border border-yellow-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400" : "bg-yellow-700 hover:bg-yellow-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-yellow-800 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
