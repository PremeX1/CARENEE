const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    console.log(req.query.id + " Connected to Chat")
    res.sendFile(__dirname + `/index.html`);
});

app.get('/request', (req, res) => {
  res.sendFile(__dirname + `/form_request.html`);
});

io.on('connection', (socket) => {
    console.log("Connect Complete !")
  socket.on('chat message', (msg, username) => {
    io.emit('chat message', msg+username);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
