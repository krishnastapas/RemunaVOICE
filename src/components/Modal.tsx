"use client";

import React from "react";

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[400px] max-h-[90vh] overflow-y-auto shadow-lg">
        {children}
      </div>
    </div>
  );
}