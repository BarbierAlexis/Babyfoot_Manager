const client = require('./databasepg');

client.connect();

const query = `CREATE TABLE IF NOT EXISTS game (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    score TEXT NULL
  );`;

client.query(query, [], (err) => {
  if (err) {
    console.error('erreur', err.message);
  } else {
      console.log('Initialisation de la base de données réussie !')
  }
  client.end();
});