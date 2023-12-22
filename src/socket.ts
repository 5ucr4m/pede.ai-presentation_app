import { Server } from "socket.io";

export default (io: Server) => {
  console.log("Initializing Socket.io...");

  const game = io.of("/game");
  const chat = io.of("/chat");

  game.on("connection", (gameSocket: any) => {
    console.log("Game socket connected", gameSocket.id);
  });

  chat.on("connection", (chatSocket) => {
    console.log("Game socket connected", chatSocket.id);
  });

  return { game, chat };
};
