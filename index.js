const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'))

let users = [];

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.emit('userId', socket.id)


    socket.on('user', login => {
        users.push(login)
        console.log(login)
        // io.emit('user', users);
        io.emit('connect message', `${login.name} viens de se connecter`)
    })

    socket.on('chat message', msg => {
        io.emit('chat message', msg);

    });


    socket.on('disconnect', () => {
        const index = users.findIndex(user => user.userId === socket.id)

        if (index !== -1) {
            io.emit('connect message', ` ${users[index].name} viens de se deconnecter`)
            users.splice(index, 1)
        }


    })
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});