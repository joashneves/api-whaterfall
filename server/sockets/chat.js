import ChatService from '../services/chatServices.js'; // ajuste o caminho conforme sua estrutura

export default function setupChatSockets(socket, io) {
  // Entrar em grupos
  socket.on('joinGroups', async (groupIds) => {
    console.log('Usuário entrando nos grupos:', groupIds);

    try {
      groupIds.forEach(groupId => {
        socket.join(`group_${groupId}`);
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Mensagem para grupo
  socket.on('groupMessage', async (data) => {
    try {
      const { groupId, senderId, content } = data;
      console.log("Mensagem recebida no backend:", { groupId, senderId, content });
      
      // Salvar no banco
      const savedMessage = await ChatService.addGroupMessage(groupId, senderId, content);

      console.log("Mensagem salva:", savedMessage); // ✅ agora sim, ela existe

      io.to(`group_${groupId}`).emit('newGroupMessage', {
        id: savedMessage._id.toString(),
        text: savedMessage.content,
        sender: savedMessage.sender.toString(),
        timestamp: savedMessage.createdAt,
        groupId: savedMessage.group.toString(),
      });
      

      } catch (error) {
      console.error('chatError', error.message)
      socket.emit('chatError', error.message);
    }
  });
}