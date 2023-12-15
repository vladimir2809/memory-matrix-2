var screenWidth=800//option[numOption].widthScreenBlock*mapSize;// ширина экрана
var screenHeight=600//option[numOption].heightScreenBlock*mapSize;// высота экрана
var windowWidth=document.documentElement.clientWidth;
var windowHeight=document.documentElement.clientHeight;
var windowWidthOld = windowWidth;
var windowHeighOld = windowHeight;
var  canvasWidth=800// windowWidth;
var  canvasHeight= 600//windowHeight;
var canvasWidthMore = null;
var backgroundColor = 'rgb(220,120,120)';
var canvas;
var context;
var cellWidth = 3;
var cellHeight = 3;
var gameMap = [];
var quantityKvadr = 3;
var level = 1;
var score = 0;
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
var countRightKvadr = 0;
var countWrong = 0;
var resultLevel = null;
var clickKvadrArr = [];
var kvadrWrongXY = {};
var initYsdk = false;
var ADVOpen = false;
var lastTimeGame = 0;
var ADV = {
    flagInGame: false,
    timerOn:false,
    time: 0,
    timeOld:0,
    maxTime: 180000,
};
YaGames
    .init()
    .then(ysdk => {
        console.log('Yandex SDK initialized');
        window.ysdk = ysdk;
        initYsdk = true;
    });
function adversting()
{
    var interval=setInterval(function () {
        if (initYsdk==true)
        {
            ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: function () {
                        ADVOpen = false
                        console.log('adversting close');
                        if (ADV.flagInGame == false)ADV.flagInGame = true;

                    },
                    onOpen: function () {
                        ADVOpen = true;
                        console.log('adversting open');
                    },
                    onError: function () {
                        ADVOpen = false
                        console.log('adversting Error');
                        if (ADV.flagInGame == false)ADV.flagInGame = true;

                    },
                    onOffline: function () {
                        ADVOpen = false;
                        if (ADV.flagInGame == false)ADV.flagInGame = true;
                    }
                },
            });
            clearInterval(interval);
        }
    },100);
}
function callADV() 
{
    //if (ADV.timerOn==false)
    //{
    //    ADV.timerOn = true;
    //    ADV.time = ADV.timeOld = new Date().getTime();
    //}
    
    if (ADV.timerOn==true)
    {
        ADV.time = new Date().getTime();
        console.log(ADV.time - ADV.timeOld);
    }
    if (ADV.time > ADV.timeOld + ADV.maxTime)
    {
        ADV.timeOld = new Date().getTime(); 
        adversting();
    }
       
}
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
    document.getElementById('html').style.backgroundColor=backgroundColor;
    
    canvas = document.getElementById("canvas");  
  
    context = canvas.getContext("2d");
    updateSize();
    initKeyboardAndMouse([])
    let time = new Date().getTime();
    srand(time);
    if (checkGameSave()==true)
    {
        loadGameData();
    }
    createGameMap(cellWidth,cellHeight);
    fillgameMap(quantityKvadr)
    console.log(gameMap);
    audio = new Howl({
        src: ['sound/sound.mp3'],
        volume: 1,
        sprite:{
            click:[1,100],
            succes:[270,200],
            wrong:[660,670],
           // shot: [5000,1613],
           // laser: [7975,1300],
           // rocket: [9469,556],
           // soundTrack:[10*1000,4*60*1000,true]
        },
       
//        onend: function () {
//          console.log('Finished sound!');
 //     }
    });

}
function drawAll()
{
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, screenWidth, screenHeight);
    widthGame = sizeCell * cellWidth;
    heightGame = sizeCell * cellHeight;
    xStart = screenWidth/2 - widthGame / 2;
    yStart = screenHeight / 2 - heightGame / 2;
    let delta = 600;
    let widthPanelInfo =  delta;
    let startXPanel = /*xStart*/screenWidth/2 -delta/2;
    let startYPanel = 23;
    drawFillRectRound(startXPanel, startYPanel,widthPanelInfo, 12, 20, 'rgb(255,198,80)');
    context.fillStyle = 'blue';
    context.font = 22+'px Arial';
    context.fillText('Уровень: '+level,startXPanel+20,startYPanel+13);
    
    let str = 'Блоков: ' + quantityKvadr;
    let widthText=context.measureText(str).width;
    let x = widthPanelInfo / 2 - widthText / 2;
    context.fillText(str,startXPanel+x,startYPanel+13);
    str = 'Очки: ' + score;
    widthText=context.measureText(str).width;
    x = widthPanelInfo / 2 - widthText / 2;
    context.fillText(str,startXPanel+widthPanelInfo-widthText-30,startYPanel+13);
    for (let i = 0; i < cellHeight;i++)
    {
        for (let j = 0; j < cellWidth;j++)
        {
            context.strokeStyle = 'black';
            context.strokeRect(xStart + j * sizeCell, yStart + i * sizeCell, sizeCell, sizeCell);
            if ( (showKvadrs==true || resultLevel=='wrong') && gameMap[i][j]==1)
            {
                context.fillStyle = "green";
                context.fillRect(xStart + j * sizeCell+1, yStart + i * sizeCell+1, sizeCell-1, sizeCell-1);
            }
        }
    }
    for (let i = 0; i < clickKvadrArr.length;i++)
    {
        context.fillStyle = "green";
        context.fillRect(xStart + clickKvadrArr[i].x * sizeCell+1, 
                        yStart +clickKvadrArr[i].y * sizeCell+1,
                        sizeCell-1, sizeCell-1);
    }
    if (stepGame==3 || stepGame==4)
    {
        drawCross(kvadrWrongXY.x,kvadrWrongXY.y );
    }
    if (stepGame==4)
    {
        //context.fillStyle = 'blue';
        //context.font = 22+'px Arial';
        //let str = resultLevel;
        //let widthText=context.measureText(str).width;
        //let x = screenWidth/2 - widthText / 2;
        //context.fillText(str, x, screenHeight / 2);
        if (resultLevel=='correct')
        {
            drawLabelCorrect();
        }
        //else if (resultLevel=='wrong')
        //{
            
        //    drawLabelWrong();

        //}
    }
    //drawCross(1, 1);
    //drawLabelWrong ()
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
function drawCross(xCell,yCell)
{
    context.save();
    context.strokeStyle = 'red';
    context.lineWidth = 5;

    context.beginPath();
    context.moveTo(xStart+xCell*sizeCell+2,yStart+yCell*sizeCell+2);
    context.lineTo(xStart+xCell*sizeCell+sizeCell-2,yStart+yCell*sizeCell+sizeCell-2);
    context.stroke();

    context.beginPath();
    context.moveTo(xStart+xCell*sizeCell+2,yStart+yCell*sizeCell+sizeCell-2);
    context.lineTo(xStart+xCell*sizeCell+sizeCell-2,yStart+yCell*sizeCell+2);
    context.stroke();

    context.restore();
}
function drawLabelCorrect ()
{
    let width = 150;
    drawFillRectRound(screenWidth / 2 - width / 2, screenHeight / 2 - 50, width, 20, 20, 'rgb(100,255,100)');
    context.fillStyle = 'green';
    context.font = 25+'px Arial';
    let str = 'Верно';
    let widthText=context.measureText(str).width;
    let x = screenWidth/2 - widthText / 2;
    context.fillText(str, x, screenHeight / 2-33);
}
function drawLabelWrong ()
{
    let width = 150;
    drawFillRectRound(screenWidth / 2 - width / 2, screenHeight / 2 - 50, width, 20, 20, 'rgb(255,128,0)');
    context.fillStyle = 'red';
    context.font = 25+'px Arial';
    let str = 'Wrong';
    let widthText=context.measureText(str).width;
    let x = screenWidth/2 - widthText / 2;
    context.fillText(str, x, screenHeight / 2-33);
}
function removeDataSave()
{
    localStorage.removeItem('memoryMatrixSave');
}
function checkGameSave()
{
    if (localStorage.getItem('memoryMatrixSave')!=null && 
        localStorage.getItem('memoryMatrixSave')!=undefined)
    {
        return true;
    }
    return false;
}
function saveGameData() 
{
    let time = new Date().getTime();
    localStorage.setItem('memoryMatrixSave', JSON.stringify({ level:level, quantityKvadr:quantityKvadr,
                                                            score:score,
                                                            cellWidth:cellWidth,
                                                            cellHeight:cellHeight,
                                                            time:time}));
}
function loadGameData()
{
    let data=localStorage.getItem('memoryMatrixSave');
    //alert(data);
    data = JSON.parse(data);
    

    if (typeof(data.time)=='number')
    {
        lastTimeGame=data.time;
    }
    let time = new Date().getTime();
    if (time<lastTimeGame+24*60*60*1000)
    {    
        if (typeof(data.level)=='number')
        {
            level=data.level;
        }
        if (typeof(data.quantityKvadr)=='number')
        {
            quantityKvadr=data.quantityKvadr;
        }
        if (typeof(data.score)=='number')
        {
            score=data.score;
        }
        if (typeof(data.cellWidth)=='number')
        {
            cellWidth=data.cellWidth;
        }
        if (typeof(data.cellHeight)=='number')
        {
            cellHeight=data.cellHeight;
        }
    }
    else
    {
        removeDataSave()  

    }


}
function gameLoop()
{
   // var minRatio = canvasWidth > canvasHeight ? canvasHeight : canvasWidth;
   // sizeCell =50 //minRatio * 0.15;
    
    timeNow = new Date().getTime();
    if (ADV.flagInGame==false)
    {
        //ADV.flagInGame = true;
        adversting();
    }
    if (ADVOpen==false && ADV.flagInGame==true) 
    {
        time += timeNow - timeOld;
    }
    if (ADV.timerOn==false)
    {
        ADV.timerOn = true;
        ADV.time = ADV.timeOld = new Date().getTime();
    }
    //console.log('time ',time);
    if (stepGame==0)
    {
        if (time>1000)
        {
            showKvadrs = true;
            stepGame = 1;
            
           // nextLevel();
            createGameMap(cellWidth, cellHeight);
            fillgameMap(quantityKvadr);
            //score += randomInteger(0, 100000);
            time = 0;
        
        }
        
    }
    else if (stepGame==1)
    {
        if (time>1000 + level * 200)
        {
            showKvadrs = false;
            stepGame = 2;
            time = 0;
            resetMouseLeft();
        }
    }
    else if (stepGame==2)
    {
        if (mouseLeftClick())
        {
        //    if (mouseX>)
            //console.log('click ', checkKvadr(mouseX, mouseY));
            if (checkKvadr(mouseX, mouseY)==1)
            {
               
                let kvadrXY = calcKvadrXY(mouseX, mouseY);
                if (checkOpenKvadr(kvadrXY.x, kvadrXY.y) == false)
                {
                    audio.play('click');
                    clickKvadrArr.push({ x: kvadrXY.x, y: kvadrXY.y });
                    countRightKvadr++;
                    score += 10;
                    if (countRightKvadr==quantityKvadr)
                    {
                        resultLevel = 'correct';
                        //score += 10 * Math.pow(2, level);
                        stepGame = 3;
                        time = 0;
                    }
                }
            }
            else if (checkKvadr(mouseX, mouseY)==0)
            {
                //audio.play('click');
                resultLevel = 'wrong';
                audio.play('wrong');
                kvadrWrongXY = calcKvadrXY(mouseX, mouseY);
                stepGame = 3;
                countWrong++;
                time = 0;
            }
        }
    }
    else if (stepGame==3)
    {
        if (time>400)
        {
            if (resultLevel=='correct') 
            {
                audio.play('succes');
                score += 10 * Math.pow(2, level);
            }
            stepGame = 4;
            time = 0;
        }
    }
    else if (stepGame==4)
    {
        if (time>1500)
        {
            if (resultLevel == 'correct')
            {
                nextLevel();
                countWrong = 0;
                saveGameData();
            }
            if (resultLevel == 'wrong' && countWrong >= 2) 
            {
                backLevel();
                countWrong = 0;
                callADV();
            }
            
            clickKvadrArr = [];
            kvadrWrongXY = {};
            resultLevel = null;
            countRightKvadr = 0;
            stepGame = 0;
            time = 0;
        }
    }
    timeOld = new Date().getTime();

}
function checkOpenKvadr(x,y)
{
    for (let i = 0; i < clickKvadrArr.length;i++)
    {
        if (x==clickKvadrArr[i].x && y==clickKvadrArr[i].y)
        {
            return true;
        }
    }
    return false;
}
function checkKvadr(x,y)
{
    for (let i = 0; i < cellHeight;i++)
    {
        for (let j = 0; j < cellWidth;j++)
        {

            if (x>xStart+j*sizeCell && x<xStart+j*sizeCell+sizeCell &&
                y>yStart+i*sizeCell && y<yStart+i*sizeCell+sizeCell )
            {    
                if (gameMap[i][j]==1)
                {
                    return 1;
                }
                else
                {
                    return 0
                }
            }
        }
    }
    return null;
}
function calcKvadrXY(x,y) 
{
    for (let i = 0; i < cellHeight;i++)
    {
        for (let j = 0; j < cellWidth;j++)
        {

            if (x>xStart+j*sizeCell && x<xStart+j*sizeCell+sizeCell &&
                y>yStart+i*sizeCell && y<yStart+i*sizeCell+sizeCell )
            {    
                return { x: j, y: i };
            }
        }
    }
    return null;
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
        
    //createGameMap(cellWidth, cellHeight);
    //fillgameMap(quantityKvadr);
}
function backLevel()
{
    if (level>1)
    {  
        level--;  
        quantityKvadr--;
        if (level % 2!=0)
        {
            cellWidth--;
        }
        else
        {
            cellHeight--;
        }
    }
        
    //createGameMap(cellWidth, cellHeight);
    //fillgameMap(quantityKvadr);
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


////функция получения случайного числа от мин да макс
//function randomInteger(min, max) {
//  // получить случайное число от (min-0.5) до (max+0.5)
//  let rand = min - 0.5 +/* Math.random()*/MyRandom() * (max - min + 1);
//  return Math.round(rand);
//}
//function MyRandom()// моя функция генерации псевдо случайных чисел
//{
//    let a = 1664525;
//    let c = 1013904223;
//    let m = Math.pow(2, 32);
//    XR=(a*XR+c) % m;
//    return XR *(1/ Math.pow(2, 32));
//}
//function srand(value)// установить базу для генерации случайных чисел
//{
//    XR=Math.trunc(value);
//}