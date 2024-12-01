let snake;
let food;
let gridSize = 25; // Size of each grid square
let cols, rows;
let gameStarted = false; // Tracks whether the game has started

function setup() {
  createCanvas(1000, 1000);
  frameRate(10); // Control the speed of the snake
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);
  resetGame();
}

function draw() {
  if (!gameStarted) {
    showMenu();
    return;
  }

  background(51);

  // Draw food
  fill(255, 0, 0);
  rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Update and draw snake
  snake.update();
  snake.show();

  // Check collision with food
  if (snake.eat(food)) {
    placeFood();
  }

  // Check game over
  if (snake.isDead()) {
    noLoop();
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    text("Press R to Restart", width / 2, height / 2 + 40);
  }
}

function keyPressed() {
  if (!gameStarted) {
    if (keyCode === ENTER) {
      gameStarted = true;
      loop(); // Start the game loop
    }
    return;
  }

  if (keyCode === UP_ARROW && snake.dir.y !== 1) {
    snake.setDir(0, -1);
  } else if (keyCode === DOWN_ARROW && snake.dir.y !== -1) {
    snake.setDir(0, 1);
  } else if (keyCode === LEFT_ARROW && snake.dir.x !== 1) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW && snake.dir.x !== -1) {
    snake.setDir(1, 0);
  } else if (keyCode === 82) { // 'R' key for restart
    resetGame();
    loop();
  }
}

function resetGame() {
  snake = new Snake();
  placeFood();
  gameStarted = false; // Return to menu on reset
  noLoop();
}

function placeFood() {
  food = createVector(floor(random(cols)), floor(random(rows)));
}

function showMenu() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Snake Game", width / 2, height / 2 - 40);
  textSize(16);
  text("Press ENTER to Start", width / 2, height / 2);
  text("Use Arrow Keys to Move", width / 2, height / 2 + 30);
  text("Press R to Restart", width / 2, height / 2 + 60);
}

class Snake {
  constructor() {
    this.body = [createVector(5, 5)]; // Start with one segment
    this.dir = createVector(0, 0); // Direction of movement
    this.growing = false; // Whether the snake is growing
  }

  update() {
    if (this.dir.x === 0 && this.dir.y === 0) return; // Don't move until a direction is pressed

    // Add a new head
    let head = this.body[this.body.length - 1].copy();
    head.add(this.dir);
    this.body.push(head);

    // Remove the tail unless growing
    if (!this.growing) {
      this.body.shift();
    } else {
      this.growing = false;
    }
  }

  setDir(x, y) {
    this.dir = createVector(x, y);
  }

  show() {
    fill(0, 255, 0);
    for (let segment of this.body) {
      rect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }
  }

  eat(pos) {
    let head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      this.growing = true;
      return true;
    }
    return false;
  }

  isDead() {
    let head = this.body[this.body.length - 1];

    // Check wall collisions
    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
      return true;
    }

    // Check self-collision
    for (let i = 0; i < this.body.length - 1; i++) {
      if (this.body[i].equals(head)) {
        return true;
      }
    }

    return false;
  }
}
