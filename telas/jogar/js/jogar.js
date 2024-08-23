let idsCharacters = [];
let idsCharactersPrevious = [];
let correctCard;
const apiUrl = "https://rickandmortyapi.com/api/character/";
const cardImageId = "card-img-";
const querySelectorCard = ".card";
const pathCard =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Playing_card_spade_7.svg/384px-Playing_card_spade_7.svg.png";
const btnPlay = document.getElementById("play");
const actualValueSpan = document.getElementById("actualValue");
const factorValueSpan = document.getElementById("factor");
let factorValue = randomize();
let actualValue = factorValue / 100 + 1;
const amountCards = 3;
const awaitTimeMs = 5000;

actualValueSpan.innerHTML = `R$ ${actualValue.toFixed(2)}`;
factorValueSpan.innerHTML = `${factorValue}%`;

setPlayButton();
setImageTexture();

//#region Shuffle
function shuffleCards() {
  let cardContainer = document.querySelector("main");
  let cards = getCards();

  let cardsArray = Array.from(cards);
  let shuffledArray = shuffleArray(cardsArray);

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
function setImageCharacter() {
  fetch(getApiUrlBuild())
    .then((response) => response.json())
    .then((data) => {
      let imgId = 1;

      for (let index = 0; index < amountCards; index++) {
        let character = data[index];

        let cardImg = document.getElementById(cardImageId + imgId);
        cardImg.src = character.image;
        cardImg.alt = character.name;

        imgId++;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getApiUrlBuild() {
  return apiUrl + idsCharacters.join(",");
}

function setRandomIds() {
  idsCharactersPrevious = idsCharacters;
  idsCharacters = [];

  let maxCharactersApi = 826;

  while (idsCharacters.length < 3) {
    let randomId = randomize(maxCharactersApi) + 1;
    if (!idsCharacters.includes(randomId)) {
      idsCharacters.push(randomId);
    }
  }
}
//#endregion

//#region Set Image Texture
function setImageTexture() {
  changeCardImage(pathCard, "Rick and Morty Card");
}
//#endregion

//#region Utils
function getCards() {
  return document.querySelectorAll(querySelectorCard);
}

function randomize(factor = 100) {
  return Math.floor(Math.random() * factor);
}

function changeCardImage(src, alt) {
  let imgId = 1;
  for (let index = 0; index < amountCards; index++) {
    let cardImg = document.getElementById(cardImageId + imgId);
    cardImg.src = src;
    cardImg.alt = alt;

    imgId++;
  }
}
//#endregion

//#region Rules
function setPlayButton() {
  btnPlay.addEventListener("click", () => {
    hidePlayButton();
    setRandomIds();
    setImageCharacter();

    setCorrectAnswer();
    showCorrectAnswer();

    setTimeout(() => {
      hideCorrectAnswer();
      setImageTexture();
      shuffleCards();
    }, awaitTimeMs);

    setCardClick();
  });

  function hidePlayButton() {
    btnPlay.style.display = "none";
  }

  function setCardClick() {
    const cards = getCards();

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (card === correctCard) {
          alert("Acertou!");

          if (actualValue <= 0 || !actualValue) {
            actualValue = 1;
          } else {
            actualValue = actualValue + actualValue * (factorValue / 100);
          }

          actualValue = parseFloat(actualValue).toFixed(2);
        } else {
          alert("Errou!");

          if (actualValue <= 0 || !actualValue) {
            actualValue = 0;
          } else {
            actualValue = actualValue - actualValue * (factorValue / 100);
          }

          actualValue = parseFloat(actualValue).toFixed(2);
        }

        factorValue = randomize();
        factorValueSpan.innerHTML = `${factorValue}%`;
        actualValueSpan.innerHTML = `R$ ${actualValue}`;

        setRandomIds();
        setImageCharacter();
        setCorrectAnswer();
        showCorrectAnswer();

        setTimeout(() => {
          hideCorrectAnswer();
          setImageTexture();
          shuffleCards();
        }, awaitTimeMs / 2);
      });
    });
  }
}

//#region Correct Answer
function setCorrectAnswer() {
  let cards = getCards();
  let randomIndex = randomize(cards.length);
  correctCard = cards[randomIndex];
}

function showCorrectAnswer() {
  correctCard.classList.add("correct-answer");
}

function hideCorrectAnswer() {
  correctCard.classList.remove("correct-answer");
}
//#endregion

//#endregion
