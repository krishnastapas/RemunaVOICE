"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

let socket: Socket;

export default function NotificationListener() {
  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.on("notification", (data: { message: string }) => {
      toast.success(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
