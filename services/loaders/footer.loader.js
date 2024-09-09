document.addEventListener("DOMContentLoaded", function () {
  fetch("/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch((error) => {
      console.error("Não foi possível carregar o footer. Erro:", error);
      alert("Não foi possível carregar o footer");
    });
});
