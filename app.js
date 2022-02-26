const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRouter = require('./controllers/game');

const port = 8000;

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use('/game', gameRouter);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', (socket) => {
  console.log('Utilisateur connecté')
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

global.io = io;

server.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Application lancée 🚀`);
  console.log(`Vous pouvez suivre ce lien pour accéder à l'application: http://localhost:${port}`);
});