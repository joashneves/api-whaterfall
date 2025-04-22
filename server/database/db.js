import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://root:example@localhost:27017/chatDB?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
