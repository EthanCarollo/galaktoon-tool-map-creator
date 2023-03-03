

let mapLayers = {
    groundLayer : [
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    objectLayer : 
    [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]
}

let canDisplayGround = true;
let canDisplayObject = true;

let selectedLayer = "groundLayer"

let xMapPos = 0;
let yMapPos = 0;

let tileSelected = -2;

let sizeMap = 20;
let tileSize = 50;

const resizeArrayMap = (size = sizeMap) => {
    mapLayers.groundLayer.length = size
    mapLayers.objectLayer.length = size
    for(let i = 0; i<mapLayers.groundLayer.length;i++){
        mapLayers.groundLayer[i] = []
        mapLayers.objectLayer[i] = []
        mapLayers.groundLayer[i].length = size
        mapLayers.objectLayer[i].length = size
        for(let j = 0; j<mapLayers.groundLayer[i].length;j++){
            mapLayers.groundLayer[i][j] = 0;
            mapLayers.objectLayer[i][j] = -1;
        }
    }
}

const displayMap = () => {
    background(225)
    if(canDisplayGround===true){
        displayLayer(mapLayers.groundLayer);
    }
    if(canDisplayObject===true){
        displayLayer(mapLayers.objectLayer);
    }
}

const createLayersDisplay = () => {
    // DISGRACEFUL SRY RUSHING TIME
    let layerList = document.getElementById("innerLayerList")
    layerList.innerHTML = " ";

    let layergroundLayerEyes = layerList.appendChild(document.createElement("div"))
    layergroundLayerEyes.classList.add("eyeOpen");
    layergroundLayerEyes.addEventListener("mouseup", () => {
        layergroundLayerEyes.classList.toggle("unactive");
        if(canDisplayGround === true){
            canDisplayGround = false;
        }else{
            canDisplayGround = true;
        }
    })

    let layergroundLayer = layerList.appendChild(document.createElement("div"))
    layergroundLayer.innerHTML = "<h1>GROUND LAYER</h1>"
    layergroundLayer.classList.add("layer")
    layergroundLayer.classList.add("active");
    layergroundLayer.addEventListener("mouseup", () => {
        layergroundLayer.classList.add("active");
        layerobjectLayer.classList.remove("active");
        selectedLayer = "groundLayer"
    })

    let layerobjectLayerEyes = layerList.appendChild(document.createElement("div"))
    layerobjectLayerEyes.classList.add("eyeOpen");
    layerobjectLayerEyes.addEventListener("mouseup", () => {
        layerobjectLayerEyes.classList.toggle("unactive");
        if(canDisplayObject === true){
            canDisplayObject = false;
        }else{
            canDisplayObject = true;
        }
    })

    let layerobjectLayer = layerList.appendChild(document.createElement("div"))
    layerobjectLayer.innerHTML = "<h1>COLLIDER & INTERACTION LAYER</h1>"
    layerobjectLayer.classList.add("layer")
    layerobjectLayer.addEventListener("mouseup", () => {
        layergroundLayer.classList.remove("active");
        layerobjectLayer.classList.add("active");
        selectedLayer = "objectLayer"
    })
}

const displayLayer = (mapLayer) => {
    for(let y = 0; y < mapLayer.length; y++)
    {
        for(let x = 0; x < mapLayer.length; x++){
            displayTiles(x, y, tileSize, mapLayer[y][x])
        }
    }
}

const displayTiles = (x, y, size, id) => {
    if(isStroke === true){
        fill(color(255, 204, 0, 0));
        rect(x*size + xMapPos, y*size + yMapPos, size, size);
    }
    if(id < 0){
        return;
    }
    let xPos = x*size + xMapPos;
    let yPos = (y + (1 - tilesData[id].yWidth)) *size + yMapPos
    if(tilesData[id].isAnimated === true){
        imageToShow = tilesData[id].image.get(16*Math.floor(animationIndex), 0, 16, 16)
        image(imageToShow, xPos, yPos, size * tilesData[id].xWidth, size * tilesData[id].yWidth) 
    }else{
        image(tilesData[id].image, xPos, yPos, size * tilesData[id].xWidth, size * tilesData[id].yWidth) 
    } 
    if(isStroke === true){
        fill(color(255, 204, 0, 0));
        rect(xPos, yPos, size, size);
    }
}

const getTileWithScreenPosition = (x, y) => {
    if(Math.floor(x / tileSize)>=mapLayers.groundLayer[0].length || Math.floor(x / tileSize) < 0)
    {
        return false
    }
    if(Math.floor(y / tileSize)>= mapLayers.groundLayer.length || Math.floor(y / tileSize) < 0)
    {
        return false;
    }
    return [Math.floor(x / tileSize), Math.floor(y / tileSize)];
}


document.getElementById("mapSize").addEventListener("input", () => {
    sizeMap = document.getElementById("mapSize").value
    resizeArrayMap(document.getElementById("mapSize").value)
})
