
"use client";

interface Props {
  record: any;
  onClose: () => void;
}

export default function SadhanaDayDetailsModal({
  record,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[360px] p-5 rounded shadow">
        <h3 className="font-bold mb-3">
          Sadhana Details – {record.date}
        </h3>

        {Object.entries(record)
          .filter(([k]) => !["userId", "date"].includes(k))
          .map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b py-1 text-sm"
            >
              <span>{k}</span>
              <span>{v === 1 ? "Yes" : "No"}</span>
            </div>
          ))}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-yellow-700 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
