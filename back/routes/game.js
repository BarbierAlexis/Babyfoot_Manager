const express = require('express');
const client = require('../databasepg');

const router = express.Router();
client.connect();

router.get('/', (req, res) => {
  client.query('Select * from game', (err, response) => {
    if (err) {
      console.error(err);        
      res.status(400).send('Erreur lors de la récupération des parties');
    } else {
      res.send(response);
    }
    client.end;
  });
});

module.exports = router;
