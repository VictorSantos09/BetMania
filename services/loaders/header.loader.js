document.addEventListener("DOMContentLoaded", function () {
  fetch("/header/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
    })
    .catch((error) =>
      console.error("Não foi possível carregar o header. Erro:", error)
    );
});
