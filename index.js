const Jimp = require('jimp');
const fs = require('fs');
const ptp = require('ptp');
const moment = require('moment'); //https://momentjs.com/
const util = require("util");
const {convertImage} = require('panorama-to-cubemap'); //https://www.npmjs.com/package/panorama-to-cubemap

const readdir = util.promisify(fs.readdir);
//const rename = util.promisify(fs.rename);
const copyFile = util.promisify(fs.copyFile);

const SOURCE_DIRECTORY = "C:/Users/User/Pictures/equirectangular/solway/";
const TARGET_DIRECTORY = "C:/Users/User/Pictures/SkyBoxes/";

async function myMain() {
  let inputPictures;
  // try{
  //   inputPictures = await readdir(SOURCE_DIRECTORY);
  //    } catch(err) {
  //     console.log(err); 
  //   }
  inputPictures = await myReadDir(SOURCE_DIRECTORY);

  if (inputPictures === undefined) {
    console.log('specified directory does not exist');
  } else {
    const targetPath = TARGET_DIRECTORY + moment().format('MMMM Do YYYY, h_mm_ss a');
    console.log(targetPath);
    makeNewDirectory(targetPath);
    generateSkyBoxes(inputPictures, targetPath);
  } 
}

myMain();

  async function generateSkyBoxes(inputPictures, targetPath){
    //This part takes all the input .jpgs found and runs them through the skybox generation software it then calls writeSkyBoxToFile
    //https://coderrocketfuel.com/article/create-a-new-directory-in-node-js
    for (let i= 0; i < inputPictures.length; i++){
      //make this into a separate function
      let picture = inputPictures[i]
      //console.log("Picture: ", picture)
      //TODO add more validation for picture.split
      const picPath = targetPath + "/" + picture.split(".")[0];
      makeNewDirectory(picPath);
      await convertImage(SOURCE_DIRECTORY + "/" + picture);

      const sides = ["nz", "pz", "py", "ny", "px", "nx"];
      //call the image rotations here
      //In the final code it will be: py.jpg for the top (rotated 90) and ny.jpg for the bottom (rotated 270)
      imgRotate('./py.jpg', 90).then(value => console.log(value)); 
      imgRotate('./ny.jpg', 270).then(value => console.log(value)); 
      //then move the images to the right folder
      for(let side of sides){
        const oldPath = "./" + side + ".jpg";
        const newPath = picPath + oldPath.slice(1);
        moveFile(oldPath, newPath);
        //this code isn't working yet, not sure why. I'm trying to archive a copy of each image to a set folder in '.../Pictures'
        // const target = targetPath + picPath;
        // await makeNewDirectory(target);
      //   await myCopyFile(newPath, target + oldPath.slice(1), function (err) {
      //     if (err) throw err;
      //     console.log(picture + 'written!');
      // });
      }
    };
  }//end of function generateSkyBoxes

 //Function to move the files
 function moveFile(oldPath, newPath){ 
  try {
    fs.renameSync(oldPath, newPath);
  } catch (err) {
    console.log(`moveFile(${oldPath}, ${newPath})`, err);
  }
 }

 //Function to copy the files
 async function myCopyFile(newPath, oldPath, callback){ 
  try {
    await copyFile(newPath, oldPath, callback);
  } catch (err) {
    console.log(err);
  }
 }

function makeNewDirectory(path){
  const created = fs.mkdirSync(path,{recursive: true})
  console.log(`makeNewDirectory(${path})`, created)
}

  //This part reads the directory where it expects to find the input photos (equirectangular)
//https://www.geeksforgeeks.org/node-js-fs-readdir-method/#:~:text=The%20fs.,are%20returned%20from%20the%20method.
async function myReadDir(path){
  let myValues = null;
  try{
    myValues = await readdir(path);
     } catch(err) {
      console.log(err); 
    }
    return myValues;
}

//Function to rotate the images using Jimp from: https://www.geeksforgeeks.org/node-jimp-rotate/
async function imgRotate(name, angle) { 
  const image = await Jimp.read 
(name); 
const imgName = name.slice(0,-4) + "_rr_" + angle + ".jpg"
// rotate Function having rotation angle as a parameter, mode and error handling callback function 
  image.rotate(angle, Jimp.RESIZE_BEZIER, function(err){ 
      if (err) throw err; 
  }) 
      .write(imgName); 
      return name + " rotated by " + angle + " degrees: " + imgName;
} 
    