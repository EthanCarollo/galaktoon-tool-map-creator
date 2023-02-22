const fs = require('fs');
const objectid = require('objectid')

const inputFile = document.getElementById("tileUpload")
const switchElement = document.getElementById("switchElem")

inputFile.addEventListener("change", (file) => {
  uploadFile(inputFile.files[0].path)
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

const uploadFile = (pathFile) => {
  console.log(pathFile)
  let nameOfFile = objectid();
  let newPath = ("./assets/tiles/temp/" + nameOfFile + ".png")
  let testReadStream = fs.createReadStream(pathFile)
  let newFile = fs.createWriteStream(newPath)
  /*fs.writeFile(pathFile, chunk, (err) => {
    if(err) throw err
    console.log("start to do")
  })*/
  let chunks = 0;
  testReadStream.on('data', (chunk) => {
    chunks += chunk.length;
  })
  testReadStream.on('close', () => {
    console.log("it's uploaded")
  })

  testReadStream.pipe(newFile)
}