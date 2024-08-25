import { GiftSkin } from "./gift.js";

const gameState = {
  idsCharacters: [],
  idsCharactersPrevious: [],
  correctCard: null,
  factorValue: randomize(),
  actualValue: 1,
  amountToGift: 5,
  gifts: [],
};

const giftsKeyName = "gifts";
const amountToGift = 5;
const apiUrl = "https://rickandmortyapi.com/api/character/";
const cardImageId = "card-img-";
const querySelectorCard = ".card";
const pathCard =
  "https://raw.githubusercontent.com/VictorSantos09/BetMania/main/assets/card.png";
const amountCards = 3;
const largeAwaitTimeMs = 4500;
const mediumAwaitTimeMs = largeAwaitTimeMs / 2;
const smallAwaitTime = mediumAwaitTimeMs / 2;

const btnPlay = document.getElementById("play");
const actualValueSpan = document.getElementById("actualValue");
const factorValueSpan = document.getElementById("factor");

// Inicializa valores de UI e configura o botão de play
updateValuesUI();
setPlayButton();
setImageTexture();

//#region Shuffle
function shuffleCards() {
  const cardContainer = document.querySelector("main");
  const cards = Array.from(getCards());
  const shuffledArray = shuffleArray(cards);

  const fragment = document.createDocumentFragment();
  shuffledArray.forEach((card) => fragment.appendChild(card));
  cardContainer.innerHTML = "";
  cardContainer.appendChild(fragment);

  function shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex > 0) {
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
    if (!response.ok) throw new Error("Falha na requisição da API");
    const data = await response.json();
    if (data.length < amountCards)
      throw new Error("Número insuficiente de personagens");

    data.slice(0, amountCards).forEach((character, index) => {
      const cardImg = document.getElementById(cardImageId + (index + 1));
      const cardImgBack = document.getElementById(
        "card-img-back-" + (index + 1)
      );

      if (cardImg && cardImgBack) {
        cardImg.src = character.image;
        cardImg.alt = character.name;
        cardImgBack.src = character.image;
        cardImgBack.alt = character.name;
      }
    });
  } catch (error) {
    console.error("Erro ao definir imagem dos personagens:", error);
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
  if (factor <= 0) {
    throw new Error("O valor do fator deve ser maior que 0");
  }
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % factor;
}

async function changeCardImage(src) {
  let imgId = 1;
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error("Problema na resposta do servidor");
    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);

    for (let index = 0; index < amountCards; index++) {
      const cardImg = document.getElementById(cardImageId + imgId);
      if (cardImg) {
        cardImg.src = imageObjectURL;
        imgId++;
      }
    }
  } catch (error) {
    console.error("Não foi possível fazer a requisição da imagem:", error);
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

    countDown(largeAwaitTimeMs);
    await showCorrectAnswerTemporary();

    await new Promise((resolve) => {
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
    card.addEventListener("click", async () => {
      flipCard(card);

      await new Promise((resolve) => {
        setTimeout(async () => {
          countDown(largeAwaitTimeMs);
          await continuar(card);
          undoFlipCard(card);
          resolve();
        }, smallAwaitTime);
      });
    });
  });

  async function continuar(card) {
    gameState.actualValue = parseFloat(gameState.actualValue);

    if (card === gameState.correctCard) {
      await showCorrectAnswerTemporary();
      gameState.amountToGift--;

      gameState.actualValue =
        gameState.actualValue <= 0 || !gameState.actualValue
          ? 1
          : parseFloat(
              gameState.actualValue +
                gameState.actualValue * (gameState.factorValue / 100)
            ).toFixed(2);

      if (gameState.amountToGift <= 0) {
        await getNewGift();
        gameState.amountToGift = amountToGift;
      }
    } else {
      deleteGifts();

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

    await new Promise((resolve) => {
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
  if (gameState.correctCard) {
    gameState.correctCard.classList.add("correct-answer");
  }
}

function hideCorrectAnswer() {
  if (gameState.correctCard) {
    gameState.correctCard.classList.remove("correct-answer");
  }
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
  gameState.factorValue = randomize();

  factorValueSpan.innerHTML = `${gameState.factorValue}%`;
  actualValueSpan.innerHTML = `R$ ${parseFloat(gameState.actualValue).toFixed(
    2
  )}`;

  gameState.gifts = getGifts();
  if (!gameState.gifts) gameState.gifts = [];

  let amountGifts = 0;
  if (gameState.gifts.length > 0) amountGifts = gameState.gifts.length;

  document.getElementById(
    "amountGifts"
  ).innerHTML = `Você possui ${amountGifts}`;

  document.getElementById(
    "amountToGift"
  ).innerHTML = `Acerte ${gameState.amountToGift} para o próximo`;
}

//#region Contagem
function countDown(factor) {
  const countDown = document.getElementById("countdown");
  let count = factor / 1000;
  countDown.innerHTML = appendSeconds(count);
  const interval = setInterval(() => {
    count--;
    countDown.innerHTML = appendSeconds(count);
    if (count <= 0) {
      clearInterval(interval);
      countDown.innerHTML = "";
    }
  }, 1000);

  function appendSeconds(count) {
    return count + "s";
  }
}
//#endregion

//#region Gift
async function getNewGift() {
  const response = await fetch("../../../public/skins-csgo.json");
  const data = await response.json();
  const randomIndex = randomize(data.length);
  const randomSkin = data[randomIndex];

  gameState.gifts.push(randomSkin);
  saveGift();
  showGifts();
}

function getGifts() {
  return JSON.parse(localStorage.getItem(giftsKeyName));
}

function saveGift() {
  localStorage.setItem(giftsKeyName, JSON.stringify(gameState.gifts));
}

function showGifts() {
  const modal = document.getElementById("myModal");
  const closeBtn = document.querySelector(".close");
  const closeModalBtn = document.getElementById("closeModalBtn");

  gameState.gifts = getGifts();

  const containerGift = document.getElementById("gift-container");

  // Remove os gifts anteriores
  while (containerGift.firstChild) {
    containerGift.removeChild(containerGift.firstChild);
  }

  // Adiciona os gifts atuais
  gameState.gifts.forEach((gift) => {
    const objGift = new GiftSkin(gift);

    const giftElement = document.createElement("div");
    giftElement.classList.add("gift");

    const giftTitle = document.createElement("h3");
    giftTitle.textContent = objGift.name;
    giftElement.appendChild(giftTitle);

    const giftDescription = document.createElement("p");
    giftDescription.textContent = objGift.description;
    giftElement.appendChild(giftDescription);

    const giftImage = document.createElement("img");
    giftImage.src = objGift.image;
    giftImage.alt = objGift.name;
    giftElement.appendChild(giftImage);
    containerGift.appendChild(giftElement);
  });

  // Exibe o modal
  modal.style.display = "block";

  // Função para fechar o modal
  function closeModal() {
    modal.style.display = "none";
  }

  // Evento de clique no botão de fechar (X)
  closeBtn.onclick = closeModal;

  // Evento de clique no botão "Fechar"
  closeModalBtn.onclick = closeModal;

  // Fecha o modal se clicar fora dele
  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

function deleteGifts() {
  gameState.gifts = [];
  gameState.amountToGift = amountToGift;
  localStorage.removeItem(giftsKeyName);
}
//#endregion
