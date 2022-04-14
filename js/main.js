const inputImage = document.getElementById("inputImage");
const preview = document.getElementById("preview");
const cropImage = document.getElementById("cropImage");
const imageLink = document.getElementById("imageLink");
const defaultName = document.getElementById("defaultName");
const quality = document.getElementById("quality");
let croppr;
let imageSelected;
inputImage.addEventListener("change", (event) => {
  if(event.target.files.length){
    imageSelected = event.target.files[0];
    console.log("Crop image", imageSelected);
    preview.src = URL.createObjectURL(imageSelected);
    genCropper();
  }else{
    imageSelected = null;
    preview.src = "";
    imageLink.classList.add("disabled");
    croppr?.destroy();
  }
});
cropImage.addEventListener("click", genCroppedImage);

function genCropper(){
  croppr?.destroy();
  setTimeout(() => {
    croppr = new Croppr(`#preview`, {
      aspectRatio: 0,
      startSize: [50, 50, 'px'],
      onCropEnd: function(value) {
        console.log(value.x, value.y, value.width, value.height);
      }
    });
  }, 0);
}

function genCroppedImage(){
  let cropParams = croppr.getValue();
  let imgOriginal = new Image();
  imgOriginal.onload = function () {
    let imgCropedSrc = getCropedImage(imgOriginal, cropParams);
    imageLink.href = imgCropedSrc;
    let extension = imageSelected.name.split('.').pop();
    let randomName = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
    imageLink.download = defaultName?.value ? `${defaultName.value}-${randomName}.${extension}` : imageSelected.name;
    imageLink.classList.remove("disabled");
  };
  imgOriginal.src = URL.createObjectURL(imageSelected);
}

function getCropedImage(img, config) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = config.width;
  canvas.height = config.height;
  ctx.drawImage(img, config.x, config.y, config.width, config.height, 0, 0, config.width, config.height);
  //let qualityValue = quality?.value ? parseFloat((quality.value/10).toFixed(1)) : .75;
  return canvas.toDataURL(imageSelected.type, .75);
}
