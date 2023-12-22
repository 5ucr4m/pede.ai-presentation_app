import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key(pede.ai)";
const DEFAULT_PASSWORD = "123456";

export default (io: Server) => {
  console.log("Initializing Socket.io...");
  const onlineUsers = new Map();
  const roomToUsers = new Map();
  const userScore = new Map();

  const game = io.of("/game");
  const chat = io.of("/chat");

  io.use((socket, next) => {
    const { username, userID, password } = socket.handshake.auth;

    if (password === DEFAULT_PASSWORD) {
      const token = jwt.sign({ username, userID }, SECRET_KEY, { expiresIn: '24h' });
      socket.handshake.auth.token = token;
    }

    return next();
  });

  game.on("connection", (gameSocket: any) => {
    console.log("Game socket connected", gameSocket.id);

    gameSocket.on("join", (userID: string) => {
      onlineUsers.set(userID, gameSocket.id);
    });

    gameSocket.on("join-room", (room: string) => {
      roomToUsers.set(room, gameSocket.id);
      gameSocket.join(room);
    });

    gameSocket.onAny((eventName: string, ...args: any) => {
      console.log("Game socket received event: ", eventName, args);
    });

    gameSocket.on("select-card", (msg: any) => {
      const {room, userID, value} = msg;
    });

  });

  chat.on("connection", (chatSocket) => {
    console.log("Game socket connected", chatSocket.id);
  });

  return { game, chat };
};
