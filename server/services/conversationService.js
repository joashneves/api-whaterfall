const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

class ConversationService {
  static async createConversation(participants) {
    const conversation = new Conversation({ participants });
    return await conversation.save();
  }
  
  static async addMessage(conversationId, senderId, content) {
    const message = new Message({
      conversationId,
      sender: senderId,
      content
    });
    
    const savedMessage = await message.save();
    
    // Atualizar última mensagem da conversa
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: savedMessage._id
    });
    
    return savedMessage;
  }
  
  static async getUserConversations(userId) {
    return await Conversation.find({ participants: userId })
      .populate('participants', 'username avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
  }
  
  static async getConversationMessages(conversationId) {
    return await Message.find({ conversationId })
      .populate('sender', 'username avatar')
      .sort({ timestamp: 1 });
  }
}

module.exports = ConversationService;