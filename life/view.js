// view.js
var boxDim = 20; // size of each box in pixels
var numBoxes = 40; // number of rows/columns in canvas
var canvasDim = boxDim * numBoxes;
$('canvas').attr( { width: canvasDim, height: canvasDim});
var canvas = document.getElementById("canvas"); 
var ctx = canvas.getContext('2d');
ctx.lineWidth = 2;

/*
 * Performs function N times
 * @n number of times to repeat function
 * @f function to repeat
 */
var times = function (n, f) {
    if ( n === 0) { return; }
    f();
    times ( n-1, f);
}

// initialize internal states grid used for communications 
// bt/wn controller and model
var states = [];
times (numBoxes, function () {
   var col = [];
   states.push(col);
   times ( numBoxes, function () {
      col.push(0);
   })
}) 

// draw grid 
// source: stackoverflow.com
function drawGrid() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    states.forEach ( function (row, i) {
        row.forEach ( function (cell, j) {
            var x = j * boxDim;
            var y = i * boxDim;
            ctx.rect(x, y, boxDim, boxDim);
            ctx.fill();
            ctx.stroke();
        }) 
    })
    ctx.closePath();
}

drawGrid();


