import Message from "../models/Message.js";
import Group from "../models/Group.js"; // Modelo de grupos

class ChatService {
  /**
   * Adiciona uma nova mensagem em um grupo
   * @param {string} groupId - ID do grupo
   * @param {string} senderId - ID do remetente
   * @param {string} content - Conteúdo da mensagem
   * @returns {Promise<Message>} - Mensagem salva
   */
  static async addGroupMessage(groupId, senderId, content) {
    // Cria nova mensagem do tipo grupo
    const message = new Message({
      group: groupId,
      sender: senderId,
      content,
      isGroup: true
    });

    // Salva no banco de dados
    const savedMessage = await message.save();

    // Atualiza os dados do grupo com a última mensagem enviada
    await Group.findByIdAndUpdate(groupId, {
      lastMessage: savedMessage._id,
      updatedAt: new Date()
    });

    // Retorna a mensagem salva
    return savedMessage;
  }

  /**
   * Busca mensagens de um grupo com paginação
   * @param {string} groupId - ID do grupo
   * @param {number} page - Página atual
   * @param {number} limit - Quantidade de mensagens por página
   * @returns {Promise<Message[]>}
   */
  static async getGroupMessages(groupId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    return await Message.find({ group: groupId })
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .skip(skip)
      .limit(limit)
      .populate("sender", "username avatar"); // Preenche os dados do remetente
  }

  /**
   * Retorna os grupos que o usuário participa
   * @param {string} userId - ID do usuário
   * @returns {Promise<Group[]>}
   */
  static async getUserGroups(userId) {
    return await Group.find({ members: userId })
      .populate("members", "username avatar") // Preenche os membros
      .populate("lastMessage") // Preenche a última mensagem
      .sort({ updatedAt: -1 }); // Ordena pelo grupo mais recente
  }

  /**
   * Cria um novo grupo
   * @param {string} name - Nome do grupo
   * @param {string} creatorId - ID do criador
   * @param {string[]} members - Lista de IDs dos membros
   * @returns {Promise<Group>}
   */
  static async createGroup(name, creatorId, members = []) {
    // Garante que o criador esteja na lista de membros
    const allMembers = [...new Set([creatorId, ...members])];

    const group = new Group({
      name,
      creator: creatorId,
      members: allMembers,
      admins: [creatorId] // Criador já é admin
    });

    return await group.save();
  }

  /**
   * Adiciona um membro a um grupo
   * @param {string} groupId - ID do grupo
   * @param {string} userId - ID do usuário a ser adicionado
   */
  static async addGroupMember(groupId, userId) {
    await Group.findByIdAndUpdate(groupId, {
      $addToSet: { members: userId } // Evita duplicidade
    });
  }

  /**
   * Remove um membro de um grupo
   * @param {string} groupId - ID do grupo
   * @param {string} userId - ID do usuário a ser removido
   */
  static async removeGroupMember(groupId, userId) {
    await Group.findByIdAndUpdate(groupId, {
      $pull: {
        members: userId,
        admins: userId // Remove também se for admin
      }
    });
  }
}

export default ChatService;
