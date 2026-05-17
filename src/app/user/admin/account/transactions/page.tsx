"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import AddTransaction from "./AddTransaction";
import EditTransaction from "./EditTransaction";
import TransactionsTable from "./TransactionsTable";

import Modal from "@/components/Modal";

import {
  FaArrowRight,
  FaPlus,
} from "react-icons/fa";

import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

export interface Transaction {
  id: string;

  dept: string;

  devoteeName: string;

  amount: number;

  date: string;

  type: "Credit" | "Debit";

  paymentType: "Online" | "Cash";

  purpose: string;

  remarks: string;
}

/* ================= MONTHS ================= */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ================= PAGE ================= */

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [showAdd, setShowAdd] =
    useState<boolean>(false);

  const [editingData, setEditingData] =
    useState<Transaction | null>(null);

  /* ================= MONTH FILTER ================= */

  const currentMonth =
    new Date().getMonth();

  const [selectedMonth, setSelectedMonth] =
    useState<number>(currentMonth);

  /* ================= FETCH ================= */

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "accountTransactions"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const list: Transaction[] = snap.docs.map(
        (doc) => ({
          id: doc.id,

          ...(doc.data() as Omit<
            Transaction,
            "id"
          >),
        })
      );

      setTransactions(list);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ================= MONTHLY TRANSACTIONS ================= */

  const monthlyTransactions =
    useMemo(() => {
      return transactions.filter(
        (item) => {
          if (!item.date)
            return false;

          const month =
            new Date(
              item.date
            ).getMonth();

          return (
            month === selectedMonth
          );
        }
      );
    }, [
      transactions,
      selectedMonth,
    ]);

  /* ================= MONTHLY DONATION ================= */

  const monthlyDonation =
    useMemo(() => {
      return monthlyTransactions
        .filter(
          (t) => t.type === "Credit"
        )
        .reduce(
          (sum, t) => sum + t.amount,
          0
        );
    }, [monthlyTransactions]);

  /* ================= MONTHLY EXPENSE ================= */

  const monthlyExpense =
    useMemo(() => {
      return monthlyTransactions
        .filter(
          (t) => t.type === "Debit"
        )
        .reduce(
          (sum, t) => sum + t.amount,
          0
        );
    }, [monthlyTransactions]);

  /* ================= TOTAL BALANCE ================= */

  const totalBalance = useMemo(() => {
    return transactions.reduce(
      (sum, t) => {
        return t.type === "Credit"
          ? sum + t.amount
          : sum - t.amount;
      },
      0
    );
  }, [transactions]);

  /* ================= ONLINE BALANCE ================= */

  const onlineBalance = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.paymentType === "Online"
      )
      .reduce((sum, t) => {
        return t.type === "Credit"
          ? sum + t.amount
          : sum - t.amount;
      }, 0);
  }, [transactions]);

  /* ================= CASH BALANCE ================= */

  const cashBalance = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.paymentType === "Cash"
      )
      .reduce((sum, t) => {
        return t.type === "Credit"
          ? sum + t.amount
          : sum - t.amount;
      }, 0);
  }, [transactions]);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Account Transactions
            </h1>

            <p className="text-sm text-gray-500">
              Manage temple donations &
              expenses
            </p>
          </div>

          <div className="flex gap-3">
            {/* MONTH */}

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  Number(
                    e.target.value
                  )
                )
              }
              className="border rounded-lg px-4 py-2 bg-white"
            >
              {MONTHS.map(
                (month, index) => (
                  <option
                    key={month}
                    value={index}
                  >
                    {month}
                  </option>
                )
              )}
            </select>

            {/* ADD */}

            <button
              onClick={() =>
                setShowAdd(true)
              }
              className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaPlus />

              Add Transaction
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* DONATION */}

          <Card
            title="Donation"
            amount={monthlyDonation}
            color="bg-green-100 text-green-700"
            onClick={() =>
              router.push(
                `/user/admin/account/donations?month=${selectedMonth}`
              )
            }
            showArrow
          />

          {/* EXPENSE */}

          <Card
            title="Expense"
            amount={monthlyExpense}
            color="bg-red-100 text-red-700"
            onClick={() =>
              router.push(
                `/user/admin/account/expenses?month=${selectedMonth}`
              )
            }
            showArrow
          />

          {/* TOTAL BALANCE */}

          <Card
            title="Balance"
            amount={totalBalance}
            color="bg-blue-100 text-blue-700"
          />

          {/* ONLINE */}

          <Card
            title="Online"
            amount={onlineBalance}
            color="bg-purple-100 text-purple-700"
          />

          {/* CASH */}

          <Card
            title="Cash"
            amount={cashBalance}
            color="bg-orange-100 text-orange-700"
          />
        </div>

        {/* TABLE */}

        <TransactionsTable
          data={monthlyTransactions}
          loading={loading}
          onEdit={(item) =>
            setEditingData(item)
          }
          onSuccess={fetchTransactions}
        />

        {/* ADD MODAL */}

        {showAdd && (
          <Modal
            onClose={() =>
              setShowAdd(false)
            }
          >
            <AddTransaction
              onSuccess={() => {
                fetchTransactions();

                setShowAdd(false);
              }}
            />
          </Modal>
        )}

        {/* EDIT MODAL */}

        {editingData && (
          <Modal
            onClose={() =>
              setEditingData(null)
            }
          >
            <EditTransaction
              data={editingData}
              onClose={() =>
                setEditingData(null)
              }
              onSuccess={() => {
                fetchTransactions();

                setEditingData(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function Card({
  title,
  amount,
  color,
  onClick,
  showArrow = false,
}: {
  title: string;

  amount: number;

  color: string;

  onClick?: () => void;

  showArrow?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 ${color} ${
        showArrow
          ? "cursor-pointer hover:scale-[1.02] transition"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {title}
        </div>

        {showArrow && (
          <FaArrowRight className="text-sm" />
        )}
      </div>

      <div className="text-2xl font-bold mt-2">
        ₹ {amount}
      </div>
    </div>
  );
}