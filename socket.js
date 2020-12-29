const app = require('./app');
const io = app.io;

io.on('connection', socket => {
    console.log(socket.id);
})
