import setupChatSockets from "./chat.js";

export default function setupSockets(io) {
  // Conexão principal sem middleware de autenticação
  io.on("connection", (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);
    
    // Configurar apenas os handlers de chat
    setupChatSockets(socket, io);
    
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
}