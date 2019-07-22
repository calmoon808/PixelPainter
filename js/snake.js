window.onload = function(){
    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false); 
    let newElem, newImg;

    newElem = makeElem('canvas', '#snakeCanvas');
    document.querySelector('#grid').prepend(newElem);
    let d;
    document.addEventListener('keydown', function(event){
        if (event.keyCode == 39 && d != 'LEFT'){
            d = 'RIGHT';
        } else if (event.keyCode == 40 && d != 'UP'){
            d = 'DOWN';
        } else if (event.keyCode == 37 && d != 'RIGHT'){
            d = 'LEFT';
        } else if (event.keyCode == 38 && d != 'DOWN'){
            d = 'UP';
        }
    })
    newImg = new Image();
    newImg.src ='css/assests/green.png';   
    const cvs = document.getElementById('snakeCanvas');
    const ctx = cvs.getContext('2d');
    let vertical = 3;
    let horizontal = 5;
    let snake = [];
    snake[0] = {
        x: 30 * horizontal, 
        y: 20 * vertical
    };
    let food = {
        x: Math.floor(Math.random() * 60) * horizontal,
        y: Math.floor(Math.random() * 42) * vertical
    }
    let score = 0;

    function collision(x, y, array){
        for (let i = 0; i < array.length; i++){
            if (x == array[i].x && y == array[i].y){
                return true;
            }
        }
        return false;
    }

    function draw(){
        ctx.clearRect(0, 0, cvs.clientWidth, cvs.height);
        for (let i = 0; i < snake.length; i++){
            if (i == 0){
                ctx.fillStyle = 'blue';
            } else {
                ctx.fillStyle = 'green';
            }
            ctx.fillRect(snake[i].x, snake[i].y, horizontal, vertical);
        }
        ctx.drawImage(newImg, food.x, food.y, horizontal, vertical);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        let gameover = false;
        if (snakeX < horizontal - horizontal - 3|| snakeX > 61 * horizontal - horizontal - 3|| snakeY + vertical * 2 - 2 < vertical|| snakeY >= 42 * vertical - 2){
            alert("GAME OVER\nYour score was " + score);
            clearInterval(game);
            gameover = true;
        }

        if (d == "LEFT"){
            snakeX -= horizontal;
        } 
        if (d == 'UP'){
            snakeY -= vertical;
        }
        if (d == 'RIGHT'){
            snakeX += horizontal;
        } 
        if (d == 'DOWN'){
            snakeY += vertical;
        }

        if (snakeX === food.x && snakeY === food.y){
            score++;
            food = {
                x: Math.floor(Math.random() * 60) * horizontal,
                y: Math.floor(Math.random() * 42) * vertical
            }
        } else {
            snake.pop()
        }

        if (collision(snakeX, snakeY, snake)){
            alert("GAME OVER\nYour score was " + score);
            clearInterval(game);
            gameover = true;
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if (!gameover){
            snake.unshift(newHead);
        } else {
            snake = new Array;
            snake[0] = {
                x: 30 * horizontal, 
                y: 20 * vertical
            };
            console.log(snake);
            d = '';
            game = setInterval(draw, 55)
        }
    }
    let game = setInterval(draw, 55);

    function makeElem(elem, label, info) {
        var elemBox = document.createElement(elem);
        if (label[0] === "#") {
        elemBox.id = label.slice(1);
        } else if (label[0] === ".") {
        elemBox.className = label.slice(1);
        }
        if (info) {
        elemBox.innerHTML = info;
        }
        return elemBox;
    }
}