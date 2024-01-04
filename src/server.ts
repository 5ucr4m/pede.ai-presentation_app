import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://192.168.31.42:5173",
    "https://admin.socket.io",
    "https://main--incredible-faloodeh-a0781e.netlify.app"
  ], 
  credentials: true, 
};

dotenv.config();
console.log("");
console.log("===================================");

import initSocket from "./socket";

const port = process.env.PORT || 9000;

const app = express();
app.use(cors(corsOptions));

app.use(express.json());

app.get("/api/health", (req, res) =>
  res.status(200).json({ status: "running...", api: "0.1.3" })
);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions,
});

instrument(io, {
  auth: {
    type: "basic",
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "$2b$12$UuVzIePtvnqiHKdjbbMBqe88z7gMWerVKV5syeJf7UJN.bzxIwXmS",
  }
});

initSocket(io);

httpServer.listen(port, () => {
  console.log(`Server ready at http://0.0.0.0:${port}`);
  console.log("===================================");
  console.log("");
});
