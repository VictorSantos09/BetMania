const gameState = {
  idsCharacters: [],
  idsCharactersPrevious: [],
  correctCard: null,
  factorValue: randomize(),
  actualValue: 1,
};

const apiUrl = "https://rickandmortyapi.com/api/character/";
const cardImageId = "card-img-";
const querySelectorCard = ".card";
const pathCard =
  "https://raw.githubusercontent.com/VictorSantos09/BetMania/main/assets/card.png";
const btnPlay = document.getElementById("play");
const actualValueSpan = document.getElementById("actualValue");
const factorValueSpan = document.getElementById("factor");
const amountCards = 3;
const largeAwaitTimeMs = 4500;
const mediumAwaitTimeMs = largeAwaitTimeMs / 2;
const smallAwaitTime = mediumAwaitTimeMs / 2;

updateValuesUI();
setPlayButton();
setImageTexture();

//#region Shuffle
function shuffleCards() {
  const cardContainer = document.querySelector("main");
  const cards = getCards();

  const shuffledArray = shuffleArray(Array.from(cards));

  cardContainer.innerHTML = "";
  shuffledArray.forEach((card) => {
    cardContainer.appendChild(card);
  });

  function shuffleArray(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = randomize(currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
//#endregion

//#region Set Image Character
async function setImageCharacter() {
  try {
    const response = await fetch(getApiUrlBuild());
    const data = await response.json();
    if (data.length < amountCards) {
      throw new Error("Número insuficiente de personagens retornados pela API");
    }

    for (let index = 0; index < amountCards; index++) {
      const character = data[index];
      const cardImg = document.getElementById(cardImageId + (index + 1));
      const cardImgBack = document.getElementById(
        "card-img-back-" + (index + 1)
      );

      cardImg.src = character.image;
      cardImg.alt = character.name;
      cardImgBack.src = character.image;
      cardImgBack.alt = character.name;
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

function getApiUrlBuild() {
  return apiUrl + gameState.idsCharacters.join(",");
}

function setRandomIds() {
  gameState.idsCharactersPrevious = [...gameState.idsCharacters];
  gameState.idsCharacters = [];

  const maxCharactersApi = 826;

  while (gameState.idsCharacters.length < amountCards) {
    const randomId = randomize(maxCharactersApi) + 1;
    if (!gameState.idsCharacters.includes(randomId)) {
      gameState.idsCharacters.push(randomId);
    }
  }
}
//#endregion

//#region Set Image Texture
async function setImageTexture() {
  await changeCardImage(pathCard);
}
//#endregion

//#region Utils
function showCorrectAnswerTemporary() {
  return new Promise((resolve) => {
    showCorrectAnswer();
    setTimeout(() => {
      hideCorrectAnswer();
      resolve();
    }, smallAwaitTime);
  });
}

function showBothWrongCorrectTemporary(card) {
  return new Promise((resolve) => {
    showCorrectAnswer();
    showWrongAnswer(card);
    setTimeout(() => {
      hideCorrectAnswer();
      hideWrongAnswer(card);
      resolve();
    }, smallAwaitTime);
  });
}

function getCards() {
  return document.querySelectorAll(querySelectorCard);
}

function flipCard(card) {
  card.querySelector(".card-inner").classList.toggle("card-flip");
}

function undoFlipCard(card) {
  const cardInner = card.querySelector(".card-inner");
  cardInner.classList.toggle("card-flip");
}

function randomize(factor = 100) {
  return Math.floor(Math.random() * factor);
}

async function changeCardImage(src) {
  let imgId = 1;

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error("Problema na resposta do servidor");
    }
    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);

    for (let index = 0; index < amountCards; index++) {
      const cardImg = document.getElementById(cardImageId + imgId);
      cardImg.src = imageObjectURL;
      imgId++;
    }
  } catch (error) {
    console.error("Não foi possível fazer a requisição:", error);
  }
}
//#endregion

//#region Rules
function setPlayButton() {
  btnPlay.addEventListener("click", async () => {
    hidePlayButton();
    setRandomIds();
    await setImageCharacter();
    setCorrectAnswer();
    await showCorrectAnswerTemporary();

    return new Promise((resolve) => {
      setTimeout(async () => {
        hideCorrectAnswer();
        await setImageTexture();
        shuffleCards();
        setCardClick();
        resolve();
      }, largeAwaitTimeMs);
    });
  });
}

function hidePlayButton() {
  btnPlay.style.display = "none";
}

function setCardClick() {
  const cards = getCards();

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      flipCard(card);

      setTimeout(async () => {
        await continuar(card);
        undoFlipCard(card);
      }, smallAwaitTime);
    });
  });

  async function continuar(card) {
    if (card === gameState.correctCard) {
      await showCorrectAnswerTemporary();

      gameState.actualValue =
        gameState.actualValue <= 0 || !gameState.actualValue
          ? 1
          : parseFloat(
              gameState.actualValue +
                gameState.actualValue * (gameState.factorValue / 100)
            ).toFixed(2);
    } else {
      await showBothWrongCorrectTemporary(card);

      gameState.actualValue =
        gameState.actualValue <= 0 || !gameState.actualValue
          ? 0
          : parseFloat(
              gameState.actualValue -
                gameState.actualValue * (gameState.factorValue / 100)
            ).toFixed(2);
    }

    updateValuesUI();
    setRandomIds();
    await setImageCharacter();
    setCorrectAnswer();
    showCorrectAnswer();

    return new Promise((resolve) => {
      setTimeout(async () => {
        hideCorrectAnswer();
        await setImageTexture();
        shuffleCards();
        resolve();
      }, largeAwaitTimeMs / 2);
    });
  }
}
//#endregion

//#region Correct Answer
function setCorrectAnswer() {
  const cards = getCards();
  const randomIndex = randomize(cards.length);
  gameState.correctCard = cards[randomIndex];
}

function showCorrectAnswer() {
  gameState.correctCard.classList.add("correct-answer");
}

function hideCorrectAnswer() {
  gameState.correctCard.classList.remove("correct-answer");
}
//#endregion

//#region Wrong Answer
function showWrongAnswer(wrongCard) {
  wrongCard.classList.add("wrong-answer");
}

function hideWrongAnswer(wrongCard) {
  wrongCard.classList.remove("wrong-answer");
}
//#endregion

function updateValuesUI() {
  factorValueSpan.innerHTML = `${gameState.factorValue}%`;
  actualValueSpan.innerHTML = `R$ ${parseFloat(gameState.actualValue).toFixed(
    2
  )}`;
}
