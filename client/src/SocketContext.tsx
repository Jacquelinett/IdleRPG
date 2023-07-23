import { createContext } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContext {
  socket: Socket;
}

const CurrentSocketContext = createContext<SocketContext | null>(null);

export default CurrentSocketContext;
