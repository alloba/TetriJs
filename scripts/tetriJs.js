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
    pieceList = [];
    drawPiece = function(ctx, boardInfo){
        this.pieceList.forEach(p => p.drawPieceComponent(ctx, boardInfo))
    }
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
    activePiece.pieceList.push(p);
}

canvas.addEventListener('click', e => tick(), false);
stateLog();

//===============================================================

function tick(){
    drawBackground(context);
    activePiece.pieceList.forEach(p => p.posY += 1);
    activePiece.pieceList.forEach(p => p.drawPieceComponent(context, boardInfo));
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
    console.log(logString)
}



