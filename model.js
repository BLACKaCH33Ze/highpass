// model.js

/*
 *  Grid data structure. Handles all the logic behind the Game of Life, and keeps state
 *
 * @constructor
 * @dim dimension of the grid; overall size will be dim * dim 
 */

var Grid = function ( dim, bool ) {
    /*
     * Grid holds an internal 2D array of cell states in which
     * 0's represent dead cells, and 1's represent alive cells
     */
     
    var that = Object.create(Grid.prototype);

    // usueful array for looking around a current cell
    var dirFromCell = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0],[1,1]];

    // keep track of changes in cell states
    var newLiveCells = [];
    var newDeadCells = [];

    var subscribers = [];

    /* subscribe to changes for the Grid
     */
    that.subscribe = function (subscriber) {
        subscribers.push(subscriber);
    }

    var publishChanges = function() {
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i]();
        }
    }

    /* Produce next generation of cells
     * @return grid with updated cell states 
     */
    that.nextGen = function() {
        var nextGenGrid = generateGrid(dim); // make new Grid that will replace old one
        newLiveCells = [];
        newDeadCells = [];
        grid.forEach ( function (row, i) {
            row.forEach ( function (cell, j) {
                var dx, dy, n = 0;
                // use dirFromCell array to easily look at all adjacent cells
                dirFromCell.forEach ( function ( pair) {
                    dy = i + pair[0];
                    dx = j + pair[1];
                    // if adjacent cell is alive, increment counter
                    if ( cellInBounds(dy, dx) && grid[dy][dx] ) { n++; } 
                })
                var current = cell;
                switch (n) {
                    // 0 or 1 live cells adjacent kill current cell
                    case 0:
                    case 1:
                        current = 0;
                        break;
                    // 2 adjacent cells leave current cells as is
                    case 2:
                        break;
                    // 3 is the perfect number for life!
                    case 3:
                        current = 1;
                        break;
                    // More than 3 also kills current cell
                    default:
                        current = 0;
                }
                nextGenGrid[i][j] = current;
                
                var stateDiff = (cell - current);
                switch (stateDiff) {
                    case -1:
                        newLiveCells.push([i, j]);
                        break;
                    case 0:
                        break;
                    case 1:
                        newDeadCells.push([i,j]);
                        break;
                }
            })
        })
        grid = nextGenGrid;
        publishChanges();
    } 

    /* Sets grid states to reflect the states in given array
     * @arr array of size dim*dim
     */
    that.setGrid = function (arr) {
        grid = arr;
        publishChanges();
    }

    /* Returns current state of grid
     */
    that.getGrid = function () {
        return grid;
    }

    /* Returns a array of the lists of new live and dead cells
     */
    that.getNewStates = function () {
        var newStates = [];
        newStates.push(newLiveCells);
        newStates.push(newDeadCells);
        return newStates;
    }

    // Set of helper functions to draw grid

    /*
     * Draw vertical strip of length 2 or 3 up from current position
     */
    var vertStripUp = function (startRow, startCol, n) {
        grid[startRow][startCol] = 1;
        grid[startRow-1][startCol] = 1;
        if ( n === 3) { grid[startRow-2][startCol] = 1; }
     }

    /*
     * Draw horizontal strip of length 3 right relative to current position
     */
    var horizontalStripRight = function (startRow, startCol) {
        grid[startRow][startCol] = 1;
        grid[startRow][startCol+1] = 1;
        grid[startRow][startCol+2] = 1;
    }

    /*
     * Draw vertical strip of length 3 down from current position
     */
    var vertStripDown = function (startRow, startCol) {
        grid[startRow][startCol] = 1;
        grid[startRow+1][startCol] = 1;
        grid[startRow+2][startCol] = 1;
    }

    /*
     * Draw horizontal strip of length 2 or 3 left relative from current position
     */
    var horizontalStripLeft = function (startRow, startCol, n) {
        grid[startRow][startCol] = 1;
        grid[startRow][startCol-1] = 1;
        if ( n === 3) { grid[startRow][startCol-2] = 1; }
    } 

    /* 
     * Set grid to pulsar stater state
     */
    that.pulsarState = function () {
        // reset grid first
        grid = generateGrid(dim);

        var mid = Math.floor(dim / 2);

        vertStripUp(mid-2, mid-1, 3);
        vertStripUp(mid-2, mid+1, 3);
        vertStripUp(mid-2, mid-6, 3);
        vertStripUp(mid-2, mid+6, 3);
        horizontalStripRight(mid-1, mid+2);
        horizontalStripRight(mid+1, mid+2);
        horizontalStripRight(mid-6, mid+2);
        horizontalStripRight(mid+6, mid+2);
        vertStripDown(mid+2, mid-1);
        vertStripDown(mid+2, mid+1);
        vertStripDown(mid+2, mid-6);
        vertStripDown(mid+2, mid+6);
        horizontalStripLeft(mid-1, mid-2, 3);
        horizontalStripLeft(mid+1, mid-2, 3);
        horizontalStripLeft(mid-6, mid-2, 3);
        horizontalStripLeft(mid+6, mid-2, 3);

        publishChanges();
    }

    that.gliderGunState = function () {
        // reset grid first
        grid = generateGrid(dim);

        var mid = Math.floor(dim / 2);

        vertStripUp(mid-1, mid+1, 3);
        vertStripUp(mid-1, mid+2, 3);
        vertStripUp(mid-4, mid+5, 2);
        vertStripUp(mid+1, mid+5, 2);
        vertStripUp(mid-2, mid+15, 2);
        vertStripUp(mid-2, mid+16, 2);
        grid[mid][mid+3] = 1;
        grid[mid-4][mid+3] = 1;
        grid[mid][mid-2] = 1;
        vertStripUp(mid+1, mid-3, 3);
        grid[mid][mid-5] = 1;
        grid[mid-2][mid-4] = 1;
        grid[mid+2][mid-4] = 1;
        horizontalStripLeft(mid+3, mid-6, 2);
        horizontalStripLeft(mid-3, mid-6, 2);
        vertStripUp(mid+1, mid-9, 3);
        grid[mid-2][mid-8] = 1;
        grid[mid+2][mid-8] = 1;
        vertStripUp(mid, mid-18, 2);
        vertStripUp(mid, mid-19, 2);

        publishChanges();

    }

    /* Generate (dim*dim)-sized grid
     *
     * @dim dimension of grid
     * @bool flag that determines whether or not to randomize cell states
     * @return (dim*dim)-sized grid. If bool is not present all cells will 
     * be set to 0 otherwise, cells will be randomly set to 1 w/ prob 25%
     */ 
    var generateGrid = function (dim, bool) {
        var probAlive = 0;
        if ( bool ) { probAlive = 25; };
        var grid = []; 

        times ( dim, function () {
            var col= [];
            grid.push(col);
            times ( dim, function () {
                if (Math.floor( (Math.random() * 100) + 1)  
                    <= probAlive ) { col.push(1); }
                else { col.push(0); }
            })
        })
    return grid;
    }


    /*
     * Check that current cell is within bounds of grid's dimensions
     * @row row of current cell
     * @col column of current cell
     * @return boolean designating whether or not cell is in bounds
     */
    var cellInBounds = function (row, col) {
        return (row >= 0 && row < dim 
                && col >=0 && col < dim);
    }

    var grid = generateGrid(dim, bool); // make grid 
    Object.freeze(that); // prevent mutation of properties
    return that;
};

