const fs = require('fs');

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
  document.getElementById("windowLayer").classList.toggle("isActive");
  document.getElementById("windowUpload").classList.toggle("isActive");
  if(toggleUpload === true){
    toggleUpload = false
  }else{
    toggleUpload = true;
  }
})

const uploadFile = (pathFile, nameFile) => {
  let nameOfFile = nameFile;
  let newPath = ("./assets/tiles/temp/" + nameOfFile + ".png")

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
          path : "assets/tiles/temp/" + nameOfFile + ".png",
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
  
  fetch("./json/newTiles.json")
        .then(rep => rep.json())
        .then(rep => { 
                  let newTilesToWrite = { data : rep.data}
                  newTilesToWrite.data.push(newFile)
                  newTilesToWrite = JSON.stringify(newTilesToWrite)
                  fs.writeFile("./json/newTiles.json", newTilesToWrite, (err) => {
                    if(err){
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