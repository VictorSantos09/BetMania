let idsCharacters = [];
let idsCharactersPrevious = [];
let correctAnswers;
const apiUrl = "https://rickandmortyapi.com/api/character/";
const cardImageId = "card-img-";
const querySelectorCard = ".card";
const pathCard = "/assets/card.png";
const btnPlay = document.getElementById("play");
const amountCards = 3;

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
      randomIndex = Math.floor(Math.random() * currentIndex);
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

  const maxCharactersApi = 826;

  while (idsCharacters.length < 3) {
    const randomId = Math.floor(Math.random() * maxCharactersApi) + 1;
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

    setTimeout(() => {
      shuffleCards();
      // setImageTexture();
    }, 5000);

    setCardClick();
  });

  function hidePlayButton() {
    btnPlay.style.display = "none";
  }

  function setCardClick() {
    const cards = getCards();

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        setRandomIds();
        setImageCharacter();
      });
    });
  }
}
