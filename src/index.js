const apiEndpoint = 'http://localhost:8000';
const gamesContainer = document.getElementById("games-container");
const gamesList = document.getElementById("games-list");
const gameForm = document.getElementById("games-form");
let backdrop;
let modal;

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

const closeModal = () => {
  if (backdrop) {
    backdrop.remove();
  }
  if (modal) {
    modal.remove();
  }
}

const openModal = (game) => {
  console.log(game)
  const playerA = game.name.split("VS")[0];
  const playerAScore = game.score ? game.score.split("-")[0] : '';
  let newPlayerAScore = '';
  const playerB = game.name.split("VS")[1];
  const playerBScore = game.score ? game.score.split("-")[1] : '';
  let newPlayerBScore = '';
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
  scoreInputA.id = `scoreInputA-${game.id}`;
  scoreInputA.addEventListener('input', function() {
    newPlayerAScore = scoreInputA.value;
  });
  scoreInputA.value = playerAScore;
  scoreInputContainerA.appendChild(scoreInputA);

  const scoreLabelA = document.createElement('label');
  scoreLabelA.htmlFor = `scoreInputA-${game.id}`;
  scoreLabelA.innerHTML = `Score de ${playerA}`;
  scoreInputContainerA.insertBefore(scoreLabelA, scoreInputA);

  const scoreInputContainerB = document.createElement('div');
  scoreInputContainerB.className = 'container-modal-input';
  scoreFormContainer.appendChild(scoreInputContainerB);

  const scoreInputB = document.createElement('input');
  scoreInputB.id = `scoreInputB-${game.id}`;
  scoreInputB.addEventListener('input', function() {
    newPlayerBScore = scoreInputB.value;
  });
  scoreInputB.value = playerBScore;
  scoreInputContainerB.appendChild(scoreInputB);

  const scoreLabelB = document.createElement('label');
  scoreLabelB.htmlFor = `scoreInputB-${game.id}`;
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
  confirmButton.addEventListener('click', function() {
    closeModal();
    if (newPlayerAScore.trim().length > 0 && newPlayerBScore.trim().length > 0) {
      const newScore = `${newPlayerAScore} - ${newPlayerBScore}`;
      editGame({ newScore, id: game.id});
    }
  });
  modalActionsContainer.appendChild(confirmButton);

  document.body.insertBefore(modal, gamesContainer);

}

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

const getCountNotPlayedGames = () => {
  fetch(`${apiEndpoint}/game/notPlayed`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    const gamesNotPlayed = document.createElement("p");
  gamesNotPlayed.innerText = `Parties à jouer: ${data.rows[0].count}`;
  gamesNotPlayed.className = "text-count";
  gamesContainer.insertBefore(gamesNotPlayed, gamesList);
  })
}

getCountNotPlayedGames();

const getAllGames = async () => {
  fetch(`${apiEndpoint}/game`)
  .then((response) => response.json())
  .then((data) => {
    const games = data.rows;
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
    });
    } else {
      const emptyText = document.createElement("p");
      emptyText.innerText = "Aucune partie";
      gamesContainer.appendChild(emptyText);
    }
  });  
};

getAllGames();



