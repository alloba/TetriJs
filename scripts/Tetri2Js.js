class Piece {
    static T_BLOCK = "T_BLOCK";
    static BLOCK_TEMPLATE = "BLOCK_TEMPLATE";
    assignedBlockShape = "";
    board = null;
    subPieces = [
        new Array(3).fill(null),
        new Array(3).fill(null),
        new Array(3).fill(null)
    ];
    position = {x: 0, y: 0}; // upper left of piece's grid


    constructor(board, blockShape) {
        if (board === null || board === undefined)
            throw("No board provided instantiating new Piece object");
        this.board = board;

        switch (blockShape) {
            case Piece.T_BLOCK: {
                this.subPieces[0][1] = "#FFF000";
                this.subPieces[1][0] = "#FFF000";
                this.subPieces[1][1] = "#FFF000";
                this.subPieces[1][2] = "#FFF000";
                this.assignedBlockShape = Piece.T_BLOCK;
                break;
            }
            case Piece.BLOCK_TEMPLATE: {
                this.assignedBlockShape = Piece.BLOCK_TEMPLATE;
                break;
            }
            default:
                throw("Unsupported block type given to Piece object constructor");
        }
    }

    draw() {
        console.log(this.position);
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

    proposeRotation() {
        const newPiece = Piece.copyPiece(this.board, this);
        let rotatedPieceComponents = [
            new Array(newPiece.subPieces.length).fill(null),
            new Array(newPiece.subPieces.length).fill(null),
            new Array(newPiece.subPieces.length).fill(null)
        ];

        let n = newPiece.subPieces.length;
        for (let i = 0; i < n; i++) {
            for (let j = n - 1; j >= 0; j--) {
                if (newPiece.subPieces[j][i] !== null) {
                    rotatedPieceComponents[i][n - j - 1] = newPiece.subPieces[j][i];
                }
            }
        }
        newPiece.subPieces = rotatedPieceComponents;
        return newPiece;
    }

    rotate() {
        const newPiece = this.proposeRotation();
        if (!Piece.detectCollision(board, newPiece)) {
            this.subPieces = newPiece.subPieces;
            this.position = newPiece.position;
        }
    };

    proposeMoveDown() {
        const newPiece = Piece.copyPiece(this.board, this);
        newPiece.position.y = this.position.y + 1;
        return newPiece;
    }

    moveDown() {
        let newPiece = this.proposeMoveDown();
        if (!Piece.detectCollision(this.board, newPiece)) {
            this.subPieces = newPiece.subPieces;
            this.position = newPiece.position;
        }
    };

    proposeMoveHorizontal(direction) {
        if (direction !== -1 && direction !== 1)
            throw("invalid value passed to proposeMoveHorizontal. Must be either 1 or -1");
        const newPiece = Piece.copyPiece(this.board, this);
        newPiece.position.x += direction;
        return newPiece;
    }

    moveHorizontal(direction) {
        const newPiece = this.proposeMoveHorizontal(direction);
        console.log(Piece.detectCollision(this.board, newPiece));

        if (!Piece.detectCollision(this.board, newPiece))
            this.position = newPiece.position;
    }

    static detectCollision(board, piece) {
        if (board === null || piece === null)
            throw("Piece.detectCollision was not provided with a defined board and piece (check if you forgot the board)");
        for (let i = 0; i < piece.subPieces.length; i++) {
            for (let j = 0; j < piece.subPieces.length; j++) {
                if (piece.subPieces[i][j] !== null) {
                    //out of bounds vertically
                    if (i + piece.position.y > board.unitSize.height - 1) {
                        console.log(i + piece.position.y);
                        console.log(piece.subPieces[i][j]);
                        return true;
                    }
                    //out of bounds horizontally
                    if (j + piece.position.x > board.unitSize.width - 1 || j + piece.position.x < 0) {
                        console.log(j + piece.position.x);
                        return true;
                    }
                    //overlapping any piece on game board.
                    for (let by = 0; by < board.grid.length; by++) {
                        for (let bx = 0; bx < board.grid[0].length; bx++) {
                            if (board.grid[by][bx] !== null)
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

    static copyPiece(board, piece) {
        let newPiece = new Piece(board, Piece.BLOCK_TEMPLATE);
        newPiece.subPieces = [];
        for (let i = 0; i < piece.subPieces.length; i++)
            newPiece.subPieces.push(new Array(3).fill(""))

        newPiece.position = {x: piece.position.x, y: piece.position.y};

        for (let i = 0; i < piece.subPieces.length; i++)
            for (let j = 0; j < piece.subPieces.length; j++)
                newPiece.subPieces[i][j] = piece.subPieces[i][j]

        newPiece.assignedBlockShape = piece.assignedBlockShape;
        return newPiece;
    }
}

class Board {
    unitSize = {width: 10, height: 20};
    drawSize = {x: 400, y: 800};
    grid = null; //new Array(20).fill(new Array(10).fill(null));
    context = null;

    constructor(context, width, height) {
        if (typeof context !== "object")
            throw ("Missing canvas context provided to Board object");
        if (width !== null && height !== null) {
            this.unitSize = {width: width, height: height};
        }
        this.grid = [];//new Array(height).fill(new Array(width).fill(null));
        for(let i = 0; i < height; i++) {
            this.grid.push([]);
            for(let j = 0; j < width; j++)
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
                if(this.grid[i][j] !== null) {
                    console.log(pieceDraw * j + "__" + pieceDraw * i);
                    console.log(pieceDraw * (j+1) + "__" + pieceDraw * (i+1));
                    this.context.fillStyle = this.grid[i][j];
                    this.context.fillRect(pieceDraw * j, pieceDraw * i, pieceDraw, pieceDraw)
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
const activePiece = new Piece(board, Piece.T_BLOCK);


board.draw();
activePiece.rotate();
activePiece.rotate();
board.grid[8][4] = "#FFF";
canvas.addEventListener('click', function () {
    tick();
});
window.addEventListener('keydown', arrowKeysListener);


//========================================================================
function tick() {
    activePiece.moveDown();
    board.draw();
    activePiece.draw();
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
            activePiece.rotate();
            break;
        case 40: //down
            console.log("down");
            activePiece.moveDown();
            break;

    }
    draw();
}
