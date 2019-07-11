//initiate variables
let newElem, newButton, newQuery, newImg, hex;
let isDown = false;
document.addEventListener('mousedown', function(){
    isDown = true;
})
document.addEventListener('mouseup', function(){
    isDown = false;
})

//make grid
newElem = makeElem("div", "#grid");
document.body.appendChild(newElem);

//add rows
let width = 60;
let squares = width;
for (let i = 1, j = 1; i <= 42; i++) {
  newElem = makeElem("div", "#gridRow" + i);
  newElem.className = "gridRows";
  newElem.style.borderLeft = '1px solid black';
  document.querySelector("#grid").appendChild(newElem);
  //add empty boxes
  while (j <= squares) {
    newElem = makeElem("div", "#emptyBox" + j);
    newElem.className = 'emptyBoxes';
    newElem.style.backgroundColor = 'transparent';
    document.querySelector("#gridRow" + i).appendChild(newElem);
    j++;
  };
  squares += width;
}

//empty boxes event bools
let prevColor;
let clickPrevColor;
let click = false;
let dontChange = false;
let undoOn = false;
//initiate undo and redo arrays
let undoArr = new Array();
let redoArr = new Array();
//count for naming obj
let count = 0;
newQuery = document.querySelectorAll('.emptyBoxes');
for (let i = 0, n = newQuery.length; i < n; i++){
    newQuery[i].addEventListener('click', function(){
        dontChange = true;
        this.style.backgroundColor = hex;
        // console.log(redoArr);
        // console.log(undoArr);   
    })
    newQuery[i].addEventListener('mousedown', function(){
        //if triggered after redo was used pop objects off in both arrays;
        if (undoOn){
            for (let i = 0, n = undoArr.length; i < n - count; i++){
                redoArr.pop();
                undoArr.pop();
            }
        }
        if (!redoArr[count]){
            redoArr[count] = new Object;
        } 
        if (!undoArr[count]){
            undoArr[count] = new Object;
        }   
        click = true;
        this.style.backgroundColor = hex;
        dontChange = true;
        undoArr[count][this.id] = clickPrevColor;
        redoArr[count][this.id] = hex; 
    })
    newQuery[i].addEventListener('mouseup', function(){
        this.style.backgroundColor = hex;
        if (undoArr[count]){
            count++;
        }
    })
    newQuery[i].addEventListener('mouseover', function(){
        if (isDown){
            //redo Array
            if (this.id in redoArr[count]){
                redoArr[count][this.id] = redoArr[count][this.id];
            } else {
                redoArr[count][this.id] = hex;
            }

            //undo Array
            if (this.id in undoArr[count]){
                undoArr[count][this.id] = undoArr[count][this.id];
            } else {
                prevColor = this.style.backgroundColor;
                undoArr[count][this.id] = prevColor;
            }
            this.style.backgroundColor = hex;
        } else {
            prevColor = this.style.backgroundColor;
            clickPrevColor = this.style.backgroundColor;
            this.style.backgroundColor = hex; 
        }
    })
    newQuery[i].addEventListener('mouseout', function(){
        if (dontChange){
            this.style,backgroundColor = hex;
            dontChange = false;
        } else if (click){
            this.style.backgroundColor = clickPrevColor;
        } else if (!isDown){
            this.style.backgroundColor = prevColor;
        }
        click = false;
    })
}
//event listener for undo and redo onkeydown
function keyPress(e){
    let eventObj = window.event ? event : e;
    if (eventObj.keyCode == 90 && eventObj.ctrlKey && eventObj.shiftKey){
        for (let i in redoArr[count]){
            document.getElementById(i).style.backgroundColor = redoArr[count][i];
        }
        if (count < undoArr.length){
            count++;
        }
    } else if (eventObj.keyCode == 90 && eventObj.ctrlKey){
        if (count > 0){
            count--;
        }
        for (let i in undoArr[count]){
            document.getElementById(i).style.backgroundColor = undoArr[count][i];
        }
        undoOn = true;
    }
}
document.onkeydown = keyPress;
//add color gradient;
newElem = makeElem('div','#gradient');
document.body.appendChild(newElem);

//make canvas
let canvas = makeElem('canvas', "#colorWheelCanvas");
document.querySelector('#gradient').appendChild(canvas);
let pic = new Image();
pic.onload = function(){
    let ctx = canvas.getContext("2d");
    canvas.width = pic.width - 90;
    canvas.height = pic.width - 90;
    ctx.drawImage(pic, -45, -45);

    function findPos(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent){
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return {x: curleft, y: curtop };
        }
        return undefined;
    }
    
    function rgbToHex(r, g, b){
        if (r > 255 || g > 255 || b > 255){
            throw "Invalid color component";
        }
        return ((r << 16) | (g << 8) | b).toString(16);
    }
    
    newQuery = document.querySelector('#colorWheelCanvas');
    newQuery.addEventListener('mousemove', (function(e) {
        if (isDown){
            let pos = findPos(this);
            let x = e.pageX - pos.x;
            let y = e.pageY - pos.y;
            let c = this.getContext('2d');
            let p = c.getImageData(x - 15, y - 15, 1, 1).data; 
            hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            document.querySelector('#colorBox').style.backgroundColor = hex;

        }
    }))

    newQuery.addEventListener('click', function(e){
        let pos = findPos(this);
        let x = e.pageX - pos.x;
        let y = e.pageY - pos.y;
        let c = this.getContext('2d');
        let p = c.getImageData(x - 15, y - 15, 1, 1).data; 
        hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        document.querySelector('#colorBox').style.backgroundColor = hex;
    })
};
pic.src = "css/assests/colorWheel450.png";


//color boxes
newElem = makeElem('div', "#colorBoxes");
document.body.appendChild(newElem);
//color box
newElem = makeElem("div", "#colorBox");
document.querySelector("#colorBoxes").appendChild(newElem);
//save color box
let saveColorBox = makeElem('div', '#saveColorBox');
let savedColor1 = 'ffffff'; 
let savedColor2 = 'ffffff';
let savedColor3 = 'ffffff';
let savedColor4 = 'ffffff';

//add buttons to saveColorBox
let save4Buttons = makeElem('div', '#save4');
saveColorBox.appendChild(save4Buttons);
let currentSave = savedColor1;
for (let i = 1; i < 5; i++){
    newElem = makeElem('button', '.save4Buttons', i);
    newElem.addEventListener('click', function(){
        if (this.textContent == 1){
            saveColorBox.style.backgroundColor = savedColor1;
            currentSave = savedColor1;
        } else if (this.textContent == 2){
            saveColorBox.style.backgroundColor = savedColor2;
            currentSave = savedColor2;
        } else if (this.textContent == 3){
            saveColorBox.style.backgroundColor = savedColor3;
            currentSave = savedColor3;
        } else {
            saveColorBox.style.backgroundColor = savedColor4;
            currentSave = savedColor4;
        }
    })
    save4Buttons.appendChild(newElem);
}

//add save load buttons to saveColorBox
for (let i = 0; i < 2; i++){
    if (i === 0){
        newElem = makeElem('button', '#saveButton');
        newElem.addEventListener('click', function(){
            if (currentSave === savedColor1){
                savedColor1 = hex;
                saveColorBox.style.backgroundColor = savedColor1;
            } else if (currentSave === savedColor2){
                savedColor2 = hex;
                saveColorBox.style.backgroundColor = savedColor2;
            } else if (currentSave === savedColor3){
                savedColor3 = hex;
                saveColorBox.style.backgroundColor = savedColor3;
            } else {
                savedColor4 = hex;
                saveColorBox.style.backgroundColor = savedColor4;
            }
        })
        saveColorBox.appendChild(newElem);
    } else {
        newElem = makeElem('button', '#loadButton');
        newElem.addEventListener('click', function(){
            if (currentSave === savedColor1){
                hex = savedColor1;
                document.querySelector('#colorBox').style.backgroundColor = hex;
            } else if (currentSave === savedColor2){
                hex = savedColor2;
                document.querySelector('#colorBox').style.backgroundColor = hex;
            } else if (currentSave === savedColor3){
                hex = savedColor3;
                document.querySelector('#colorBox').style.backgroundColor = hex;
            } else {
                hex = savedColor4;
                document.querySelector('#colorBox').style.backgroundColor = hex;
            }
        })
        saveColorBox.appendChild(newElem);
    }
}
document.querySelector('#colorBoxes').appendChild(saveColorBox);

//save load clear and snake buttons
newElem = makeElem('div', '#bottomButtons');
document.body.appendChild(newElem);

for (let i = 0; i < 4; i ++){
    newElem = makeElem('button');
    if (i === 0){
        newElem = makeElem('button', '#save', 'SAVE');
    } else if (i === 1){
        newElem = makeElem('button', '#load', 'LOAD')
    } else if (i === 2){
        newElem = makeElem('button', '#clear', 'CLEAR');
    } else {
        newElem = makeElem('button', '#snakeStart');
    }
    newElem.className = 'botButts';
    document.querySelector('#bottomButtons').appendChild(newElem);
}

//bottom button events
let save;
let empties = document.querySelectorAll('.emptyBoxes');
document.querySelector('#save').addEventListener('click', function(){
    save = [];
    for (let i = 0, n = empties.length; i < n; i++){
        save.push(empties[i].style.backgroundColor);
    }
})

document.querySelector('#load').addEventListener('click', function(){
    for (let i = 0, n = empties.length; i < n; i++){
        empties[i].style.backgroundColor = save[i];
    }
})

document.querySelector('#clear').addEventListener('click', function(){
    for (let i = 0, n = empties.length; i < n; i++){
        empties[i].style.backgroundColor = 'transparent';
    }
})

let snakeOn = false;
document.querySelector('#snakeStart').addEventListener('click', function(){
    if (!snakeOn){
        snakeOn = true;
        // for (let i = 0, n = empties.length; i < n; i++){
        //     empties[i].style.backgroundColor = 'white';
        // }
        document.querySelector('#snakeCanvas').style.display = 'block';
    } else {
        snakeOn = false;
        for (let i = 0, n = empties.length; i < n; i++){
            empties[i].style.backgroundColor = 'transparent';
        }
        document.querySelector('#snakeCanvas').style.display = 'none';
    }
})
//link snake.js
newElem = makeElem('script','#snakejs');
newElem.src = 'js/snake.js';
document.body.appendChild(newElem);


//make elem function
function makeElem(elem, label, info) {
  var elemBox = document.createElement(elem);
  if (label){
    if (label[0] === "#") {
        elemBox.id = label.slice(1);
    } else if (label[0] === ".") {
        elemBox.className = label.slice(1);
    }
  }
  if (info) {
    elemBox.innerHTML = info;
  }
  return elemBox;
}