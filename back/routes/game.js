const express = require('express');
const client = require('../databasepg');

const router = express.Router();
client.connect();

// Get all games
router.get('/', (req, res) => {
  client.query('SELECT * FROM game', (err, response) => {
    if (err) {
      console.error(err);        
      res.status(400).send('Erreur lors de la récupération des parties');
    } else {
      res.send(response);
    }
    client.end;
  });
});

// Get count not played games
router.get('/notPlayed', (req, res) => {
  client.query('SELECT COUNT (*) FROM game WHERE score IS NULL', (err, response) => {
    if (err) {
      console.error(err);        
      res.status(400).send('Erreur lors du comptage des parties non jouées');
    } else {
      res.send(response);
    }
    client.end;
  });
});

// Create game
router.post('/add', (req, res) => {
  if (req.body) {
    const { player1, player2, score } = req.body;
    if (!player1 || !player2) {
      res.sendStatus(400);
    } else {
      const name = `${player1} VS ${player2}`;
      client.query(`INSERT INTO game (name, score)
        VALUES ($1, $2)`, [ name, score ],
      (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  } else {
    res.sendStatus(400);
  }
});

// Update game
router.post('/update', (req, res) => {
  if (req.body) {
    const { newScore, id } = req.body;
    if (!newScore || !id) {
      res.sendStatus(400);
    } else {
      client.query(`UPDATE game SET score = $1 WHERE id = $2`, [ newScore, id ],
      (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  } else {
    res.sendStatus(400);
  }
});

// Delete game
router.post('/delete', (req, res) => {
  if (req.body) {
    const { id } = req.body;
    if (!id) {
      res.sendStatus(400);
    } else {
      client.query(`DELETE FROM game WHERE id = $1`, [ id ],
      (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
