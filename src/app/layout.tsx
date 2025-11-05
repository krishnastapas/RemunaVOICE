import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "C-Cube Seva Board",
  description: "Hare Krishna Devotee Seva Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-yellow-50 text-yellow-900 min-h-screen">
        {/* Wrap the entire app in AuthContext */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
