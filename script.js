// HTML elements
const board = document.getElementById('game-board');

//Game variables
let snake = [{x: 20, y: 18}];

// Draw the map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
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

draw();