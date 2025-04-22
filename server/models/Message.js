import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId, // <-- aqui é o foco!
    ref: 'User', // ou outro nome do seu model de usuário
    required: true
  },
  group: {
    type: Schema.Types.ObjectId, // <-- outro foco!
    ref: 'Group',
    required: function () {
      return this.isGroup === true;
    }
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: function () {
      return this.isGroup === false;
    }
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Message', messageSchema);
