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
    pieceComponents = [[]];
    centerPoint = {x:0, y:0};
    drawPiece = function(ctx, boardInfo){
        this.pieceComponents.flat().forEach(p => p.drawPieceComponent(ctx, boardInfo));
        console.log("====Draw Function=====");
        console.log(`${this.pieceComponents[0][0].posX}, ${this.pieceComponents[0][0].posY}`);
        console.log(`${this.pieceComponents[0][1].posX}, ${this.pieceComponents[0][1].posY}`);
        console.log(`${this.pieceComponents[0][2].posX}, ${this.pieceComponents[0][2].posY}`);
        console.log("=========");
    };

    moveDown = function(boardInfo){
        if(! this.pieceComponents.flat().some(pc => pc.posY >= boardInfo.pieceHeight - 1)){
            this.pieceComponents.flat().forEach(pc => pc.posY += 1);
            this.centerPoint.y += 1;
        }
    };

    rotatePiece = function(){
        let rotatedPieceComponents = [];
        this.pieceComponents.forEach(row => rotatedPieceComponents.push(new Array(row.length).fill(new PieceComponent())));

        let n = this.pieceComponents.length;
        for(let i = 0; i < n; i++){
            for(let j = n-1; j >= 0; j--){
                rotatedPieceComponents[i][n-j-1] = this.pieceComponents[j][i]
            }
        }
        console.log("====Original=====");
        console.log(`${this.pieceComponents[0][0].posX}, ${this.pieceComponents[0][0].posY}`);
        console.log(`${this.pieceComponents[0][1].posX}, ${this.pieceComponents[0][1].posY}`);
        console.log(`${this.pieceComponents[0][2].posX}, ${this.pieceComponents[0][2].posY}`);
        console.log("=========");
        console.log("====New=====");
        console.log(`${rotatedPieceComponents[0][0].posX}, ${rotatedPieceComponents[0][0].posY}`);
        console.log(`${rotatedPieceComponents[0][1].posX}, ${rotatedPieceComponents[0][1].posY}`);
        console.log(`${rotatedPieceComponents[0][2].posX}, ${rotatedPieceComponents[0][2].posY}`);
        this.pieceComponents = rotatedPieceComponents;
        console.log("=========");
    }
}

class PieceGenerator {
    static JUNK_PIECE_COMPONENT = function(){
      const junk = new PieceComponent();
      junk.posX = 2; junk.posY = -0;
      return junk;
    };

    static T_BLOCK = function() {
        const pc1 = new PieceComponent();
        pc1.posY = 1; pc1.posX = 4;

        const pc2 = new PieceComponent();
        pc2.posY = 1; pc2.posX = 5;

        const pc3 = new PieceComponent();
        pc3.posY = 1; pc3.posX = 6;

        const pc4 = new PieceComponent();
        pc4.posY = 0; pc4.posX = 5;

        const p = new Piece();
        p.pieceComponents = [
            new Array(3).fill(PieceGenerator.JUNK_PIECE_COMPONENT()),
            new Array(3).fill(PieceGenerator.JUNK_PIECE_COMPONENT()),
            new Array(3).fill(PieceGenerator.JUNK_PIECE_COMPONENT())
        ];

        p.centerPoint = {x:6,y:0};
        p.pieceComponents[1][0] = pc1;
        p.pieceComponents[1][1] = pc2;
        p.pieceComponents[1][2] = pc3;
        p.pieceComponents[0][1]= pc4;
        p.pieceComponents.flat().forEach( pc => pc.color = "#ff0000");
        return p;
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

// let activePiece = new Piece();
// for(let i = 0; i < 10; i++){
//     let p = new PieceComponent();
//     p.posX= i;
//     p.posY = 0;
//     p.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
//     activePiece.pieceComponents.push(p);
// }
// activePiece.pieceComponents[3].posY = -2;

let activePiece = PieceGenerator.T_BLOCK();
// activePiece.rotatePiece();
// activePiece.rotatePiece();
tick();

canvas.addEventListener('click', () => {activePiece.rotatePiece(0)});
canvas.addEventListener('click', () => {tick(); stateLog()}, false);
tick();
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
    logString += (`Active Piece Center = ${activePiece.centerPoint.x}, ${activePiece.centerPoint.y}\n`);
    logString += ("End Log\n");
    // console.log(logString);
}



