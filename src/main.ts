import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app === null) {
    throw new Error("Id #app does not exist");
  }

  app.innerHTML = `
  <p class="text-xl font-bold">
    Hi! from Prerit :)
  </p>`;
});
