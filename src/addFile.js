const fs = require('fs');
const path = require('path')

const inputFile = document.getElementById("tileUpload");
const switchElement = document.getElementById("switchElem");
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
  console.log("clicked")
  console.log(getPath())
  switchElement.classList.toggle("active");
  document.getElementById("windowLayer").classList.toggle("isActive");
  document.getElementById("windowUpload").classList.toggle("isActive");
  if(toggleUpload === true){
    toggleUpload = false;
    tint(255,255)
  }else{
    toggleUpload = true;
    tint(255,125)
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

const resetInput = () => {
  inputFile.value = []
  document.getElementById("nameOfTile").value = ""
  document.getElementById("yHeightOfTile").value = ""
}