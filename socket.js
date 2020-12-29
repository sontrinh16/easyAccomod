const app = require('./app');
const io = app.io;

io.on('connection', socket => {
    socket.on("", (anotherSocketId, msg) => {
        socket.to(anotherSocketId).emit("private message", socket.id, msg);
      });
})
