"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Devotee {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  provider?: string;
  createdAt?: Timestamp;
}

export default function AdminUserList() {
  const [users, setUsers] = useState<Devotee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnap = await getDocs(collection(db, "devotees"));
        const data: Devotee[] = querySnap.docs.map((doc) => {
          const user = doc.data() as Omit<Devotee, "uid">;
          return { uid: doc.id, ...user };
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching devotees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-8 w-8 border-4 border-yellow-700 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-yellow-700 font-medium">Loading devotees...</p>
      </div>
    );

  if (users.length === 0)
    return (
      <div className="text-center py-10 text-yellow-800 font-semibold">
        No devotees registered yet 🙏
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-300 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800 text-center">
        Registered Devotees
      </h2>

      <table className="min-w-full text-sm border border-yellow-200">
        <thead className="bg-yellow-700 text-white">
          <tr>
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Email</th>
            <th className="py-2 px-3 text-left">Phone</th>
            <th className="py-2 px-3 text-left">DOB</th>
            <th className="py-2 px-3 text-left">Provider</th>
            <th className="py-2 px-3 text-left">Registered On</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.uid}
              className={`border-t border-yellow-100 ${
                i % 2 === 0 ? "bg-yellow-50" : "bg-white"
              }`}
            >
              <td className="py-2 px-3">{u.name || "-"}</td>
              <td className="py-2 px-3">{u.email}</td>
              <td className="py-2 px-3">{u.phone || "-"}</td>
              <td className="py-2 px-3">{u.dob || "-"}</td>
              <td className="py-2 px-3 capitalize">{u.provider || "-"}</td>
              <td className="py-2 px-3">
                {u.createdAt
                  ? new Date(u.createdAt.toDate()).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
