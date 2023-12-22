"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const admin_ui_1 = require("@socket.io/admin-ui");
dotenv_1.default.config();
console.log("");
console.log("===================================");
const socket_1 = __importDefault(require("./socket"));
const port = process.env.PORT || 9000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/health", (req, res) => res.status(200).json({ status: "running...", api: "0.1.3" }));
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
(0, admin_ui_1.instrument)(io, {
    auth: {
        type: "basic",
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PASSWORD || "$2b$12$UuVzIePtvnqiHKdjbbMBqe88z7gMWerVKV5syeJf7UJN.bzxIwXmS",
    }
});
(0, socket_1.default)(io);
httpServer.listen(port, () => {
    console.log(`Server ready at http://0.0.0.0:${port}`);
    console.log("===================================");
    console.log("");
});
