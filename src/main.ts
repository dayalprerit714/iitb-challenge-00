import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

const APP_IDS = {
  app: "#app",
  counter: "#counter",
};

const app = document.querySelector<HTMLDivElement>(APP_IDS.app);

if (app === null) {
  throw new Error(`Id ${APP_IDS.app} does not exist`);
}

app.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

const counter = document.querySelector<HTMLButtonElement>(APP_IDS.counter);
if (counter === null) {
  throw new Error(`Id ${APP_IDS.counter} does not exist`);
}

setupCounter(counter);
