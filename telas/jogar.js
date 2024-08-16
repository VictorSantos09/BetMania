import { ApiHelper } from "../helpers/api/ApiHelper";

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", shuffleCards);
  });

  function shuffleCards() {
    const cardContainer = document.querySelector("main");

    const cardsArray = Array.from(cards);
    const shuffledArray = shuffleArray(cardsArray);

    cardContainer.innerHTML = "";
    shuffledArray.forEach(card => {
      cardContainer.appendChild(card);
    });
  }

  function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
});

function getContent() {
    var result = ApiHelper.fetchAndExtractFields()
}
