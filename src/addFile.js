const fs = require('fs');
const path = require('path')
const {shell} = require('electron');

const inputFile = document.getElementById("tileUpload");
const switchElement = document.getElementById("switchElem");
const togglingAnimator = document.getElementById("togglingAnimator");
const togglingStroke = document.getElementById("togglingStroke");
const button = document.getElementById("UploadTileToFile");

button.addEventListener("click", (file) => {
  let uploadName = document.getElementById("nameOfTile").value
  let spaceVerificator = uploadName.match(" ")
  if(uploadName.length > 3 && spaceVerificator === null && document.getElementById("yHeightOfTile").value > 0)
  {
    document.getElementById("errorHandle").innerHTML = "UPLOADING"
    uploadFile(inputFile.files[0].path, uploadName)
  }else{
    document.getElementById("errorHandle").innerHTML = "Error with the name or the height"
  }
})

let toggleUpload = false;

switchElement.addEventListener("click",() => {
  switchElement.classList.toggle("active");
  document.getElementById("windowLayer").classList.toggle("isActive");
  document.getElementById("windowUpload").classList.toggle("isActive");
  if(toggleUpload === true){
    toggleUpload = false;
  }else{
    toggleUpload = true;
  }
})

let isAnimated = false;

togglingAnimator.addEventListener("click",() => {
  togglingAnimator.classList.toggle("active");
  if(isAnimated === true){
    document.getElementById("textanimate").innerHTML = "tile isn't animated";
    isAnimated = false;
  }else{
    document.getElementById("textanimate").innerHTML = "tile is animated";
    isAnimated = true;
  }
})

let isStroke = false;

togglingStroke.addEventListener("click",() => {
  togglingStroke.classList.toggle("active");
  if(isStroke === true){
    noStroke()
    isStroke = false;
  }else{
    strokeWeight(2);
        stroke(51);
    isStroke = true;
  }
})

const getPath = () => {
  switch(process.platform){
    case "win32" : 
      return path.join(process.env.APPDATA)
    case 'darwin' :
      return path.join(process.env.HOME, "Library", "Application Support")
  }
}

const getSpecPath = () => {
  switch(process.platform){
    case "win32" : 
      return path.join(process.env.APPDATA, "GalaktoonMap", "newTiles.json")
    case 'darwin' :
      return path.join(process.env.HOME, "Library", "Application Support", "GalaktoonMap", "newTiles.json")
  }
}

const uploadFile = (pathFile, nameFile) => {
  let nameOfFile = nameFile;
  let newPath = (getPath() + "/GalaktoonMap/" + nameOfFile + ".png") // only for distributable version
  createDir();
  fs.stat(newPath, function(err) {
    if (err) {
      let testReadStream = fs.createReadStream(pathFile)
      let newFile = fs.createWriteStream(newPath)
      
      let chunks = 0;
      testReadStream.on('data', (chunk) => {
        chunks += chunk.length;
      })
      testReadStream.on('close', () => {
        console.log("it's uploaded")
      })
    
      testReadStream.pipe(newFile)
      testReadStream.on("end", () => {
        let newTile = {
          id : "0",
          path : newPath,
          isAnimated : isAnimated,
          image : "null",
          collider : false,
          canConstruct : "true",
          isAnObject : false,
          xWidth : 1,
          yWidth : document.getElementById("yHeightOfTile").value,
          type : "useless",
          destructible : "false",
          sizeXonConstruct : 1
        }
        writeNewJsonTempTile(newTile)
      })
      
    }else{
      document.getElementById("errorHandle").innerHTML = "File Already Exist, select another name"
    }
  });
}

const writeNewJsonTempTile = (newFile) => {
  resetInput()
  
  fetch(getPath() + "/GalaktoonMap/newTiles.json") // only for prod
        .then(rep => rep.json())
        .then(rep => { 
                  let newTilesToWrite = { data : rep.data}
                  newTilesToWrite.data.push(newFile)
                  newTilesToWrite = JSON.stringify(newTilesToWrite)
                  fs.writeFile(getPath() + "/GalaktoonMap/newTiles.json", newTilesToWrite, (err) => {
                    if(err){
                      console.log("Failed to write on new tiles json")
                      console.log(err)
                    }
                    document.getElementById("errorHandle").innerHTML = "UPLOADED"
                    setTimeout(() => {
                      loadAssets()
                    }, 250)
                  })              
        })
}

const exportMapAsANewJsonInPath = () => {
  let specMap = JSON.stringify(mapLayers);
  alert("Map exported as mapLayers.json in " + getPath() + "/GalaktoonMap")
  fs.writeFile(getPath() + "/GalaktoonMap/mapLayers.json", specMap, (err) => {
    if(err){
      console.log("Failed to write on new tiles json")
      console.log(err)
    }
  })  
}

const openFolderMap = () => {
  console.log("open that");
  shell.showItemInFolder(getSpecPath());
}

const resetInput = () => {
  inputFile.value = []
  document.getElementById("nameOfTile").value = ""
  document.getElementById("yHeightOfTile").value = ""
}

const deleteTile = (id) => {
  fetch(getPath() + "/GalaktoonMap/newTiles.json") // only for prod
        .then(rep => rep.json())
        .then(rep => { 
                  let newTilesToWrite = { data : rep.data}
                  console.log(newTilesToWrite)
                  console.log(id)
                  for(let i = 0; i < newTilesToWrite.data.length; i++){
                    if(i === id){
                      console.log("delete")
                      newTilesToWrite.data.splice(id, 1)
                    }
                  }
                  console.log(newTilesToWrite)
                  newTilesToWrite = JSON.stringify(newTilesToWrite)

      
                  fs.writeFile(getPath() + "/GalaktoonMap/newTiles.json", newTilesToWrite, (err) => {
                    if(err){
                      console.log("Failed to write on new tiles json")
                      console.log(err)
                    }
                    document.getElementById("errorHandle").innerHTML = "UPLOADED"
                    setTimeout(() => {
                      loadAssets()
                    }, 500)
                  })              
        })
}