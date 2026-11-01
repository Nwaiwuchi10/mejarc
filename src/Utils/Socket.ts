import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
      auth: {
        token: token
      },
      transports: ["websocket"] // Ensure websocket is used
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    socket.on("error", (err) => {
      console.error("WebSocket Error:", err);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
