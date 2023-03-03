// DISCLAIMER, THIS IS A TEMP CODE FOR THE MAP CREATOR TOOLS, IM LITERALLY RUSHING THIS TOOL.. SRY I WILL IMPROVE THAT

let animationIndex = 0;
let maxAnimationIndex = 3;

function preload() {
    loadAssets();
  }
  
  let canvasSize = [window.innerWidth /1.335, window.innerHeight / 1.4]

function setup() {
    
    canvas = createCanvas(canvasSize[0], canvasSize[1]);
    noSmooth();
    frameRate(60);
    resizeArrayMap()
  }

  function windowResized() {
    canvasSize = [window.innerWidth /1.335, window.innerHeight / 1.4]
    resizeCanvas(window.innerWidth /1.335, window.innerHeight / 1.4);
  }

function draw(){
  if(imageIsLoaded === true){
    displayMap();
    upAnimationIndex();
  }
  if(imageIsLoaded === true && isInCanvas() === false){
    inputManager();
    previOnMap();
  }
}

const upAnimationIndex = () => {
  animationIndex += 0.08;
  if(animationIndex >= maxAnimationIndex){
    animationIndex = 0;
  }
}


function previOnMap(){
  let tileOnMouse = getTileWithScreenPosition(mouseX - xMapPos, mouseY - yMapPos);
  if(tileOnMouse === false || mouseY > canvasSize[1] || mouseX > canvasSize[0]){
    return;
  }
  displayTiles(tileOnMouse[0], tileOnMouse[1], tileSize, tileSelected)
}


let canCtrlZ = true;

let backTab = [];

let mouseGestion = false;

function inputManager() {
  // ctrl z frr
  if(keyIsDown(17) && keyIsDown(90))
  {
    if(canCtrlZ === true){
      canCtrlZ = false;
      goBackInTab();
    }
    return;
  }else{
    canCtrlZ = true;
  }

  // ! ----------------------

  if(mouseIsPressed === true && tileSelected === -2)
  {
    cursor('grab');
    dragging();
    return;
  }

  if(mouseGestion === true && mouseIsPressed === false && previousPosMouseX !== null && previousPosMouseY !== null){
    mouseGestion = false;
    previousPosMouseX = null;
    previousPosMouseY = null;
  }

  // ! ----------------------





  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // When players touch left arrow or Q
    xMapPos-=2;
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(81)) { // When players touch left arrow or Q
    xMapPos+=2;
  }
  if(keyIsDown(UP_ARROW) || keyIsDown(90)) { // When players touch up arrow or Z
    yMapPos+=2;
  }
  if(keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // When players touch down arrow or S
    yMapPos-=2;
  }
  if (mouseIsPressed === true) {
    paintTileOnClickWithMousePos(tileSelected)
  }
}

let previousPosMouseX = null;
let previousPosMouseY = null;
function dragging() {
  if(previousPosMouseY === null ||previousPosMouseY === null)
  {
    previousPosMouseX = mouseX;
    previousPosMouseY = mouseY;
  }

  xMapPos += mouseX - previousPosMouseX;
  yMapPos += mouseY - previousPosMouseY;
  previousPosMouseX = mouseX;
  previousPosMouseY = mouseY;
  mouseGestion = true;
}

function mouseWheel(event) {
  if(isInCanvas() === true){
    return;
  }
  let zoom = event.delta*0.01;
  tileSize += zoom;
}

const goBackInTab = () => {
  if(backTab.length > 0){
    mapLayers = JSON.parse(JSON.stringify(backTab[backTab.length-1]))
    backTab.pop();
  }
}

const paintTileOnClickWithMousePos = (tileSelectedByUser = tileSelected) => {
  let tileOnMouse = getTileWithScreenPosition(mouseX - xMapPos, mouseY - yMapPos);
  if(tileOnMouse === false){
    return;
  }
  switch(selectedLayer){
    case "groundLayer" :
      if(mapLayers.groundLayer[tileOnMouse[1]][tileOnMouse[0]] !== tileSelectedByUser){
        backTab.push(JSON.parse(JSON.stringify(mapLayers)));
      }
      mapLayers.groundLayer[tileOnMouse[1]][tileOnMouse[0]] = tileSelectedByUser
      break;
    case "objectLayer" :
      if(mapLayers.objectLayer[tileOnMouse[1]][tileOnMouse[0]] !== tileSelectedByUser){
        backTab.push(JSON.parse(JSON.stringify(mapLayers)));
      }
      mapLayers.objectLayer[tileOnMouse[1]][tileOnMouse[0]] = tileSelectedByUser
      break;
    default :
      throw new Error("Layer isn't defined")
  }
}

const isInCanvas = () => mouseY > canvasSize[1] || mouseX > canvasSize[0] 