// HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore')

//Game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//SFX variables
let audioContext;

// Draw the map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw the snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Add snake segment or food
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set position of snake element or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Testing draw()
//draw();

// Draw food
function drawFood(){
    if (gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement,food)
        board.appendChild(foodElement);
    }
}

// Generate food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Move the snake
function move(){
    const head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    //snake.pop();

    if (head.x == food.x && head.y == food.y){
        playBeep();
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// //Test movement
// setInterval(() =>  {
//     move();
//     draw();
// }, 200);

function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

// Keypress event listener
function handleKeyPress(event){
    if (
        (!gameStarted && event.code == 'Space') ||
        (!gameStarted && event.code == ' ')
    ){
        startGame();
    } else {
        switch (event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    //console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision(){
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        gameOver();
    }

    for (let i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y){
        gameOver();
        }
    }
}

function gameOver(){
    alert('You crashed. Game over');
    resetGame();
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');

}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');        
    }
    highScoreText.style.display = 'block';
}

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep() {
    initAudioContext(); // Initialize AudioContext if not already done

    // Create an oscillator
    const oscillator = audioContext.createOscillator();

    // Connect the oscillator to the audio context's destination (speakers)
    oscillator.connect(audioContext.destination);

    // Set the type of oscillator (sine wave for a simple beep)
    oscillator.type = 'sine';

    // Set the frequency of the oscillator
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz for A4 pitch

    // Start and stop the oscillator to generate a short beep
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Attach click event to the audio control button to enable audio
const enableAudioButton = document.getElementById("enableAudioButton");
enableAudioButton.addEventListener("click", initAudioContext);

