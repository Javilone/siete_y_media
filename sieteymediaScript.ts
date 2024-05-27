// VARIABLES DE ALMACENAMIENTO Y AUDIO
const soundShuffling: HTMLAudioElement = new Audio("src/shuffling.mp3");
const flipCard: HTMLAudioElement = new Audio("src/sounds/flipcard.mp3");
const gameOff = new Audio("src/sounds/gameoff.mp3");
const music = new Audio("src/sounds/gameMusic.mp3");
const positiveA = new Audio("src/sounds/positiveA.mp3");
const positiveB = new Audio("src/sounds/positiveB.mp3");
const positiveC = new Audio("src/sounds/positiveC.mp3");

let playerScore: number = 0;
let cards = [
  document.getElementById("1") as HTMLImageElement,
  document.getElementById("2") as HTMLImageElement,
  document.getElementById("3") as HTMLImageElement,
  document.getElementById("4") as HTMLImageElement,
  document.getElementById("5") as HTMLImageElement,
  document.getElementById("6") as HTMLImageElement,
  document.getElementById("7") as HTMLImageElement,
  document.getElementById("8") as HTMLImageElement,
  document.getElementById("9") as HTMLImageElement,
  document.getElementById("10") as HTMLImageElement,
];

// ELEMENTOS DEL DOM
const scoreDisplay = document.getElementById("score");
const shuffleButton = document.getElementById("shuffle-button");
const cardBoard = document.getElementById("card-board");
const playBoard = document.getElementById("play-board");
const giveMeButton = document.getElementById("giveMe-button");
const newGameButton = document.getElementById("newGame-button");
const musicIcon = document.getElementById("musicIcon");
const giveUp = document.getElementById("giveUp-button");
const whatIfButton = document.getElementById("whatIf");
const gameOverPanel = document.getElementById("giveUp-panel");

// FUNCIONES

/* playACard obtiene una carta aleatoria de cards y se la entrega a la 
función showPlayedCard */
function playACard(): void {
  const randomIndex = Math.floor(Math.random() * cards.length);
  const randomCard: HTMLImageElement = cards[randomIndex];

  showPlayedCard(randomCard);
  scorePanel();
}

/* showPlayedCard pinta la carta sobre el tablero, 
- pasa a deleteCard() la carta creada para que la elimine y 
- pasa a updatePlayerScore() la carta para que actualize playerScore con su valor */
function showPlayedCard(randomCard: HTMLImageElement): void {
  const showCard: HTMLImageElement = document.createElement("img");
  showCard.src = randomCard.src;
  showCard.alt = randomCard.alt;
  showCard.classList.add("played-card");
  if (playBoard instanceof HTMLDivElement) {
    playBoard.appendChild(showCard);
    flipCard.play();
  }

  deleteCard(randomCard);
  updatePlayerScore(randomCard);
}

// updatePlayerScore actualiza playerScore con las reglas de valores de las cartas
function updatePlayerScore(randomCard: HTMLImageElement) {
  let cardId: number = parseInt(randomCard.id);
  cardId > 7 ? (playerScore += 0.5) : (playerScore += cardId);
}

// scorePanel verifica la puntuación y actúa sobre la partida.
function scorePanel(): void {
  if (scoreDisplay instanceof HTMLHeadingElement) {
    scoreDisplay.innerText = `Puntuación: ${playerScore}`;
  }

  switch (true) {
    case playerScore > 7.5:
      gameOver("loose");
      break;
    case playerScore === 7.5:
      gameOver("win");
      break;
    default:
      break;
  }
}

/* deleteCard elimina la randomCard del array cards para que no se repita más.
También elimina el <img> que contiene dicha carta. */
function deleteCard(randomCard: HTMLImageElement): void {
  const idToDelete = randomCard.id;
  const indexToDelete = cards.findIndex((card) => card.id === idToDelete);

  if (indexToDelete !== -1) {
    cards.splice(indexToDelete, 1);
  }

  if (cardBoard instanceof HTMLDivElement) {
    const cardSubstracted = cardBoard.querySelector(
      `img[src="${randomCard.src}"]`
    );
    if (cardSubstracted) {
      cardBoard.removeChild(cardSubstracted);
    }
  }
}

/* gameOver detiene la partida en función de la puntuación actual. */
function gameOver(message: string): void {
  disabledButtons();
  music.pause();
  const gameOverDiv = document.getElementById("gameOver");
  const gameOverMessage = document.getElementById("gameOverMessage");
  const newGameButton2 = document.getElementById("newGame-button-B");

  if (
    gameOverMessage instanceof HTMLParagraphElement &&
    gameOverDiv instanceof HTMLDivElement &&
    newGameButton2 instanceof HTMLButtonElement
  ) {
    gameOverDiv.classList.add("gameOverPanelOn");
    newGameButton2.addEventListener("click", newGame);

    if (message === "loose") {
      gameOff.play();
      gameOverMessage.innerHTML = "¡PERDISTE!<br>Inténtalo de nuevo.";
    }
    if (message === "win") {
      positiveA.play();
      gameOverMessage.innerHTML = `¡LO HAS CLAVADO!<br>¡Enhorabuena! 👍`;
    }
  }
}

/* iGiveUp detiene la partida y muestra el panel <div> correspondiente de plantarse
con el mensaje apropiado según la puntuación obtenida. */
function iGiveUp(): void {
  disabledButtons();
  music.pause();
  const plantarseDiv = document.getElementById("giveUp-panel");
  const newGameButton3 = document.getElementById("newGame-button-C");
  const texto = document.getElementById("textoPlantarse");
  const messageA: string = `Has sido muy conservador.<br>Te has plantado con ${playerScore} puntos.`;
  const messageB: string = `Te ha entrado el canguelo, ¿eh?<br>Te has plantado con ${playerScore} puntos.`;
  const messageC: string = `Casi casi...<br>Te has plantado con ${playerScore} puntos.`;

  if (
    plantarseDiv instanceof HTMLDivElement &&
    newGameButton3 instanceof HTMLButtonElement &&
    texto instanceof HTMLParagraphElement
  ) {
    plantarseDiv.classList.add("giveUpPanelOn");
    newGameButton3.addEventListener("click", newGame);
    switch (true) {
      case playerScore <= 4.5:
        positiveC.play();
        texto.innerHTML = messageA;
        break;
      case playerScore === 5 || playerScore === 5.5:
        positiveC.play();
        texto.innerHTML = messageB;
        break;
      case playerScore >= 6 && playerScore <= 7:
        positiveB.play();
        texto.innerHTML = messageC;
        break;
      default:
        break;
    }
  }
}

/* whatIf muestra la carta que podía haber salido de seguir jugando.
Similar a showPlayedCard, añadiendo una clase de CSS distinta a la carta
en el panel <div> correspondiente. */
function whatIf(): void {
  const randomIndex = Math.floor(Math.random() * cards.length);
  const randomCard: HTMLImageElement = cards[randomIndex];
  const showCard: HTMLImageElement = document.createElement("img");
  showCard.src = randomCard.src;
  showCard.alt = randomCard.alt;
  showCard.classList.add("whatIfCard");

  const whatIfText = document.createElement("p");
  whatIfText.classList.add("whatIfText");
  whatIfText.innerHTML = `Pues que hubieses sacado un: `;

  if (
    gameOverPanel instanceof HTMLDivElement &&
    whatIfButton instanceof HTMLButtonElement
  ) {
    whatIfButton.disabled = true;
    flipCard.play();
    gameOverPanel.appendChild(whatIfText);
    gameOverPanel.appendChild(showCard);
    deleteCard(randomCard);
  }
}

/* Simplemente recarga la página */
const newGame = () => {
  location.reload();
};

/* Habilidad o deshabilita la música de fondo */
function playMusic(): void {
  music.paused
    ? (music.play(), (music.volume = 0.5), (music.loop = true))
    : music.pause();
}

// Shuffle es una animación que simula barajar las cartas
function shuffle(): void {
  if (cardBoard instanceof HTMLDivElement) {
    cardBoard.classList.remove("card-board");
    // Asi obligo al navegador a reiniciar la animación
    cardBoard.offsetWidth;
    cardBoard.classList.add("card-board");
    soundShuffling.play();
  }
}

/* disabledButtons inhabilita algunos botones de la interfaz */
function disabledButtons(): void {
  if (
    shuffleButton instanceof HTMLButtonElement &&
    giveMeButton instanceof HTMLButtonElement &&
    giveUp instanceof HTMLButtonElement
  ) {
    shuffleButton.disabled = true;
    giveMeButton.disabled = true;
    giveUp.disabled = true;
  }
}

// ASIGNACIÓN DE FUNCIONES A LOS ELEMENTOS
if (scoreDisplay instanceof HTMLHeadingElement) {
  document.addEventListener("DOMContentLoaded", () => scorePanel());
}

if (shuffleButton instanceof HTMLButtonElement) {
  shuffleButton.addEventListener("click", shuffle);
}

if (giveMeButton instanceof HTMLButtonElement) {
  giveMeButton.addEventListener("click", playACard);
}

if (giveUp instanceof HTMLButtonElement) {
  giveUp.addEventListener("click", iGiveUp);
}

if (newGameButton instanceof HTMLButtonElement) {
  newGameButton.addEventListener("click", newGame);
}

if (musicIcon instanceof HTMLImageElement) {
  musicIcon.addEventListener("click", playMusic);
}

if (whatIfButton instanceof HTMLButtonElement) {
  whatIfButton.addEventListener("click", whatIf);
}

playMusic();
