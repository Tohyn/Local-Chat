const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const hostname = '127.0.0.1';
const port = 8080;

let socketClients = [];
const messages = [];

//fonctions
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}



app.use((express.static('public')));
app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
})

io.on('connection', (socket) => {
    console.dir(socket.id);
    socket.emit('init', {
        msg: "Bonjour from serveur"
    })
    socket.on('newGlobalMessage', (data) => {
        data.id = socket.id;
        messages.push(data);
        // TRI
        socketClients.push({
            pseudo: data.pseudo,
            id: data.id
        });
        // usage example:
        socketClients = socketClients.filter(onlyUnique);
       
        // io.emit envoi à TOUS les clients connectés
        io.emit("clienListUpdate", {
            data: socketClients
        });

        socket.broadcast.emit("newGlobalMessageForAll", data);
        console.dir(messages);
    });
});


server.listen(port, hostname, () => {
    console.log('server runnig at http://' + hostname + ':' + port)
});