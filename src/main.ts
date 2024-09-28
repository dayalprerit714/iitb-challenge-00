import "./style.css";

const APP_IDS = {
  app: "#app",
};

const app = document.querySelector<HTMLDivElement>(APP_IDS.app);
if (app === null) {
  throw new Error(`Id = ${APP_IDS.app} is null`);
}

app.innerHTML = `
  <p class="text-xl font-bold">
    Hi! from Prerit :)
  </p>
`;
