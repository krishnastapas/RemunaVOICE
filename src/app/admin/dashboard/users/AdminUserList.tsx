"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ---------------- TYPES ---------------- */
interface Devotee {
  uid: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  dob?: string;
  provider?: string;
  createdAt?: Timestamp;
  displayName?: string;
}

/* ---------------- PAGE ---------------- */
export default function AdminUserList() {
  const [users, setUsers] = useState<Devotee[]>([]);
  const [loading, setLoading] = useState(true);

  const [editUser, setEditUser] = useState<Devotee | null>(null);
  const [deleteUser, setDeleteUser] = useState<Devotee | null>(null);
  const [saving, setSaving] = useState(false);

  /* -------- FETCH USERS -------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "devotees"));
        setUsers(
          snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
        );
      } catch (err) {
        console.error("Error fetching devotees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  /* -------- SAVE EDIT -------- */
  const handleSaveEdit = async () => {
    if (!editUser) return;
    setSaving(true);

    try {
      const ref = doc(db, "devotees", editUser.uid);
      await updateDoc(ref, {
        firstName: editUser.firstName || "",
        lastName: editUser.lastName || "",
        phone: editUser.phone || "",
        dob: editUser.dob || "",
      });

      setUsers((prev) =>
        prev.map((u) => (u.uid === editUser.uid ? editUser : u))
      );
      setEditUser(null);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  /* -------- CONFIRM DELETE -------- */
  const confirmDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);

    try {
      await deleteDoc(doc(db, "devotees", deleteUser.uid));
      setUsers((prev) => prev.filter((u) => u.uid !== deleteUser.uid));
      setDeleteUser(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSaving(false);
    }
  };

  /* -------- LOADING -------- */
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

  /* -------- UI -------- */
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-300 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800 text-center">
        Registered Devotees
      </h2>

      <table className="min-w-full text-sm border border-yellow-200">
        <thead className="bg-yellow-700 text-white">
          <tr>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Phone</th>
            <th className="py-2 px-3">DOB</th>
            <th className="py-2 px-3">Provider</th>
            <th className="py-2 px-3">Registered</th>
            <th className="py-2 px-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const fullName =
              u.firstName || u.lastName || u.displayName
                ? `${u.firstName || ""} ${u.lastName || u.displayName || ""}`.trim()
                : "-";

            return (
              <tr
                key={u.uid}
                className={`border-t ${
                  i % 2 === 0 ? "bg-yellow-50" : "bg-white"
                }`}
              >
                <td className="px-3 py-2">{fullName}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.phone || "-"}</td>
                <td className="px-3 py-2">{u.dob || "-"}</td>
                <td className="px-3 py-2 capitalize">{u.provider || "-"}</td>
                <td className="px-3 py-2">
                  {u.createdAt
                    ? new Date(u.createdAt.toDate()).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => setEditUser(u)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteUser(u)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* -------- EDIT MODAL -------- */}
      {editUser && (
        <Modal>
          <h3 className="font-bold text-lg mb-3">Edit Devotee</h3>

          <Input
            label="First Name"
            value={editUser.firstName || ""}
            onChange={(v) =>
              setEditUser({ ...editUser, firstName: v })
            }
          />
          <Input
            label="Last Name"
            value={editUser.lastName || ""}
            onChange={(v) =>
              setEditUser({ ...editUser, lastName: v })
            }
          />
          <Input
            label="Phone"
            value={editUser.phone || ""}
            onChange={(v) =>
              setEditUser({ ...editUser, phone: v })
            }
          />
          <Input
            label="DOB"
            type="date"
            value={editUser.dob || ""}
            onChange={(v) =>
              setEditUser({ ...editUser, dob: v })
            }
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-yellow-700 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditUser(null)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* -------- DELETE CONFIRM MODAL -------- */}
      {deleteUser && (
        <Modal>
          <h3 className="font-bold text-lg text-red-600 mb-3">
            Confirm Delete
          </h3>
          <p>
            Are you sure you want to delete{" "}
            <strong>{deleteUser.firstName || deleteUser.email}</strong>?
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={confirmDelete}
              disabled={saving}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={() => setDeleteUser(null)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[380px]">
        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
