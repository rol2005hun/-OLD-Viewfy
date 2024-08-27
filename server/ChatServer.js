const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

let messages = [];
let users = [];
let index = 0;


io.on('connection', socket => {
    // bejelentkezés
    socket.emit('loggedIn', {
        users: users.map(s => s.username),
        messages: messages
    })
    // csatlakozás
    socket.on('newUser', username => {
        socket.username = username;
        console.log(`${socket.username} belépett a partyba.`);

        users.push(socket);
        io.emit('userOnline', socket.username);
    });

    socket.on('msg', msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }

        messages.push(message);
        socket.broadcast.emit('msg', message);
        index++;
    });

    // lecsatlakozás
    socket.on('disconnect', () => {
        console.log(`${socket.username} kilépett a partyból.`);
        // elmondja a többi felhasználónak hogy kilépett valaki
        io.emit('userLeft', socket.username);
        users.splice(users.indexOf(socket), 1);
    });
});

http.listen(process.env.PORT || 3000, () => {
    console.log(`[Viewfy] A chat backend elindult a(z) ${PORT} porton.`);
})