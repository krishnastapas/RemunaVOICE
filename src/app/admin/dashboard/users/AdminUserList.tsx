"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= TYPES ================= */

type AdminFeature = "sevaAlot" | "morningProgramAlot" | "kitchen";

type UserFeature =
  | "admin"
  | "seva"
  | "sadhana"
  | "profile"
  | "preaching"
  | "morningProgram"
  | "library"
  | "kitchen"
  | "reports"
  | "sevaBoard";

interface Devotee {
  uid: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  dob?: string;
  createdAt?: Timestamp;

  features: Record<UserFeature, boolean>;
  adminFeatures: AdminFeature[];
}

type DevoteeDoc = Omit<Devotee, "uid">;

/* ================= CONSTANTS ================= */

const ALL_USER_FEATURES: UserFeature[] = [
  "admin",
  "seva",
  "sadhana",
  "profile",
  "preaching",
  "morningProgram",
  "library",
  "kitchen",
  "reports",
  "sevaBoard",
];

const ALL_ADMIN_FEATURES: AdminFeature[] = [
  "sevaAlot",
  "morningProgramAlot",
  "kitchen"
];

/* ================= PAGE ================= */

export default function AdminUserList() {
  const [users, setUsers] = useState<Devotee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<Devotee | null>(null);
  const [saving, setSaving] = useState(false);

  /* ---------- FETCH USERS ---------- */
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "devotees"));

      setUsers(
        snap.docs.map((d) => {
          const data = d.data() as DevoteeDoc;

          const normalizedFeatures = ALL_USER_FEATURES.reduce(
            (acc, f) => {
              acc[f] = data.features?.[f] ?? false;
              return acc;
            },
            {} as Record<UserFeature, boolean>
          );

          return {
            uid: d.id,
            ...data,
            features: normalizedFeatures,
            adminFeatures: data.adminFeatures || [],
          };
        })
      );

      setLoading(false);
    };

    fetchUsers();
  }, []);

  /* ---------- SAVE EDIT ---------- */
  const handleSaveEdit = async () => {
    if (!editUser) return;
    setSaving(true);

    await updateDoc(doc(db, "devotees", editUser.uid), {
      firstName: editUser.firstName || "",
      lastName: editUser.lastName || "",
      phone: editUser.phone || "",
      dob: editUser.dob || "",
      features: editUser.features,
      adminFeatures: editUser.adminFeatures,
    });

    setUsers((prev) =>
      prev.map((u) => (u.uid === editUser.uid ? editUser : u))
    );

    setEditUser(null);
    setSaving(false);
  };

  /* ---------- LOADING ---------- */
  if (loading)
    return (
      <div className="text-center py-10 text-yellow-700 font-semibold">
        Loading devotees...
      </div>
    );

  /* ---------- UI ---------- */
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-yellow-300">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800 text-center">
        Registered Devotees
      </h2>

      <table className="min-w-full text-sm border">
        <thead className="bg-yellow-700 text-white">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Features</th>
            <th className="p-2">Admin Access</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.uid} className={i % 2 ? "bg-white" : "bg-yellow-50"}>
              <td className="p-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 text-xs">
                {ALL_USER_FEATURES.filter((f) => u.features[f]).join(", ") ||
                  "-"}
              </td>
              <td className="p-2 text-xs text-blue-700">
                {u.adminFeatures.join(", ") || "-"}
              </td>
              <td className="p-2 text-center">
                <button
                  className="text-blue-600 font-semibold"
                  onClick={() => setEditUser({ ...u })}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- EDIT MODAL ---------- */}
      {editUser && (
        <Modal>
          <h3 className="font-bold text-lg mb-3">Edit User</h3>

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

          {/* USER FEATURES */}
          <h4 className="font-semibold mt-3">User Features</h4>
          {ALL_USER_FEATURES.map((f) => (
            <Checkbox
              key={f}
              label={f}
              checked={editUser.features[f]}
              onChange={(v) =>
                setEditUser({
                  ...editUser,
                  features: {
                    ...editUser.features,
                    [f]: v,
                  },
                })
              }
            />
          ))}

          {/* ADMIN FEATURES */}
          <h4 className="font-semibold mt-3">Admin Permissions</h4>
          {ALL_ADMIN_FEATURES.map((af) => (
            <Checkbox
              key={af}
              label={af}
              checked={editUser.adminFeatures.includes(af)}
              onChange={(v) =>
                setEditUser({
                  ...editUser,
                  adminFeatures: v
                    ? [...editUser.adminFeatures, af]
                    : editUser.adminFeatures.filter((x) => x !== af),
                })
              }
            />
          ))}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-yellow-700 text-white px-4 py-2 rounded"
            >
              Save
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
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[420px]">{children}</div>
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
    <div className="mb-2">
      <label className="block text-sm mb-1 capitalize">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm mb-1 capitalize">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
