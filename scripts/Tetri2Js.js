class Piece {
    static T_BLOCK = 0;
    static J_BLOCK = 1;
    static L_BLOCK = 2;
    static O_BLOCK = 3;
    static S_BLOCK = 4;
    static Z_BLOCK = 5;
    static I_BLOCK = 6;

    static BLOCK_TEMPLATE = "BLOCK_TEMPLATE";
    assignedBlockShape = "";
    board = null;
    subPieces = [
        new Array(3).fill(null),
        new Array(3).fill(null),
        new Array(3).fill(null)
    ];
    position = { x: 0, y: 0 }; // upper left of piece's grid
    idleTicks = 0; //how many game ticks this piece has been unmodified (rotation/movement)


    constructor(board, blockShape) {
        if (board === null || board === undefined)
            throw ("No board provided instantiating new Piece object");
        this.board = board;

        this.position.x = Math.floor(board.unitSize.width/2) - 2;
        this.position.y = -2;

        switch (blockShape) {
            case Piece.T_BLOCK: {
                this.subPieces[0][1] = "#990099";
                this.subPieces[1][0] = "#990099";
                this.subPieces[1][1] = "#990099";
                this.subPieces[1][2] = "#990099";
                this.assignedBlockShape = Piece.T_BLOCK;
                break;
            }
            case Piece.J_BLOCK: {
                this.subPieces[0][0] = "#0000ff";
                this.subPieces[1][0] = "#0000ff";
                this.subPieces[1][1] = "#0000ff";
                this.subPieces[1][2] = "#0000ff";
                this.assignedBlockShape = Piece.J_BLOCK;
                break;
            }
            case Piece.L_BLOCK: {
                this.subPieces[0][2] = "#ff6600";
                this.subPieces[1][0] = "#ff6600";
                this.subPieces[1][1] = "#ff6600";
                this.subPieces[1][2] = "#ff6600";
                this.assignedBlockShape = Piece.L_BLOCK;
                break;
            }
            case Piece.O_BLOCK: {
                this.subPieces = [
                    new Array(2).fill(null),
                    new Array(2).fill(null)
                ];
                this.subPieces[0][0] = "#ffff00";
                this.subPieces[1][0] = "#ffff00";
                this.subPieces[1][1] = "#ffff00";
                this.subPieces[0][1] = "#ffff00";
                this.assignedBlockShape = Piece.O_BLOCK;
                break;
            }
            case Piece.S_BLOCK: {
                this.subPieces[0][1] = "#00cc00";
                this.subPieces[0][2] = "#00cc00";
                this.subPieces[1][0] = "#00cc00";
                this.subPieces[1][1] = "#00cc00";
                this.assignedBlockShape = Piece.S_BLOCK;
                break;
            }
            case Piece.Z_BLOCK: {
                this.subPieces[0][0] = "#ff0000";
                this.subPieces[0][1] = "#ff0000";
                this.subPieces[1][1] = "#ff0000";
                this.subPieces[1][2] = "#ff0000";
                this.assignedBlockShape = Piece.Z_BLOCK;
                break;
            }
            case Piece.I_BLOCK: {
                this.subPieces = [
                    new Array(4).fill(null),
                    new Array(4).fill(null),
                    new Array(4).fill(null),
                    new Array(4).fill(null)
                ];
                this.subPieces[1][0] = "#00FFFF";
                this.subPieces[1][1] = "#00FFFF";
                this.subPieces[1][2] = "#00FFFF";
                this.subPieces[1][3] = "#00FFFF";
                this.assignedBlockShape = Piece.I_BLOCK;
                break;
            }

            case Piece.BLOCK_TEMPLATE: {
                this.assignedBlockShape = Piece.BLOCK_TEMPLATE;
                break;
            }
            default:
                throw ("Unsupported block type given to Piece object constructor");
        }
    }

    draw() {
        let drawDisplace = this.board.drawSize.x / this.board.unitSize.width;
        for (let i = 0; i < this.subPieces.length; i++) {
            for (let j = 0; j < this.subPieces.length; j++) {
                if (this.subPieces[i][j] !== null) {
                    this.board.context.fillStyle = this.subPieces[i][j];
                    this.board.context.fillRect(
                        drawDisplace * (j + this.position.x),
                        drawDisplace * (i + this.position.y),
                        drawDisplace, drawDisplace)
                }
            }
        }
    };

    rotate() {
        //this logic is to rotate a matrix 90 degrees clockwise
        let rotatedPiece = Piece.copyPiece(this);
        let rotatedPieceComponents = [];
        for (let i = 0; i < rotatedPiece.subPieces.length; i++)
            rotatedPieceComponents.push(new Array(rotatedPiece.subPieces.length).fill(null))

        let n = rotatedPiece.subPieces.length;
        for (let i = 0; i < n; i++) {
            for (let j = n - 1; j >= 0; j--) {
                if (rotatedPiece.subPieces[j][i] !== null) {
                    rotatedPieceComponents[i][n - j - 1] = rotatedPiece.subPieces[j][i]; //fully ripped from the internet
                }
            }
        }
        rotatedPiece.subPieces = rotatedPieceComponents;

        //if it crosses the edge of the board after rotation, move it inwards. 
        // if it hits something on the board, just push it upwards until it fits
        let horizontalCollision = false;
        while (Piece.detectCollision(rotatedPiece)) {
            //check each subPiece and see if it is horizontally out of bounds.
            //todo: i feel like this can be bundled in the detect collision method somehow, with a return value.
                //maybe the detect collision method would return a vector describing the global position of the item that is out of bounds
                //fixme: yeah i think the above is a good idea for later on. too lazy at the moment. 
            for(let i = 0; i < rotatedPiece.subPieces.length; i++){
                for(let j = 0; j < rotatedPiece.subPieces.length; j++){
                    if(j + rotatedPiece.position.x < 0){
                        rotatedPiece.position.x += 1;
                        horizontalCollision = true;
                        break;
                    }
                    else if (j + rotatedPiece.position.x > rotatedPiece.board.unitSize.width - 1){
                            rotatedPiece.position.x -= 1;
                            horizontalCollision = true;
                            break;
                        }
                }
            }
            if(! horizontalCollision) 
                rotatedPiece.moveUp(); 
        }

        this.subPieces = rotatedPiece.subPieces;
        this.position = rotatedPiece.position;
        this.idleTicks = 0;
    }

    moveDown() {
        this.idleTicks += 1;
        let newPiece = Piece.copyPiece(this);//this.proposeMoveDown();
        newPiece.position.y += 1;

        if (!Piece.detectCollision(newPiece)) {
            this.subPieces = newPiece.subPieces;
            this.position = newPiece.position;
            this.idleTicks = 0;
            return true;
        }
        return false;
    };

    moveHorizontal(direction) {
        this.idleTicks += 1;
        const newPiece = Piece.copyPiece(this);//this.proposeMoveHorizontal(direction);
        newPiece.position.x += direction;
        if (!Piece.detectCollision(newPiece)){
            this.position = newPiece.position;
            this.idleTicks = 0;
            return true;
        }
        return false;
    }

    moveUp() {
        let newPiece = Piece.copyPiece(this);
        do {
            newPiece.position.y -= 1;
        }
        while (Piece.detectCollision(newPiece));

        this.subPieces = newPiece.subPieces;
        this.position = newPiece.position;
    }

    static detectCollision(piece) {
        if (piece.board === null || piece === null)
            console.trace("Piece.detectCollision was not provided with a defined piece");
        for (let i = 0; i < piece.subPieces.length; i++) {
            for (let j = 0; j < piece.subPieces.length; j++) {
                if (piece.subPieces[i][j] !== null) {
                    //out of bounds vertically
                    if (i + piece.position.y > piece.board.unitSize.height - 1) {
                        return true;
                    }
                    //out of bounds horizontally
                    if (j + piece.position.x > piece.board.unitSize.width - 1 || j + piece.position.x < 0) {
                        return true;
                    }
                    //overlapping any piece on game board.
                    for (let by = 0; by < piece.board.grid.length; by++) {
                        for (let bx = 0; bx < piece.board.grid[0].length; bx++) {
                            if (piece.board.grid[by][bx] !== null)
                                if (by === i + piece.position.y && bx === j + piece.position.x) {
                                    return true;
                                }
                        }
                    }
                }
            }
        }
        return false;
    }

    static copyPiece(piece) {
        if (piece.board == undefined || piece == undefined)
            console.trace("Missing either board or piece parameter in call to Piece.copyPiece");

        let newPiece = new Piece(piece.board, Piece.BLOCK_TEMPLATE);
        newPiece.subPieces = [];
        for (let i = 0; i < piece.subPieces.length; i++)
            newPiece.subPieces.push(new Array(piece.subPieces.length).fill(null))

        newPiece.position = { x: piece.position.x, y: piece.position.y };

        for (let i = 0; i < piece.subPieces.length; i++)
            for (let j = 0; j < piece.subPieces.length; j++)
                newPiece.subPieces[i][j] = piece.subPieces[i][j]

        newPiece.assignedBlockShape = piece.assignedBlockShape;
        return newPiece;
    }
}

class Board {
    unitSize = { width: 10, height: 20 };
    drawSize = { x: 400, y: 800 };
    grid = null;
    context = null;

    constructor(context, width, height) {
        if (typeof context !== "object")
            throw ("Missing canvas context provided to Board object");
        if (width !== null && height !== null) {
            this.unitSize = { width: width, height: height };
        }
        this.grid = [];
        for (let i = 0; i < height; i++) {
            this.grid.push([]);
            for (let j = 0; j < width; j++)
                this.grid[i].push(null)
        }

        this.context = context;
    }

    draw = function () {
        if (this.context === null)
            return;
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.drawSize.x, this.drawSize.y);

        const pieceDraw = this.drawSize.x / this.unitSize.width;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j] !== null) {
                    this.context.fillStyle = this.grid[i][j];
                    this.context.fillRect(pieceDraw * j, pieceDraw * i, pieceDraw, pieceDraw);
                    this.context.fillStyle = "#FFF";
                    this.context.fillText(`(${j}, ${i})`,pieceDraw * j + 5, pieceDraw * i + 20);
                }
            }
        }
    }

    addPiece(piece){
        for(let i = 0; i < piece.subPieces.length; i++){
            for(let j = 0; j < piece.subPieces.length; j++){
                if(piece.subPieces[i][j] !== null){
                    this.grid[i + piece.position.y][j + piece.position.x] = piece.subPieces[i][j];
                }
            }
        }
    }

    clearRows(){
        for(let i = 0; i < this.grid.length; i++){
            let fullRow = true;
            for(let j = 0; j < this.grid[0].length; j++){
                if(this.grid[i][j] == null){
                    fullRow = false;
                }
            }
            if(fullRow){
                //zero out current row
                for(let z = 0; z < this.grid[i].length; z++)
                    this.grid[i][z] = null;

                //shift everthing above current row downwards
                for(let z = i-1; z > 0; z--){
                    for(let cell = 0; cell<this.grid[0].length; cell ++){
                        this.grid[z+1][cell] = this.grid[z][cell];
                        this.grid[z][cell] = this.grid[z-1][cell]
                    }
                }
            }
        }
    }
}

//========================================================================

let canvas = document.querySelector('#gameContainer');
if (canvas === null)
    throw ("Unable to locate the 'gameContainer' object on page.");

let context = canvas.getContext("2d");
let board = new Board(context, 10, 20);
let activePiece = new Piece(board, Piece.Z_BLOCK);

// board.grid[8][4] = "#FFF";
// board.grid[8][1] = "#FFF";
// board.grid[8][0] = "#FFF";
// board.grid[8][3] = "#FFF";
// board.grid[8][5] = "#FFF";
// board.grid[8][2] = "#FFF";
// board.grid[8][6] = "#FFF";
board.draw();
activePiece.draw();

canvas.addEventListener('click', function () {
    tick();
});
window.addEventListener('keydown', arrowKeysListener);


//========================================================================
function tick() {
    activePiece.moveDown();
    board.draw();
    activePiece.draw();

    if(activePiece.idleTicks > 2){
        board.addPiece(activePiece);
        board.clearRows();
        activePiece = new Piece(board, Math.floor(Math.random()*7));
        activePiece.draw();
    }

    logState();
}

function draw() {
    board.draw();
    activePiece.draw();
}

function arrowKeysListener(e) {
    switch (e.keyCode) {
        case 37://left
            console.log("left");
            activePiece.moveHorizontal(-1);
            break;
        case 39: //right
            console.log("right");
            activePiece.moveHorizontal(1);
            break;
        case 38: //up
            console.log("up");
            activePiece.moveUp();
            break;
        case 40: //down
            console.log("down");
            // activePiece.moveDown();
            tick();
            break;
        case 32: //spacebar
            console.log("spacebar -- rotate");
            activePiece.rotate();
            break;
        default:
            console.log(`Code ${e.keyCode} not registered`)

    }
    draw();
    logState();
}

function logState(){
    let logString = ``;
    logString += `ActivePiece position: X ${activePiece.position.x} || Y ${activePiece.position.y}\n`;
    logString += `ActivePiece idleTicks: ${activePiece.idleTicks}\n`;
    logString += `=======\n`;
    console.log(logString);
    console.log(board);
}
