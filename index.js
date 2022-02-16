const express = require('express');
const bodyParser = require('body-parser');
const { port } = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server is listening on ${port}`);
});