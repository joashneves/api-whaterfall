import { jest } from '@jest/globals';
import ChatService from '../../services/chatService.js';
import Message from '../../models/Message.js';
import Conversation from '../../models/Conversation.js';

// Mock dos modelos
jest.mock('../../models/Message.js');
jest.mock('../../models/Conversation.js');

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMessage', () => {
    test('deve adicionar uma mensagem e atualizar a conversa', async () => {
      const mockMessage = {
        _id: 'msg1',
        conversationId: 'conv1',
        sender: 'user1',
        content: 'Teste',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Message.mockReturnValue(mockMessage);
      Conversation.findByIdAndUpdate.mockResolvedValue(true);
      
      const result = await ChatService.addMessage('conv1', 'user1', 'Teste');
      
      expect(Message).toHaveBeenCalledWith({
        conversationId: 'conv1',
        sender: 'user1',
        content: 'Teste'
      });
      expect(mockMessage.save).toHaveBeenCalled();
      expect(Conversation.findByIdAndUpdate).toHaveBeenCalledWith(
        'conv1',
        { lastMessage: 'msg1', updatedAt: expect.any(Date) }
      );
      expect(result).toEqual(mockMessage);
    });
  });

  describe('markMessageAsRead', () => {
    test('deve marcar mensagem como lida', async () => {
      Message.findByIdAndUpdate.mockResolvedValue(true);
      
      await ChatService.markMessageAsRead('msg1', 'user1');
      
      expect(Message.findByIdAndUpdate).toHaveBeenCalledWith(
        'msg1',
        { $addToSet: { readBy: 'user1' } }
      );
    });
  });

  describe('getUserConversations', () => {
    test('deve retornar conversas do usuário', async () => {
      const mockConversations = [{ _id: 'conv1' }];
      Conversation.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockConversations)
          })
        })
      });
      
      const result = await ChatService.getUserConversations('user1');
      
      expect(Conversation.find).toHaveBeenCalledWith({ participants: 'user1' });
      expect(result).toEqual(mockConversations);
    });
  });
});