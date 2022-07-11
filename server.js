const path = require('path');
const express = require('express');
const {userJoin, getUser, roomInfo, userLeft} = require('./utils/users');
const formatMessage = require('./utils/message');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 5500/ || process.env.port;
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(path.join(__dirname + '/public')));

const bot = "Chat Bot";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/chat.html'));
});

io.on('connection', (socket) => {
    console.log('New Web Socket Connection Created');

    // new user joining
    socket.on('new-user-join', (newUser) => {
        const user = userJoin(socket.id, newUser.username, newUser.roomname);

        socket.join(user.room);

        // emit a welcome msg
        socket.emit('message', formatMessage(bot, '00', "Welcome to Let's Chat"));

        // TODO: broadcast in that room that user joined
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, '00', `${user.name} has joined the room`));

        // TOD0: Update the room informations
        io.to(user.room).emit('roomUpdate', roomInfo(user.room));
    })

    // listen for incoming messages
    socket.on('chatMessage', (msg) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.name, user.id, msg));
    })
    

    socket.on('disconnect', () => {
        const user = userLeft(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(bot, '00', `${user.name} has left the room`));

            // TODO: update the room informations
            io.to(user.room).emit('roomUpdate', roomInfo(user.room));        }
    })
})


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});