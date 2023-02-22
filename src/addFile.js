const fs = require('fs');

const inputFile = document.getElementById("tileUpload");
const switchElement = document.getElementById("switchElem");
const button = document.getElementById("UploadTileToFile");

button.addEventListener("click", (file) => {
  let uploadName = document.getElementById("nameOfTile").value
  let spaceVerificator = uploadName.match(" ")
  console.log(spaceVerificator)
  if(uploadName.length > 3 && spaceVerificator === null)
  {
    uploadFile(inputFile.files[0].path, uploadName)
  }else{
    console.log("file name too small or don't correspond to the standard")
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
  console.log(pathFile)
  let nameOfFile = nameFile;
  let newPath = ("./assets/tiles/temp/" + nameOfFile + ".png")
  let testReadStream = fs.createReadStream(pathFile)
  let newFile = fs.createWriteStream(newPath)
  /*fs.writeFile(pathFile, chunk, (err) => {
    if(err) throw err
    console.log("start to do")
  })*/
  fs.stat(newPath, function(err) {
    if (err) {
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
          yWidth : 1,
          type : "useless",
          destructible : "false",
          sizeXonConstruct : 1
        }
        writeNewJsonTempTile(newTile)
      })
      
    }else{
      console.log("exist already")
    }
  });
}

const writeNewJsonTempTile = (newFile) => {
    
  
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
                    setTimeout(() => {
                      loadAssets()
                    });
                  })              
        })
}