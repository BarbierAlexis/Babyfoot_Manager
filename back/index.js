const express = require('express');
const bodyParser = require('body-parser');
const { port } = require('./config');
const gameRouter = require('./routes/game');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/game', gameRouter);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server is listening on ${port}`);
});