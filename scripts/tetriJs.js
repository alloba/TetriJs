console.log("game script being executed");

class BoardInformation{
    maxX = 100;
    maxY = 200;
    pieceWidth = 10;
    pieceHeight = 20;
}

class PieceComponent {
    posX = 0;
    posY = 0;
    color = "#FFFFFF";

    drawPieceComponent = function(ctx, boardInfo){
        ctx.fillStyle = this.color;
        const drawDim = this.calculatePiecePixels(boardInfo);
        ctx.fillRect(drawDim.startX,drawDim.startY,drawDim.xIncrement,drawDim.yIncrement);
    };

    calculatePiecePixels = function(boardInfo){
        const xIncrement = boardInfo.maxX / boardInfo.pieceWidth;
        const startX = xIncrement * this.posX;

        const yIncrement = boardInfo.maxY / boardInfo.pieceHeight;
        const startY = xIncrement * this.posY;

        return {startX, startY, xIncrement, yIncrement};
    }
}

class Piece {
    pieceComponents = [];
    centerPoint = {x:0, y:0};
    drawPiece = function(ctx, boardInfo){
        this.pieceComponents.forEach(p => p.drawPieceComponent(ctx, boardInfo))
    };

    moveDown = function(boardInfo){
        if(! this.pieceComponents.some(pc => pc.posY >= boardInfo.pieceHeight - 1)){
            this.pieceComponents.forEach(pc => pc.posY += 1);
            this.centerPoint.y += 1;
        }
    };

    //to allow rotation, need to phrase the piece components in terms of a 2d array, instead of a list.
    //then i can also had a center point defined or something, to calculate rotation
}


//=============================================================

const gameWidth = 400;
const gameHeight = 800;

//tetris game board is 10 across and 20 high. canvas should be some nice multiple of that.

let canvas = document.querySelector('#gameContainer');
if (canvas === null)
    console.log("Unable to locate the 'gameContainer' object on page.");

let context = canvas.getContext("2d");

const boardInfo = new BoardInformation();
boardInfo.maxX = gameWidth;
boardInfo.maxY = gameHeight;

let activePiece = new Piece();
for(let i = 0; i < 10; i++){
    let p = new PieceComponent();
    p.posX= i;
    p.posY = 0;
    p.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    activePiece.pieceComponents.push(p);
}
activePiece.pieceComponents[3].posY = -2;

canvas.addEventListener('click', e => {tick(); stateLog()}, false);
stateLog();

//===============================================================

function tick(){
    drawBackground(context);
    activePiece.moveDown(boardInfo);
    activePiece.drawPiece(context, boardInfo)
}

function drawBackground(ctx){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0 , 0, gameWidth, gameHeight);
}

function stateLog(){
    let logString = "";
    logString += ("Start Log\n");
    logString += (`Board MaxX = ${boardInfo.maxX}\n`);
    logString += (`Board MaxY = ${boardInfo.maxY}\n`);
    logString += (`Board PieceHeight = ${boardInfo.pieceHeight}\n`);
    logString += (`Board PieceWidth = ${boardInfo.pieceWidth}\n`);
    logString += ("End Log\n");
    console.log(logString);
}



