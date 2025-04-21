import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSockets from "./sockets/index.js";

const app = express();
const porta = process.env.PORT || 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, { 
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configura os sockets
setupSockets(io);

httpServer.listen(porta, () => console.log('Servidor escutando em:', porta));

export default io;