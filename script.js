const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const maxCells = canvasSize / box;

let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let lives = 5;

let gameRunning = false;
let gameStopped = false;

document.getElementById("score").innerText = "Score : " + score;
document.getElementById("lives").innerText = "Vies : " + lives;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.key;
  if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * maxCells) * box,
    y: Math.floor(Math.random() * maxCells) * box
  };
}

function updateScore() {
  document.getElementById("score").innerText = "Score : " + score;
}

function updateLives() {
  document.getElementById("lives").innerText = "Vies : " + lives;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "UP") head.y -= box;
  else if (direction === "DOWN") head.y += box;
  else if (direction === "LEFT") head.x -= box;
  else if (direction === "RIGHT") head.x += box;

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    isCollision(head)
  ) {
    lives--;
    updateLives();
    score = 0;
    updateScore();

    if (lives <= 0) {
      alert("Game Over ! Ton score final : " + score);
      gameRunning = false;
      document.getElementById("menu").style.display = "flex";
      return;
    } else {
      snake = [{ x: 10 * box, y: 10 * box }];
      direction = "RIGHT";
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = spawnFood();
  } else {
    snake.pop();
  }

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

function isCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

let lastTime = 0;
let delay = 200;

function loop(currentTime) {
  requestAnimationFrame(loop);
  if (!gameRunning || gameStopped) return;
  if (currentTime - lastTime < delay) return;
  lastTime = currentTime;
  draw();
}

requestAnimationFrame(loop);

// Fonctions de contrôle appelées depuis HTML
function startGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  lives = 5;
  updateScore();
  updateLives();
  food = spawnFood();
  gameRunning = true;
  gameStopped = false;
  document.getElementById("menu").style.display = "none";
}

function stopGame() {
  gameRunning = false;
  gameStopped = true;
  document.getElementById("menu").innerHTML = "<h1>Merci d’avoir joué !</h1>";
}
