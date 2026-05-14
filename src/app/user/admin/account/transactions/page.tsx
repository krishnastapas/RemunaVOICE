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

import { FaPlus } from "react-icons/fa";

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

  /* ================= MONTHLY DATA ================= */

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

  /* ================= SUMMARY ================= */

  const totalDonation = useMemo(() => {
    return monthlyTransactions
      .filter(
        (t) => t.type === "Credit"
      )
      .reduce(
        (sum, t) => sum + t.amount,
        0
      );
  }, [monthlyTransactions]);

  const totalExpense = useMemo(() => {
    return monthlyTransactions
      .filter(
        (t) => t.type === "Debit"
      )
      .reduce(
        (sum, t) => sum + t.amount,
        0
      );
  }, [monthlyTransactions]);

  const balance =
    totalDonation - totalExpense;

  const onlineBalance = useMemo(() => {
    return monthlyTransactions
      .filter(
        (t) =>
          t.paymentType === "Online"
      )
      .reduce((sum, t) => {
        return t.type === "Credit"
          ? sum + t.amount
          : sum - t.amount;
      }, 0);
  }, [monthlyTransactions]);

  const cashBalance = useMemo(() => {
    return monthlyTransactions
      .filter(
        (t) =>
          t.paymentType === "Cash"
      )
      .reduce((sum, t) => {
        return t.type === "Credit"
          ? sum + t.amount
          : sum - t.amount;
      }, 0);
  }, [monthlyTransactions]);

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
            {/* MONTH DROPDOWN */}

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

            {/* ADD BUTTON */}

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
          <Card
            title="Donation"
            amount={totalDonation}
            color="bg-green-100 text-green-700"
          />

          <Card
            title="Expense"
            amount={totalExpense}
            color="bg-red-100 text-red-700"
          />

          <Card
            title="Balance"
            amount={balance}
            color="bg-blue-100 text-blue-700"
          />

          <Card
            title="Online"
            amount={onlineBalance}
            color="bg-purple-100 text-purple-700"
          />

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

function Card({
  title,
  amount,
  color,
}: {
  title: string;

  amount: number;

  color: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${color}`}
    >
      <div className="text-sm font-medium">
        {title}
      </div>

      <div className="text-2xl font-bold mt-2">
        ₹ {amount}
      </div>
    </div>
  );
}