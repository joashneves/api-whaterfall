export default function setupChatSockets(socket, io) {
  // Entrar em salas de conversa
  socket.on("joinConversations", (userConversations) => {
    if (!Array.isArray(userConversations)) {
      console.error('userConversations deve ser um array');
      return;
    }
    
    userConversations.forEach(convId => {
      socket.join(`conv_${convId}`);
      console.log(`Usuário entrou na conversa ${convId}`);
    });
  });
  
  // Mensagem privada
  socket.on("privateMessage", async (data) => {
    try {
      console.log('Nova mensagem recebida:', data);
      
      // Validação básica dos dados
      if (!data || !data.conversationId || !data.senderId || !data.content) {
        throw new Error('Dados da mensagem incompletos');
      }
      
      const { conversationId, senderId, content } = data;
      
      // Aqui você normalmente salvaria no banco de dados
      // const message = await ChatService.addMessage(conversationId, senderId, content);
      
      // Simulando o objeto de mensagem que viria do banco
      const message = {
        conversationId,
        sender: senderId,
        content,
        timestamp: new Date()
      };
      
      // Enviar para todos os participantes da conversa
      io.to(`conv_${conversationId}`).emit("newMessage", message);
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      socket.emit("chatError", { error: error.message });
    }
  });
  
  // Opcional: Confirmação de recebimento
  socket.on("messageReceived", (messageId) => {
    console.log(`Mensagem ${messageId} recebida pelo cliente`);
    // Aqui você poderia atualizar o status no banco
  });
}