// Haal naam op uit URL
const name = new URLSearchParams(window.location.search).get("name");

// Zet naam in een element op de pagina, als je zoiets hebt:
if (name) {
  const welcomeText = document.querySelector('.dynamic-welcome');
  if (welcomeText) {
    welcomeText.innerHTML = `Welcome dear ${name}!`;
  }
}
