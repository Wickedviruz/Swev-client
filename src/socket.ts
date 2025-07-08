// src/socket.ts
import { io, Socket } from "socket.io-client";

let currentSocket: Socket | null = null;

export function createSocket(characterId: number): Socket {
  // Stäng ev. gammal socket innan vi skapar en ny
  if (currentSocket) {
    console.log('[CLIENT] Cleaning up existing socket for characterId', characterId);
    currentSocket.disconnect();
    currentSocket = null;
  }
  currentSocket = io("http://localhost:7172", {
    auth: { characterId },
    forceNew: true,
  });

  currentSocket.on("connect", () => {
    console.log("[CLIENT] Socket connected for characterId", characterId, currentSocket.id);
  });
  currentSocket.on("disconnect", (reason) => {
    console.log("[CLIENT] Socket disconnected:", reason);
  });
  currentSocket.on("connect_error", (err) => {
    console.error("[CLIENT] Socket connect error:", err);
  });

  return currentSocket;
}

export function resetSocket() {
  if (currentSocket) {
    console.log('[CLIENT] Resetting socket');
    currentSocket.disconnect();
    currentSocket = null;
  }
}
