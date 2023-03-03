let tilesData = [];
let addedTile = [];
let countTile = 0;
let imageIsLoaded = false;

const createDir = () => {
    if(!fs.existsSync(getPath() + "/GalaktoonMap")){
        fs.mkdirSync(getPath() + "/GalaktoonMap")
        fs.writeFileSync(getPath() + "/GalaktoonMap/newTiles.json", JSON.stringify({ data : []}) )
      }
}

const loadAssets = () => {
    createDir();
    fetch(getPath() + "/GalaktoonMap/newTiles.json")
        .then(rep => rep.json())
        .then(rep => { 
            tilesData = rep.data
            loadImageAssets();
        })
        .catch(error => { 
            throw new Error("there is an issue with the ressource path");
        })
}


const loadImageAssets = () => {

    for(let i = 0; i < tilesData.length; i++)
    {
        tilesData[i].image = loadImage(tilesData[i].path, succeedLoadImage, () => {console.log(tilesData[i].path)});
    }
    createDOM()
}

const succeedLoadImage = () => {
    countTile ++;
    if(countTile === tilesData.length){
        imageIsLoaded = true;
    }
}

const createDOM = () => {
    document.getElementById("innerTilesList").innerHTML = " "
    let moove = document.getElementById("innerTilesList").appendChild(document.createElement("image"))
    moove.classList.add("tile")
    moove.style.backgroundImage = 'url("./assets/tiles/moove.png")';
    moove.addEventListener("mouseup", () => {
        callbackTiles(-2);
    })
    let erase = document.getElementById("innerTilesList").appendChild(document.createElement("image"))
    erase.classList.add("tile")
    erase.style.backgroundImage = 'url("./assets/tiles/gomme.webp")';
    erase.addEventListener("mouseup", () => {
        callbackTiles(-1);
    })
    for(let j = 0; j<tilesData.length;j++)
    {
        let image = document.getElementById("innerTilesList").appendChild(document.createElement("image"))
        image.classList.add("tile")
        image.style.backgroundImage = 'url("' + tilesData[j].path + '")';
        image.addEventListener("mouseup", () => {
            callbackTiles(j);
        })
        image.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            deleteSelectedTiles(j);
            return false;
        }, false);
    }
    createLayersDisplay()
}

const deleteSelectedTiles = (id) => {
    alert("Will delete : " + id);
    deleteTile(id);
}

const callbackTiles = (id) => {
    tileSelected = id;
}