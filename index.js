import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const porta = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
  origin: "*", // Ou especifique seu endereço do app
  methods: ["GET", "POST"]
}  });


httpServer.listen(porta , () => console.log('Servidor escutando em : ', porta));

export default io;