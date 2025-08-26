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

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(5, 10);
const playerprojeteis = [];
const alienprojeteis = [];
const particulas = [];

const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  }
};

const drawProjeteis = () => {
  const projectiles = [...playerprojeteis, ...alienprojeteis];
  projectiles.forEach((proj) => {
    proj.draw(ctx);
    proj.update();
  });
};

const drawParticulas = () => {
  particulas.forEach((particula, i) => {
    particula.draw(ctx);
    particula.update();

    if (particula.opacity <= 0) {
      particulas.splice(i, 1);
    }
  });
};

const limparProjeteis = () => {
  playerprojeteis.forEach((p, i) => {
    if (p.position.y <= 0) playerprojeteis.splice(i, 1);
  });

  alienprojeteis.forEach((p, i) => {
    if (p.position.y >= canvas.height) alienprojeteis.splice(i, 1);
  });
};

const criarExplocao = (position, size, color) => {
  for(let i = 0; i < size; i++) {
    const particula = new Particula(
      {
        x: position.x,
        y: position.y
      },
      {
        x: Math.random() -0.5*1.5,
        y: Math.random() -0.5*1.5,
      },
      3,
      "white"
    );
    particulas.push(particula);
  }
};

// === ALTERAÇÃO: função para incrementar score
const incrementScore = (value) => {
  gameData.score += value;
  if (gameData.score > gameData.high) {
    gameData.high = gameData.score;
  }
};

// === ALTERAÇÃO: função para incrementar level
const incrementLevel = () => {
  gameData.level += 1;
};

const checkShootAlien = () => {
  for (let alienIndex = grid.alien.length - 1; alienIndex >= 0; alienIndex--) {
    const alien = grid.alien[alienIndex];
    for (let projectileIndex = playerprojeteis.length - 1; projectileIndex >= 0; projectileIndex--) {
      const proj = playerprojeteis[projectileIndex];
      if (alien.hit(proj)) {
        criarExplocao({
          x: alien.position.x + alien.width/2,
          y: alien.position.y + alien.height/2,
        },
        10,
        "white"
        );

        grid.alien.splice(alienIndex, 1);
        playerprojeteis.splice(projectileIndex, 1);

        incrementScore(10); // ALTERAÇÃO: incrementa score ao matar alien

        break;
      }
    }
  }
};

const checkShootPlayer = () => {
  for (let i = alienprojeteis.length - 1; i >= 0; i--) {
    const proj = alienprojeteis[i];
    if (player.hit(proj)) {
      alienprojeteis.splice(i, 1);
      gameOver(); 
      break; 
    }
  }
};

const spawnGrid=() =>{
  if(grid.alien.length===0){
    grid.rows = Math.round(Math.random()*9+1);
    grid.cols = Math.round(Math.random()*9+1);
    grid.restart();

    incrementLevel(); // ALTERAÇÃO: incrementa level ao limpar a grid
  }
};

const gameOver = () => {

  const criarExplosao = (position, size, color) => {
    for(let i = 0; i < size; i++) {
      const particula = new Particula(
        {
          x: position.x,
          y: position.y
        },
        {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        },
        3,
        color
      );
      particulas.push(particula);
    }
  };

  criarExplosao(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2
    },
    10,
    "red"
  );
  currenteState = GameState.GAME_OVER; // ALTERAÇÃO: corrigido typo GAMER_OVER -> GAME_OVER
  player.alive = false;
  document.body.append(gameOverScreen);
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currenteState === GameState.PLAYING) {

    showGameData(); // ALTERAÇÃO: mostra score, level, high

    spawnGrid();

    drawProjeteis();
    drawParticulas();

    limparProjeteis();

    checkShootAlien();
    checkShootPlayer();

    grid.draw(ctx);
    grid.update(player.alive);

    ctx.save();

    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );

    if (keys.shoot.pressed && keys.shoot.released) {
      player.shoot(playerprojeteis);
      keys.shoot.released = false;
    }

    if (keys.left && player.position.x >= 0) {
      player.moveLeft();
      ctx.rotate(-0.15);
    }

    if (keys.right && player.position.x <= canvas.width - player.width) {
      player.moveRight();
      ctx.rotate(0.15);
    }

    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    player.draw(ctx);

    ctx.restore();

    drawParticulas(); // ainda desenha partículas da explosão
  }
  if (currenteState === GameState.GAME_OVER) { // ALTERAÇÃO: corrigido typo
    drawParticulas();
    drawProjeteis();
    grid.draw(ctx);
    grid.update(player.alive);
  }
  requestAnimationFrame(gameLoop);
};

player.draw(ctx);

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

  setInterval(() => {
    const alien = grid.getRandomAlien();
    if (alien) {
      alien.shoot(alienprojeteis);
    }
  }, 1000);
});

buttonRestart.addEventListener("click", () => {
  currenteState = GameState.PLAYING;
  player.alive = true;

  grid.alien.length = 0;
  grid.AlienVelocidade = 1;

  alienprojeteis.length = 0;

  gameData.score = 0;     // ALTERAÇÃO: reset score
  gameData.level = 1;     // ALTERAÇÃO: reset level

  gameOverScreen.remove();
});

gameLoop();

