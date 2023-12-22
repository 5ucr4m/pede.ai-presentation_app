"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io) => {
    console.log("Initializing Socket.io...");
    const game = io.of("/game");
    const chat = io.of("/chat");
    game.on("connection", (gameSocket) => {
        console.log("Game socket connected", gameSocket.id);
    });
    chat.on("connection", (chatSocket) => {
        console.log("Game socket connected", chatSocket.id);
    });
    return { game, chat };
};
