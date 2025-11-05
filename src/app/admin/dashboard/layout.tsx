"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-yellow-50">
        {/* Sidebar */}
        <aside className="w-64 bg-yellow-800 text-white flex flex-col">
          <div className="p-4 text-2xl font-bold border-b border-yellow-700 text-center">
            Admin Panel
          </div>
          <nav className="flex-1 mt-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className={`block px-4 py-2 rounded-r-full ${
                pathname === "/admin/dashboard"
                  ? "bg-yellow-600 font-semibold"
                  : "hover:bg-yellow-700"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard/seva-board"
              className={`block px-4 py-2 rounded-r-full ${
                pathname.includes("/admin/dashboard/seva-board")
                  ? "bg-yellow-600 font-semibold"
                  : "hover:bg-yellow-700"
              }`}
            >
              Seva Board
            </Link>
            <Link
              href="/admin/dashboard/users"
              className={`block px-4 py-2 rounded-r-full ${
                pathname.includes("/admin/dashboard/users")
                  ? "bg-yellow-600 font-semibold"
                  : "hover:bg-yellow-700"
              }`}
            >
              Users
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="m-4 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow mb-4 border border-yellow-300">
            <h1 className="text-2xl font-bold text-yellow-800">Admin Dashboard</h1>
            <div className="text-yellow-800 font-semibold">Welcome, Admin 👋</div>
          </div>

          <div>{children}</div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
