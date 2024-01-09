const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const score = document.getElementById('score');
const highScoreText = document.getElementById('HighScore');
const logo = document.getElementById('logo');
//define game variables
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameStarted = false;
let gameSpeedDelay = 200;
let highScore = 0;
//draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    if(gameStarted){
        snake.forEach((segment) => {
            const snakeElement = createGameElement('div', 'snake');
            setPosition(snakeElement, segment);
            board.appendChild(snakeElement);
        });
    }
   
}


//creating a snake or food.
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element; 
}

//set position of snake for food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Draw Food
function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
  
}

//Generate Food
function generateFood(){
    const x = Math.floor(Math.random() * 20) + 1;
    const y = Math.floor(Math.random() * 20) + 1;
    return {x, y};
}

//Moving the Snake
function move(){
    const head = { ...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        
    }
    snake.unshift(head);
    // snake.pop();
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval =  setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }else{
        snake.pop();
    }
}
// Testing draw function

// setInterval(() =>{
//     move();
//     draw();
// }, 200);

//start game function
function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//key press event listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === '')){
        startGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break; 
             case 'ArrowRight':
                direction = 'right';
                break;  
             case 'ArrowLeft':
                direction = 'left';
                break; 
            case 'w' :
                direction = 'up';
                break; 
            case 's' :
                direction = 'down';
                break; 
            case 'd' :
                direction = 'right';
                break; 
            case 'a' :
                direction = 'left';
                break;  
        }
    }
}

//increase speed
function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if (gameSpeedDelay > 100){
        gameSpeedDelay -=3;
    }else if (gameSpeedDelay > 50){
        gameSpeedDelay -=2;
    }else if (gameSpeedDelay > 25){
        gameSpeedDelay -=1;
    }
}

//check collision
function checkCollision(){
    const head = snake[0];

    if(head.x <1 || head.x > 20 || head.y < 1 || head.y > 20){
        resetGame();
    }
    for(let i = 1; i < snake.length; i ++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

//reset game
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x: 10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    
}
//function to update the score
function updateScore(){
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3,'0');
}
//function to stop the game
function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';
}
document.addEventListener('keydown', handleKeyPress)