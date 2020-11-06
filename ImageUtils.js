import Jimp from 'jimp/es';
import fs from 'browserify-fs';
//this doesn't work in the browser
// import fs from 'fs';


//from here: https://github.com/oliver-moran/jimp/issues/655
async function resize(image, resizedImage, size) {
  Jimp.read(image).then((img) => {
      img.scaleToFit(size.width, size.height).write(resizedImage);
  }).catch((err) => {
      console.log(err);
  });
}

// User-Defined Function to read the images 
async function rotateImg(name, angle) { 

    const image = await Jimp.read 
  (name,  function (err, image) {
    image.rotate(90)
    .getBase64(Jimp.AUTO, function(err, data) {
      console.log(data);
  
      const newName = name.slice(0,-4) + "_rrr" + angle + ".jpg";   
      
      var base64Data = data.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(newName, base64Data, 'base64', function(err) {
        if(err) {
          return console.log(err);
        }
      }); 
      return newName;
      
    });
  }); 
    
  } 

  const topImg = rotateImg("top.jpg", 90);