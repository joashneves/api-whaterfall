const io = require('socket.io-mock');
const ChatService = require('/server/services/chatServices'); // Certifique-se de que o caminho está correto

jest.mock('../services/chatServices.js'); // Mocka o serviço do Chat

describe('Chat Socket Events', () => {
  let mockSocket;
  let mockIo;

  beforeEach(() => {
    mockSocket = new io.Socket(); // Criando uma instância mock do socket
    mockIo = new io.Server(); // Criando uma instância mock do io
    setupChatSockets(mockSocket, mockIo); // Configurando o serviço de chat
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpar mocks entre os testes
  });

  test('deve entrar nos grupos corretamente quando joinGroups é emitido', () => {
    const groupIds = ['group_1', 'group_2'];

    // Simula o evento 'joinGroups' que é disparado pelo socket
    mockSocket.emit('joinGroups', groupIds);

    // Verifica se o socket entrou nos grupos corretos
    expect(mockSocket.join).toHaveBeenCalledTimes(groupIds.length); // Espera que o join tenha sido chamado para cada grupo
    groupIds.forEach(groupId => {
      expect(mockSocket.join).toHaveBeenCalledWith(groupId); // Verifica se o grupo foi passado para o método join
    });
  });

  test('deve enviar uma mensagem para o grupo e salvar a mensagem no banco', async () => {
    const groupId = 'group_1';
    const senderId = 'user_1';
    const content = 'Mensagem de teste';

    // Mockando o serviço de Chat
    const savedMessage = {
      _id: '12345',
      content,
      sender: senderId,
      group: groupId,
      createdAt: new Date(),
    };
    ChatService.addGroupMessage.mockResolvedValue(savedMessage);

    // Simula o evento 'groupMessage'
    await mockSocket.emit('groupMessage', { groupId, senderId, content });

    // Verifica se a mensagem foi salva no banco
    expect(ChatService.addGroupMessage).toHaveBeenCalledWith(groupId, senderId, content);

    // Verifica se a mensagem foi emitida para todos no grupo
    expect(mockIo.to).toHaveBeenCalledWith(groupId);
    expect(mockIo.emit).toHaveBeenCalledWith('newGroupMessage', {
      id: savedMessage._id.toString(),
      text: savedMessage.content,
      sender: savedMessage.sender.toString(),
      timestamp: savedMessage.createdAt,
      groupId: savedMessage.group.toString(),
    });
  });

  test('deve capturar erros e emitir "chatError" no socket', async () => {
    const groupId = 'group_1';
    const senderId = 'user_1';
    const content = 'Mensagem de erro';

    const errorMessage = 'Erro ao salvar a mensagem';

    // Simulando um erro no serviço de Chat
    ChatService.addGroupMessage.mockRejectedValue(new Error(errorMessage));

    // Simula o evento 'groupMessage' com erro
    await mockSocket.emit('groupMessage', { groupId, senderId, content });

    // Verifica se o erro foi emitido no socket
    expect(mockSocket.emit).toHaveBeenCalledWith('chatError', errorMessage);
  });
});
