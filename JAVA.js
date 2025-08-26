import Alien from "alien.js";
import Player from "Player.js";
import Projeteis from "Projeteis.js";
import Grid from "Grid.js";
import Particula from "Particulas.js";
import { GameState } from "constants.js";

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currenteState = GameState.START;

// === ALTERAÇÃO: objeto para guardar dados de jogo
const gameData = {
  score: 0,
  level: 1,
  high: 0,
};

const showGameData = () => { // ALTERAÇÃO: atualiza UI
  scoreElement.textContent = gameData.score;
  levelElement.textContent = gameData.level;
  highElement.textContent = gameData.high;
};

showGameData();

// === CÓDIGOS PARA O JOGO EM SI
let player = null;
let grid = null;
let projeteis = [];
let particulas = [];
const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  },
};

const drawProjeteis = () => {
  projeteis.forEach((p, index) => {
    p.draw(ctx);
    p.update();

    if (p.position.y <= 0 || p.position.y >= canvas.height) {
      setTimeout(() => {
        projeteis.splice(index, 1);
      }, 0);
    }
  });
};

const drawParticulas = () => {
  particulas.forEach((p, index) => {
    p.draw(ctx);
    p.update();

    if (p.opacity <= 0) {
      setTimeout(() => {
        particulas.splice(index, 1);
      }, 0);
    }
  });
};

const createParticulas = (object) => {
  for (let i = 0; i < 15; i += 1) {
    const p = new Particula({
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2,
      }, {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      Math.random() * 2,
      "#B4F27C"
    );

    particulas.push(p);
  }
};

const gameLoop = () => {
  if (currenteState === GameState.PLAYING) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    grid.draw(ctx);
    grid.update(player.alive);

    if (keys.left) player.moveLeft();
    if (keys.right) player.moveRight();
    if (keys.shoot.pressed && keys.shoot.released) {
      player.shoot(projeteis);
      keys.shoot.released = false;
    }

    if (player.alive) {
      drawProjeteis();
      drawParticulas();
    } else {
      currenteState = GameState.GAME_OVER;
      createParticulas(player);
      gameOverScreen.style.display = "flex"; // ADIÇÃO: Mostra a tela de game over
    }

    grid.alien.forEach((alien, indexAlien) => {
      const colidiuComPlayer = alien.position.y + alien.height >= player.position.y &&
        alien.position.x <= player.position.x + player.width &&
        alien.position.x + alien.width >= player.position.x;

      if (colidiuComPlayer) {
        player.alive = false;
      }

      projeteis.forEach((projetil, indexProjetil) => {
        const colidiu = projetil.position.x + projetil.width >= alien.position.x &&
          projetil.position.x <= alien.position.x + alien.width &&
          projetil.position.y <= alien.position.y + alien.height &&
          projetil.position.y + projetil.height >= alien.position.y;

        if (colidiu) {
          gameData.score += 10;
          setTimeout(() => {
            grid.alien.splice(indexAlien, 1);
            projeteis.splice(indexProjetil, 1);
            createParticulas(alien);
          }, 0);
          showGameData();
        }
      });
    });
  }
  requestAnimationFrame(gameLoop);
};

player = new Player(canvas.width, canvas.height);
grid = new Grid(4, 10);
gameLoop();

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") {
    keys.left = true;
  }

  if (key === "d") {
    keys.right = true;
  }
  if (key === "e") {
    keys.shoot.pressed = true;
  }
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") {
    keys.left = false;
  }

  if (key === "d") {
    keys.right = false;
  }
  if (key === "e") {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
  }
});

buttonPlay.addEventListener("click", () => {
  startScreen.remove();
  scoreUi.style.display = "block";
  currenteState = GameState.PLAYING;
});

buttonRestart.addEventListener("click", () => {
  gameOverScreen.remove();
  player = new Player(canvas.width, canvas.height);
  grid = new Grid(4, 10);
  projeteis = [];
  particulas = [];
  gameData.score = 0;
  showGameData();
  currenteState = GameState.PLAYING;
  gameLoop();
});
