var screenWidth=800//option[numOption].widthScreenBlock*mapSize;// ширина экрана
var screenHeight=600//option[numOption].heightScreenBlock*mapSize;// высота экрана
var windowWidth=document.documentElement.clientWidth;
var windowHeight=document.documentElement.clientHeight;
var windowWidthOld = windowWidth;
var windowHeighOld = windowHeight;
var  canvasWidth=800// windowWidth;
var  canvasHeight= 600//windowHeight;
var canvasWidthMore = null;
var canvas;
var context;
var cellWidth = 3;
var cellHeight = 3;
var gameMap = [];
var quantityKvadr = 3;
var level = 1;
var score = 10;
var sizeCell = 60;
let widthGame = sizeCell * cellWidth;
let heightGame = sizeCell * cellHeight;
let xStart = screenWidth/2 - widthGame / 2;
let yStart = screenHeight / 2 - heightGame / 2;
var timeOld = new Date().getTime();;
var timeNow = 0;
var time = 0;
var stepGame = 0;
var showKvadrs = false;
var clickKvadrArr = [];

window.addEventListener('load', function () {
    preload();
    create();
    setInterval(drawAll,16);
    setInterval(gameLoop,16);
});
window.onresize = function()
{
    updateSize()
    console.log("resize");
}
function updateSize()
{
    windowWidth=document.documentElement.clientWidth;
    windowHeight=document.documentElement.clientHeight;
    let mult =1;
    if (windowWidth>=windowHeight)
    {
        canvasWidth = /*canvas.width = */windowHeight*screenWidth/screenHeight;
        canvasHeight = /*canvas.height = */windowHeight;
        if (canvasWidth>windowWidth)
        {
            mult = windowWidth/canvasWidth;
           // canvas.width =
                canvasWidth *= mult;
            //canvas.height =
                canvasHeight *= mult;
        }
        canvasWidthMore = true;
    }
    else
    {
        canvasWidthMore = false;
        canvasWidth = /*canvas.width*/  windowWidth;
        canvasHeight= /*canvas.height*/  windowWidth*screenHeight/screenWidth;
    }
    
    canvas.setAttribute('width',canvasWidth);
    canvas.setAttribute('height',canvasHeight);
    canvas.style.setProperty('left', (window.innerWidth - canvas.width)/2 + 'px'); 
    canvas.style.setProperty('top', (window.innerHeight - canvas.height) / 2 + 'px'); 
    if (canvasWidthMore==true)
    {
        context.scale(windowHeight / screenHeight * mult, windowHeight / screenHeight * mult);   
        mouseMultX = windowHeight / screenHeight * mult;
        mouseMultY = windowHeight / screenHeight * mult;
    }
    else
    {
       context.scale(windowWidth/screenWidth,windowWidth/screenWidth);
       mouseMultX = windowWidth / screenWidth;
       mouseMultY = windowWidth / screenWidth;
    }
    //setOffsetMousePosXY((window.innerWidth - canvas.width)/2,
    //                        (window.innerHeight - canvas.height)/2);
    //camera.width = canvasWidth;
    //camera.height = canvasHeight;
}
function preload()
{

}
function create()
{
    canvas = document.getElementById("canvas");  
    context = canvas.getContext("2d");
    updateSize();
    initKeyboardAndMouse([])
    srand(2);
    createGameMap(cellWidth,cellHeight);
    fillgameMap(quantityKvadr)
    console.log(gameMap);

}
function drawAll()
{
    context.fillStyle = "rgb(210,210,210)"
    context.fillRect(0, 0, screenWidth, screenHeight);
    widthGame = sizeCell * cellWidth;
    heightGame = sizeCell * cellHeight;
    xStart = screenWidth/2 - widthGame / 2;
    yStart = screenHeight / 2 - heightGame / 2;
    let delta = 600;
    let widthPanelInfo =  delta;
    let startXPanel = /*xStart*/screenWidth/2 -delta/2;
    drawFillRectRound(startXPanel, yStart - 40,widthPanelInfo, 12, 20, 'rgb(255,198,80)');
    context.fillStyle = 'blue';
    context.font = 22+'px Arial';
    context.fillText('level: '+level,startXPanel+20,yStart - 40+13);
    
    let str = 'blocks: ' + quantityKvadr;
    let widthText=context.measureText(str).width;
    let x = widthPanelInfo / 2 - widthText / 2;
    context.fillText(str,startXPanel+x,yStart - 40+13);
    str = 'score: ' + score;
    widthText=context.measureText(str).width;
    x = widthPanelInfo / 2 - widthText / 2;
    context.fillText(str,startXPanel+widthPanelInfo-widthText-30,yStart - 40+13);
    for (let i = 0; i < cellHeight;i++)
    {
        for (let j = 0; j < cellWidth;j++)
        {
            context.strokeStyle = 'black';
            context.strokeRect(xStart + j * sizeCell, yStart + i * sizeCell, sizeCell, sizeCell);
            if ( showKvadrs==true && gameMap[i][j]==1)
            {
                context.fillStyle = "green";
                context.fillRect(xStart + j * sizeCell+1, yStart + i * sizeCell+1, sizeCell-1, sizeCell-1);
            }
        }
    }
}
function drawFillRectRound(x,y,width,height,round,color)
{
    context.save();
    context.beginPath();
    context.rect(x,y, width, height);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = color;
    context.lineJoin = 'round';
    context.lineWidth = round;
    context.stroke()
    context.restore();
}
function gameLoop()
{
   // var minRatio = canvasWidth > canvasHeight ? canvasHeight : canvasWidth;
   // sizeCell =50 //minRatio * 0.15;
    
    timeNow = new Date().getTime();
    time += timeNow - timeOld;
    //console.log('time ',time);
    if (stepGame==0)
    {
        if (time>1000)
        {
            showKvadrs = true;
            stepGame = 1;
            
            //nextLevel();
      
            //score += randomInteger(0, 100000);
            time = 0;
        
        }
        
    }
    else if (stepGame==1)
    {
        if (time>1000)
        {
            showKvadrs = false;
            stepGame = 2;
            time = 0;
        }
    }
    else if (stepGame==2)
    {
        if (mouseLeftClick())
        {
        //    if (mouseX>)
            console.log('click')
        }
    }
    timeOld = new Date().getTime();

}
function nextLevel()
{
    if (level<12)
    {  
        level++;  
        quantityKvadr++;
        if (level % 2==0)
        {
            cellWidth++;
        }
        else
        {
            cellHeight++;
        }
    }
        
    createGameMap(cellWidth, cellHeight);
    fillgameMap(quantityKvadr);
}
function createGameMap(cellWidth,cellHeight)
{
    gameMap = [];
    for (let i = 0; i < cellHeight;i++)
    {
        let buffer = [];
        for (let j = 0; j < cellWidth;j++)
        {
            buffer.push(0);
        }
        gameMap.push(buffer);
    }
}
function fillgameMap(quantityKvadr)
{
    for (let i = 0; i < quantityKvadr;i++)
    {
        let x = null;
        let y = null;
        do
        {
            x = randomInteger(0, cellWidth - 1);
            y = randomInteger(0, cellHeight - 1);
        }while (gameMap[y][x]==1)
        gameMap[y][x] = 1;
    }
}


//функция получения случайного числа от мин да макс
function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 +/* Math.random()*/MyRandom() * (max - min + 1);
  return Math.round(rand);
}
function MyRandom()// моя функция генерации псевдо случайных чисел
{
    let a = 1664525;
    let c = 1013904223;
    let m = Math.pow(2, 32);
    XR=(a*XR+c) % m;
    return XR *(1/ Math.pow(2, 32));
}
function srand(value)// установить базу для генерации случайных чисел
{
    XR=Math.trunc(value);
}