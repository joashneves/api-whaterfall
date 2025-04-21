import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

class ChatService {
  static async addMessage(conversationId, senderId, content) {
    const message = new Message({
      conversationId,
      sender: senderId,
      content
    });
    
    const savedMessage = await message.save();
    
    // Atualizar última mensagem da conversa
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: savedMessage._id,
      updatedAt: new Date()
    });
    
    return savedMessage;
  }
  
  static async markMessageAsRead(messageId, userId) {
    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { readBy: userId }
    });
  }
  
  static async getUserConversations(userId) {
    return await Conversation.find({ participants: userId })
      .populate("participants", "username avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
  }
}

export default ChatService;