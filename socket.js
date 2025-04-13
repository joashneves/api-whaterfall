import io from "./index.js";

io.on("connection", (socket) => {
  console.log('Cliente conectou o ID : ', socket.id );

  socket.on("enviar_mensagem", (texto) =>{
    console.log(texto)
    socket.broadcast.emit("atualizar_mensagem", texto)
  })
});
 