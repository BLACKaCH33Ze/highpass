// controller.js

/*
 * Controller module
 * 
 * Handles any events that are triggered by user interaction with the view
 */
var Controller = (function (document) {

    // initialize Grid object to communicate with controller
    var grid = Grid(numBoxes);
    
    // flag to toggle whether or not game will keep going 
    var keepGoing;
    // flag to toggle whether or not users can click on cells to change their state
    var noToggle = false;
    // flag to toggle between the two update modes 
    var update;
    
    // helper function for convenience
    var fill = function (str, x, y) {
            ctx.fillStyle = str;
            ctx.fillRect(x * boxDim, y * boxDim,
               boxDim, boxDim )
    }
    
    // flips current cell off and updates view
    var flipCellState = function (row, col, currentState) {
        if (currentState) { 
            fill('white', col, row); 
            states[row][col] = 0;
        } 
        else { 
            fill('green', col, row); 
            states[row][col] = 1;
        }
        ctx.stroke();
    }
    
    // updates current cell to reflect the given argument
    var updateCellState = function (row, col, givenState) {
        if (givenState) {
            fill('green', col, row);
            states[row][col] = 1;
        }
        else {
            fill('white', col, row);
            states[row][col] = 0;
        }
    }
    
    
    // handle user clicking on grid so users can turn cells on/off
    $('canvas').on('click', function(e) {
        if (noToggle) { return; }
        ctx.strokeStyle = 'black';
        
        // calculate coordinates relative to internal array
        xCoordBox = Math.floor ( e.offsetX/boxDim );
        yCoordBox = Math.floor ( e.offsetY/boxDim );
    
        flipCellState ( yCoordBox, xCoordBox, states[yCoordBox][xCoordBox] );
    
    });
    
    // changes grid in View with states in given array
    var changeView = function (arr) {
        arr.forEach ( function (row, i) {
            row.forEach ( function (cell, j) {
                updateCellState(i, j, cell);
            })
        })
        ctx.stroke();
    }; 
    
    // updates grid in View as the game progresses
    var updateView = function (newCellStates) {
        newCellStates[0].forEach ( function ( liveCells ) {
            updateCellState(liveCells[0], liveCells[1], 1);
        })
        newCellStates[1].forEach ( function ( deadCells ) {
            updateCellState(deadCells[0], deadCells[1], 0);
        })
        ctx.stroke();
    }
    
    // change layout according to users choice on dropdown box
    var changeLayout = function (n) {
        update = false
        switch (n) {
            case 0:
                break;
            case 1:
                grid.pulsarState();
                break;
            case 2:
                grid.gliderGunState();
                break;
            case 3:
                changeView( Grid(numBoxes, true).getGrid() );
                break;
        }
    }
    
    // handle subscriptions
    grid.subscribe( function () {
        if ( !(update) ) { changeView(grid.getGrid()); }
        else { updateView(grid.getNewStates()); }
    }) 
    
    // handle start button
    $('#start').on('click', function () {
        keepGoing = true;
        noToggle = true;
        update = false;
        console.log('START!');
        grid.setGrid(states);
    })
    
    // handle stop button
    $('#stop').on('click', function () {
        keepGoing = false;
        noToggle = false;
    })
    
    // handle step button
    $('#step').on('click', function () {
        update = true;
        if ( !(noToggle) ) { 
            grid.setGrid(states); 
            update = false;
        }
        noToggle = true;
        grid.nextGen();
    })
    
    // handle reset button
    $('#reset').on('click', function () {
        noToggle = false;
        changeView ( Grid(numBoxes).getGrid() );
    })
    
    /* Repeat the nextGen function with delay to 
     * update grid
     */
    var loop = function () {
        if (keepGoing) { grid.nextGen(); }
        setTimeout(loop, 150);
    }
    loop();

    // public exports for Controller
    return {
        'changeLayout' : changeLayout
    }

})(document);

// change layout according to users choice on dropdown box
var changeLayout = function (n) {
    Controller.changeLayout(n);
}
