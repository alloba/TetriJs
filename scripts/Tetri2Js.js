// class SubPiece {
//     position = {x: -1, y: -1}; //relative to parent piece's base position
//     color = "#FFF";
//
//     constructor(color, x, y) {
//         this.color = color;
//         this.position.x = x;
//         this.position.y = y;
//     }
// }

class Piece {
    static T_BLOCK = "T_BLOCK";
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
                this.subPieces[0][1] = "#FFF000"; //new SubPiece("#FFF000", 1, 0);
                this.subPieces[1][0] = "#FFF000"; //new SubPiece("#FFF000", 0, 1);
                this.subPieces[1][1] = "#FFF000"; //new SubPiece("#FFF000", 1, 1);
                this.subPieces[1][2] = "#FFF000"; //new SubPiece("#FFF000", 2, 1);
                break;
            }
            default:
                throw("Unsupported block type given to Piece object constructor");
        }
    }

    draw() {
        console.log(this.position);
        let drawDisplace = this.board.drawSize.x / this.board.unitSize.width;
        for(let i = 0; i < this.subPieces.length; i++) {
            for (let j = 0; j < this.subPieces.length; j++) {
                if(this.subPieces[i][j] !== null){
                    this.board.context.fillStyle = this.subPieces[i][j];
                    this.board.context.fillRect(
                        drawDisplace * (j+ this.position.x),
                        drawDisplace * (i+this.position.y),
                        drawDisplace, drawDisplace)
                }
            }
        }
    };

    moveDown() {
        //if no pieces are below the board height (doesnt check board state at all otherwise)
        let canMoveDown = true;
        for(let i = 0; i < this.subPieces.length; i++) {
            for (let j = 0; j < this.subPieces.length; j++) {
                if(this.subPieces[i][j] !== ""){
                    if(i + this.position.y >= this.board.unitSize.height)
                        canMoveDown = false;
                }
            }
        }

        if(canMoveDown)
            this.position.y += 1;

        // if (!this.subPieces.flat().filter(sp => sp !== null).some(sp => sp.position.y + this.position.y >= this.board.unitSize.height - 1))
        //     this.position.y += 1;
        // this.subPieces.flat().filter(sp => sp!== null).forEach(sp => sp.position.y += 1);
    };

    rotate() {
        let rotatedPieceComponents = [
            new Array(this.subPieces.length).fill(null),
            new Array(this.subPieces.length).fill(null),
            new Array(this.subPieces.length).fill(null)
        ];

        let n = this.subPieces.length;
        for (let i = 0; i < n; i++) {
            for (let j = n - 1; j >= 0; j--) {
                if (this.subPieces[j][i] !== null) {
                    rotatedPieceComponents[i][n - j - 1] = this.subPieces[j][i];
                }
            }
        }
        this.subPieces = rotatedPieceComponents;
    };
}

class Board {
    unitSize = {width: 10, height: 20};
    drawSize = {x: 400, y: 800};
    grid = new Array(20).fill(new Array(10).fill(""));
    context = null;

    constructor(context, width, height) {
        if (typeof context !== "object")
            throw ("Missing canvas context provided to Board object");
        if (width !== null && height !== null)
            this.unitSize = {width: width, height: height};

        this.grid = new Array(height).fill(new Array(width).fill(""));
        this.context = context;
    }

    draw = function () {
        if (this.context === null)
            return;
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.drawSize.x, this.drawSize.y);
    }
}

//========================================================================

let canvas = document.querySelector('#gameContainer');
if (canvas === null)
    throw ("Unable to locate the 'gameContainer' object on page.");

let context = canvas.getContext("2d");
const board = new Board(context, 10, 20);
const activePiece = new Piece(board, Piece.T_BLOCK);


board.draw();
canvas.addEventListener('click', function(){
    activePiece.moveDown();
    activePiece.rotate();
    tick();
});


//========================================================================
function tick() {
    board.draw();
    activePiece.draw();
}

function draw() {
}
