//initiate variables
let newElem, newButton, newQuery, newImg; 

//make grid
newElem = makeElem('div', '#grid');
document.body.appendChild(newElem);

//add rows
for (let i = 1; i <= 17; i++){
    newElem = makeElem('div', '#gridRow' + i);
    newElem.className = 'gridRows';
    document.querySelector('#grid').appendChild(newElem);
    //add empty boxes
    for (let j = 1; j <= 17; j++){
        newElem = makeElem('div', '.emptyBoxes');
        document.querySelector('#gridRow' + i).appendChild(newElem);
    }
}

//add color gradient
newElem = makeElem('div', '#gradient');
document.body.appendChild(newElem);
newElem = makeElem('div', '#colorPicker');
document.querySelector('#gradient').appendChild(newElem);

//make canvas
window.onload = function(){
    let canvas = makeElem('canvas', '#colorWheelCanvas');
    document.querySelector('#gradient').appendChild(canvas);
    // document.body.appendChild(canvas);
    let pic = new Image();
    pic.onload = function(){
        let ctx = canvas.getContext("2d");
        canvas.width = pic.width;
        canvas.height = pic.height;
        ctx.drawImage(pic, 0, 0);
        
        // let c = canvas.getContext("2d");
        // let p = c. getImageData(7, 7, 1, 1).data;
        // let hex = "RGB = " + p[0] + ", " + p[1] + ", " + p[2];

        // console.log(hex);
    }
    pic.src = 'css/assests/colorWheel.png'
}
// newElem = makeElem('canvas', '#colorWheelCanvas');
// document.querySelector('#gradient').appendChild(newElem);
// newImg = makeElem('img', '#canvasImg');
// newImg.src = "css/assests/colorWheel.png"
// newElem.appendChild(newImg);
// let data = document.querySelector('#colorWheelCanvas').toDataURL();
// // document.querySelector('#gradient').style.backgroundImage = 'url(' + data + ')';


//color picker variables
let mousePosition;
let offset = [0,0];
let isDown = false;

//add color picker
newQuery = document.querySelector('#colorPicker');
newQuery.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        newQuery.offsetLeft - e.clientX,
        newQuery.offsetTop - e.clientY
    ];
}, true);

document.addEventListener('mouseup', function() {
    isDown = false;
}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {

            x : event.clientX,
            y : event.clientY

        };
        newQuery.style.left = (mousePosition.x + offset[0]) + 'px';
        newQuery.style.top  = (mousePosition.y + offset[1]) + 'px';
        let canvas = document.querySelector('#colorWheelCanvas');
        let c = canvas.getContext("2d");
        let p = c.getImageData(event.offsetX, mousePosition.y + offset[1], 10, 10).data;
        let hex = "#" + p[0] + p[1] + p[2];
        document.querySelector('#colorBox').style.backgroundColor = hex;
    }
}, true);

//color picker snap function
document.querySelector('#gradient').addEventListener('mousedown', function(){
    newQuery.style.left = event.clientX - 109,
    newQuery.style.top = event.clientY - 500
})

newDiv = makeElem('div', '#colorBox');
document.body.appendChild(newDiv);

function makeElem(elem, label, info){
    var elemBox = document.createElement(elem);
    if (label[0] === '#'){
        elemBox.id = label.slice(1);
    } else if (label[0] === '.'){
        elemBox.className = label.slice(1);
    }
    if (info){
        elemBox.innerHTML = info;
    }
    return elemBox;
}