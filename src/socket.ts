import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { RoomControl } from "./utils/Room";

const SECRET_KEY = "your_secret_key(pede.ai)";
const DEFAULT_PASSWORD = "123456";

export default (io: Server) => {
  console.log("Initializing Socket.io...");
  const roomControl = new RoomControl();
  const onlineUsers = new Map();
  const lastRoom = new Map();

  io.use((socket, next) => {
    const { username, userID, password } = socket.handshake.auth;

    if (password === DEFAULT_PASSWORD) {
      const token = jwt.sign({ username, userID }, SECRET_KEY, { expiresIn: '24h' });
      socket.handshake.auth.token = token;
    }

    return next();
  });

  io.on("connection", (gameSocket: any) => {
    console.log("Game socket connected", gameSocket.id);

    gameSocket.on("handle-join", (userID: string, callback: any) => {
      onlineUsers.set(userID, gameSocket.id);
      callback(v4());
    });

    gameSocket.on("join-room", async (room: string, callback: any) => {
      const { userID, username } = gameSocket.handshake.auth;
      gameSocket.join(room);

      lastRoom.set(userID, room);
      roomControl.addUser({ user: { userID, username }, room });

      const users = await roomControl.getUsers(room);

      gameSocket.to(room).emit("update-users", users);
      callback(users)
    });

    gameSocket.on("reset", async (room: string, callback: any) => {
      roomControl.resetGame(room);

      const users = await roomControl.getUsers(room);
      gameSocket.to(room).emit("update-users", users);
      gameSocket.to(room).emit("change-status", "hide");
      
      callback(users);
    });

    gameSocket.on("show-cards", async (room: string, callback: any) => {
      roomControl.showCards(room);
      
      const users = await roomControl.getUsers(room);
      gameSocket.to(room).emit("update-users", users);
      gameSocket.to(room).emit("change-status", "show");

      callback(users, "show");
    });

    gameSocket.onAny((eventName: string, ...args: any) => {
      console.log("Game socket received event: ", eventName, args);
    });

    gameSocket.on("select-card", async (msg: any, callback: any) => {
      const {userID} = gameSocket.handshake.auth;
      const {room, value} = msg;

      roomControl.selectCard({ user: { userID, value }, room });
      const users = await roomControl.getUsers(room);

      gameSocket.to(room).emit("update-users", users);
      callback(users);
    });

    gameSocket.on("disconnect", async () => {
      const {userID} = gameSocket.handshake.auth;
      const room = lastRoom.get(userID);

      onlineUsers.delete(userID);
      lastRoom.delete(userID);
      roomControl.removeUser(userID, room);

      gameSocket.to(room).emit("update-users", await roomControl.getUsers(room));
    });
  });
};
