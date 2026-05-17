"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SidebarDesktop({
    children,
}: {
    children: React.ReactNode;
}) {

    const { user, userData } = useAuth();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(path + "/");

    return (
        <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <aside className="w-64 bg-yellow-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-yellow-700 text-center">
                    Devotees Panel
                </div>

                <nav className="flex-1 mt-4 space-y-1">
                    <Link
                        href="/user/dashboard"
                        className={`block px-4 py-2 rounded-r-full ${isActive("/user/dashboard")
                            ? "bg-yellow-600 font-semibold"
                            : "hover:bg-yellow-700"
                            }`}
                    >
                        📊 Dashboard
                    </Link>

                    <Link
                        href="/user/admin/kitchen"
                        className={`block px-4 py-2 rounded-r-full ${isActive("/admin/dashboard/sadhana-report")
                            ? "bg-yellow-600 font-semibold"
                            : "hover:bg-yellow-700"
                            }`}
                    >
                        🧘 Kitchen
                    </Link>


                     <Link
                        href="/user/admin/account"
                        className={`block px-4 py-2 rounded-r-full ${isActive("/admin/dashboard/sadhana-report")
                            ? "bg-yellow-600 font-semibold"
                            : "hover:bg-yellow-700"
                            }`}
                    >
                        🧘 Account
                    </Link>

                   {/*  <Link
                        href="/admin/dashboard/seva-board"
                        className={`block px-4 py-2 rounded-r-full ${isActive("/admin/dashboard/seva-board")
                            ? "bg-yellow-600 font-semibold"
                            : "hover:bg-yellow-700"
                            }`}
                    >
                        🙏 Seva Board
                    </Link>

                    <Link
                        href="/admin/dashboard/users"
                        className={`block px-4 py-2 rounded-r-full ${isActive("/admin/dashboard/users")
                            ? "bg-yellow-600 font-semibold"
                            : "hover:bg-yellow-700"
                            }`}
                    >
                        👥 Users
                    </Link> */}
                </nav>

                {/* <button
                    onClick={handleLogout}
                    className="m-4 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                >
                    Logout
                </button> */}
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-6 bg-yellow-50">
                <header className="bg-yellow-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
                    <div>
                        <h1 className="text-lg font-semibold">🪔 Hare Krishna!</h1>
                        <p className="text-sm opacity-90">
                            Welcome,&nbsp;
                            <span className="font-bold capitalize">
                                {userData?.firstName ||
                                    user?.displayName?.split(" ")[0] ||
                                    "Devotee"}{" "}
                                Pr
                            </span>
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${logoutLoading
                            ? "bg-gray-400"
                            : "bg-yellow-600 hover:bg-yellow-800"
                            }`}
                    >
                        {logoutLoading ? "Logging out..." : "Logout"}
                    </button>
                </header>

                {children}
            </main>
        </div>
    );
}