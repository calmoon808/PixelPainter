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
for (let i = 1, j = 1; i <= 41; i++) {
  newElem = makeElem("div", "#gridRow" + i);
  newElem.className = "gridRows";
  newElem.style.borderLeft = '1px solid black';
  document.querySelector("#grid").appendChild(newElem);
  //add empty boxes
  while (j <= squares) {
    newElem = makeElem("div", "#emptyBox" + j);
    newElem.className = 'emptyBoxes';
    newElem.style.backgroundColor = 'rgb(255, 255, 255)'
    document.querySelector("#gridRow" + i).appendChild(newElem);
    j++;
  };
  squares += width;
}

//empty boxes hover event
let prevColor;
let clickPrevColor;
let click = false;
let dontChange = false;
//count for naming obj
let arrObj = new Array();
let count = 0;
// objs[count] = new Object;
newQuery = document.querySelectorAll('.emptyBoxes');
for (let i = 0, n = newQuery.length; i < n; i++){
    newQuery[i].addEventListener('click', function(){
        dontChange = true;
        this.style.backgroundColor = hex;
    })
    newQuery[i].addEventListener('mousedown', function(){
        if (!arrObj[count]){
            arrObj[count] = new Object;
        }   
        click = true;
        this.style.backgroundColor = hex;
        arrObj[count][this.id] = clickPrevColor;
        // count++;
        console.log(arrObj);
    })
    newQuery[i].addEventListener('mouseup', function(){
        this.style.backgroundColor = hex;
        if (arrObj[count]){
            count++;
        }
    })
    newQuery[i].addEventListener('mouseover', function(){
        if (isDown){
            if (!arrObj[count]){
                arrObj[count] = new Object;
            }
            prevColor = this.style.backgroundColor;
            arrObj[count][this.id] = prevColor;
            this.style.backgroundColor = hex;
            // console.log(arrObj);
        } else {
            prevColor = this.style.backgroundColor;
            clickPrevColor = this.style.backgroundColor;
            // console.log(clickPrevColor);
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
//event listener for ctrl + z onkeydown
function keyPress(e){
    let eventObj = window.event ? event : e;
    if (eventObj.keyCode == 90 && eventObj.ctrlKey){
        for (let i in arrObj[count - 1]){
            document.getElementById(i).style.backgroundColor = arrObj[count - 1][i];
        }
        if (count > 1){
            count--;
        }
    }
    if (eventObj.keyCode == 90 && eventObj.ctrlKey && eventObj.shiftKey){
        ++count;
        console.log(count);
        for (let i in arrObj[count - 1]){
            document.getElementById(i).style.backgroundColor = arrObj[count - 1][i];
        }
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
//color box;
newElem = makeElem("div", "#colorBox");
document.querySelector("#colorBoxes").appendChild(newElem);
//save color box
let saveColorBox = makeElem('div', '#saveColorBox');
let savedColor;
// saveColorBox.addEventListener('click', function(){
//     savedColor = hex;
//     this.style.backgroundColor = savedColor;
// })
//add buttons to saveColorBox
for (let i = 0; i < 2; i++){
    if (i === 0){
        newElem = makeElem('button', '#saveButton');
        newElem.addEventListener('click', function(){
            savedColor = hex;
            saveColorBox.style.backgroundColor = savedColor;
        })
        saveColorBox.appendChild(newElem);
    } else {
        newElem = makeElem('button', '#loadButton');
        newElem.addEventListener('click', function(){
            hex = savedColor;
            document.querySelector('#colorBox').style.backgroundColor = savedColor;
        })
        saveColorBox.appendChild(newElem);
    }
    // newElem.addEventListener('click', function(){
    //     ani();
    //     anitwo();
    // })
    // newImg = makeElem('img', '.saveLoadImg');
    // newElem.appendChild(newImg);
}
document.querySelector('#colorBoxes').appendChild(saveColorBox);

//// function for animations
// function ani(){
//     this.className ='animation';
// }
// function anitwo(){
//     this.className ='animation2';
// }

//make elem function
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

console.log(document.querySelector('#emptyBox2').className)