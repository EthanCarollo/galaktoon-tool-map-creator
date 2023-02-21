const fs = require('fs')
const path = require("path");

const inputFile = document.getElementById("tileUpload")
const switchElement = document.getElementById("switchElem")

inputFile.addEventListener("change", (file) => {
  console.log(inputFile.files[0].path)
})

switchElement.addEventListener("click",() => {
  console.log("clicked")
  document.getElementById("windowLayer").classList.toggle("isActive");
  document.getElementById("windowUpload").classList.toggle("isActive");
})

const uploadFile = () => {

}