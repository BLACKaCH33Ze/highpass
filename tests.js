/* Testing strategy for Trie:
 * 
 * Check setGrid 
 * Check basic oscillator
 * Check basic still life
 * Check lists of new states
 *
 */

// for use by grid
var times = function (n, f) {
    if ( n === 0) { return; }
    f();
    times (n -1, f);
}

var blinkerStates1 = [[0,0,0], [1,1,1], [0,0,0]];
var blinkerStates2 = [[0,1,0], [0,1,0], [0,1,0]];
var blockStates =  [[1,1,0], [1,1,0], [0,0,0]];

// Tests that the output is sorted lexographically/alphabetically
QUnit.test("Check setGrid", function (assert) {
    var grid = Grid(3);
    var desiredStates = [[1,0,1], [0,1,0], [1,0,1]];
    grid.setGrid(desiredStates);
    var gridStates = grid.getGrid();

    desiredStates.forEach( function (row, i) {
        assert.deepEqual(row, gridStates[i]);
    });

});

// Tests that the output is sorted lexographically/alphabetically
QUnit.test("Check Basic Oscillator", function (assert) {
    var grid = Grid(3);
    grid.setGrid(blinkerStates1);
    grid.nextGen();

    var gridStates = grid.getGrid();
    // check first transition
    blinkerStates2.forEach( function (row, i) {
        assert.deepEqual(row, gridStates[i]);
    });

    grid.nextGen();
    gridStates = grid.getGrid();

    // check second transition
    blinkerStates1.forEach( function (row, i) {
        assert.deepEqual(row, gridStates[i]);
    });
});

// Tests that the output is sorted lexographically/alphabetically
QUnit.test("Check Basic Still Life", function (assert) {
    var grid = Grid(3);
    grid.setGrid(blockStates);
    grid.nextGen();
    
    var gridStates = grid.getGrid();
    // make sure states remain the same
    blockStates.forEach( function (row, i) {
        assert.deepEqual(row, gridStates[i]);
    });

    grid.nextGen();
    gridStates = grid.getGrid();

    // make sure again
    blockStates.forEach( function (row, i) {
        assert.deepEqual(row, gridStates[i]);
    });
});

// Tests that the output is sorted lexographically/alphabetically
QUnit.test("Check Lists of New States", function (assert) {
    var grid = Grid(3);
    grid.setGrid(blinkerStates1);
    grid.nextGen();

    var newCellStates = grid.getNewStates();
    var newLiveCells = newCellStates[0];
    var newDeadCells = newCellStates[1];

    var expectedNewLiveCells = [ [0, 1], [2, 1] ];
    var expectedNewDeadCells = [ [1, 0], [1, 2] ];

    expectedNewLiveCells.forEach( function (arr, i) {
        assert.deepEqual(arr, newLiveCells[i]);
    });

    expectedNewDeadCells.forEach( function (arr, i) {
        assert.deepEqual(arr, newDeadCells[i]);
    });});


