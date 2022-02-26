const apiEndpoint = 'http://localhost:8000';
const gamesContainer = document.getElementById("games-container");
const gamesList = document.getElementById("games-list");
const gameForm = document.getElementById("games-form");
let backdrop;
let modal;

const displayGameList = (games) => {
  const emptyText = document.getElementById("text-empty-games");
  if (emptyText) gamesContainer.removeChild(emptyText);
  while (gamesList.firstChild) {
    gamesList.removeChild(gamesList.firstChild);
  }
  if (games.length > 0) {
    games.forEach(game => {
      const listItem = document.createElement("li");
      const title = document.createElement("p");
      const score = document.createElement("p");
      const textContainer = document.createElement("div");
      const buttonContainer = document.createElement("div");
      const deleteButton = document.createElement("button");
      const editButton = document.createElement("button");

      listItem.id = `game-${game.id}`;
      title.innerText = game.name;
      score.innerText = game.score || "À disputer";
      score.className = "text-score";
      textContainer.className = "container-text";
      buttonContainer.className = "container-btn-option";
      editButton.className = "btn-option";
      deleteButton.className = "btn-option";
      editButton.innerHTML = '<i class="fa-solid fa-pen editIcon"></i>';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash deleteIcon"></i>';
      editButton.addEventListener('click', () => openModal(game) , false);
      deleteButton.addEventListener('click', () => deleteGame(game) , false);

      textContainer.appendChild(title);
      textContainer.appendChild(score);
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);
      listItem.appendChild(textContainer);
      listItem.appendChild(buttonContainer);
      gamesList.appendChild(listItem);
    })
  } else {
      const newEmptyText = document.createElement("h2");
      newEmptyText.innerText = "Aucune partie";
      newEmptyText.className = "text-empty-games";
      newEmptyText.id = "text-empty-games";
      gamesContainer.appendChild(newEmptyText);
    }
};

const displayGameCount = (count) => {
  const gameCount = document.getElementById("game-count");
  if (gameCount) gamesContainer.removeChild(gameCount);
  const newGameCount = document.createElement("p");
  newGameCount.innerText = `Parties à jouer: ${count}`;
  newGameCount.className = "text-count";
  newGameCount.id = "game-count";
  gamesContainer.insertBefore(newGameCount, gamesList);
};

// Init socket
const socket = io();

// Listen games
socket.on('games', (games) => {
  displayGameList(games);
});

// Listen count
socket.on('count', (count) => {
  displayGameCount(count);
});

// Add game
const addGame = (event) => {
  event.preventDefault();
  const player1 = event.target.elements.player1.value;
  const player2 = event.target.elements.player2.value;
  const game = { player1, player2 };
  fetch(`${apiEndpoint}/game/add`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(game)})
  .then(() => {
    console.log('Partie ajoutée avec succès !')
  })
  .catch((err) => {
    console.error(err)
  });
}

gameForm.onsubmit = addGame;

//Edit game
const editGame = (editedGame) => {
  fetch(`${apiEndpoint}/game/update`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(editedGame)})
  .then(() => {
    console.log('Partie modifiée avec succès !')
  })
  .catch((err) => {
    console.error(err)
  });
}

// Close Edit Modal
const closeModal = () => {
  if (backdrop) {
    backdrop.remove();
  }
  if (modal) {
    modal.remove();
  }
}

// Open Edit Modal
const openModal = ({ name, score, id }) => {
  const playerA = name.split("VS")[0];
  let playerAScore = score ? parseInt(score.split("-")[0]) : null;
  const playerB = name.split("VS")[1];
  let playerBScore = score ? parseInt(score.split("-")[1]) : null;
  backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  backdrop.addEventListener('click', closeModal);
  document.body.insertBefore(backdrop, gamesContainer);
  backdrop.addEventListener('click', closeModal);

  modal = document.createElement('div');
  modal.className = 'modal';

  const modalHeading = document.createElement('h1');
  modalHeading.textContent = 'Modifier la partie';
  modal.appendChild(modalHeading);

  const scoreFormContainer = document.createElement('div');
  scoreFormContainer.className = 'container-modal-form';
  modal.appendChild(scoreFormContainer);

  const scoreInputContainerA = document.createElement('div');
  scoreInputContainerA.className = 'container-modal-input';
  scoreFormContainer.appendChild(scoreInputContainerA);

  const scoreInputA = document.createElement('input');
  scoreInputA.id = `scoreInputA-${id}`;
  scoreInputA.type = "number";
  scoreInputA.min = 0;
  scoreInputA.addEventListener('input', () => {
    playerAScore = scoreInputA.value;
  });
  scoreInputA.value = playerAScore;
  scoreInputContainerA.appendChild(scoreInputA);

  const scoreLabelA = document.createElement('label');
  scoreLabelA.htmlFor = `scoreInputA-${id}`;
  scoreLabelA.innerHTML = `Score de ${playerA}`;
  scoreInputContainerA.insertBefore(scoreLabelA, scoreInputA);

  const scoreInputContainerB = document.createElement('div');
  scoreInputContainerB.className = 'container-modal-input';
  scoreFormContainer.appendChild(scoreInputContainerB);

  const scoreInputB = document.createElement('input');
  scoreInputB.id = `scoreInputB-${id}`;
  scoreInputB.type = "number";
  scoreInputA.min = 0;
  scoreInputB.addEventListener('input', () => {
    playerBScore = scoreInputB.value;
  });
  scoreInputB.value = playerBScore;
  scoreInputContainerB.appendChild(scoreInputB);

  const scoreLabelB = document.createElement('label');
  scoreLabelB.htmlFor = `scoreInputB-${id}`;
  scoreLabelB.innerHTML = `Score de ${playerB}`;
  scoreInputContainerB.insertBefore(scoreLabelB, scoreInputB);

  const modalActionsContainer = document.createElement('div');
  modalActionsContainer.className = 'modal-actions';
  modal.appendChild(modalActionsContainer);

  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.className = 'btn-cancel';
  cancelButton.textContent = 'Annuler';
  cancelButton.addEventListener('click', closeModal);
  modalActionsContainer.appendChild(cancelButton);

  const confirmButton = document.createElement('button');
  confirmButton.setAttribute('type', 'button');
  confirmButton.classList.add('btn-confirm');
  confirmButton.textContent = 'Valider';
  confirmButton.addEventListener('click', () => {
    const newScore = (playerAScore && playerBScore) 
    ? `${playerAScore} - ${playerBScore}` 
    : null;
    editGame({ newScore, id});
    closeModal();
  });
  modalActionsContainer.appendChild(confirmButton);

  document.body.insertBefore(modal, gamesContainer);
}

// Delete game
const deleteGame = ({ id }) => {
  fetch(`${apiEndpoint}/game/delete`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })})
  .then(() => {
    console.log('Partie supprimée avec succès !');
  })
  .catch((err) => {
    console.error(err)
  });
}

// Get count
const getCountNotPlayedGames = () => {
  fetch(`${apiEndpoint}/game/notPlayed`)
  .then((response) => response.json())
  .then((data) => {
    const count = data.rows[0].count;
    displayGameCount(count);
  });
};

getCountNotPlayedGames();

// Get all games
const getAllGames = () => {
  fetch(`${apiEndpoint}/game`)
  .then((response) => response.json())
  .then((data) => {
    const games = data.rows;
    displayGameList(games);
  });  
};

getAllGames();



