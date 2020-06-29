var Module = {};
var drag = false;
var rect = {};
var original_image;
var canvas1;
var scaleFactor;

setChangeEvent();

function setChangeEvent() {
  var inputElement = document.getElementById("my-file");
  inputElement.addEventListener("change", onLoadImage, false);
}

function show_image(mat, canvas_id) {
  var data = mat.data(); // output is a Uint8Array that aliases directly into the Emscripten heap
  var canvas = document.getElementById(canvas_id);

  channels = mat.channels();
  channelSize = mat.elemSize1();

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = mat.cols;
  canvas.height = mat.rows;

  imdata = ctx.createImageData(mat.cols, mat.rows);

  for (var i = 0, j = 0; i < data.length; i += channels, j += 4) {
    imdata.data[j] = data[i];
    imdata.data[j + 1] = data[i + 1 % channels];
    imdata.data[j + 2] = data[i + 2 % channels];
    imdata.data[j + 3] = 255;
  }
  ctx.putImageData(imdata, 0, 0);
}

function onLoadImage(e) {
  var canvas = document.getElementById('canvas1');
  var canvasWidth = 480;
  var canvasHeight = 480;
  var ctx = canvas.getContext('2d');
  setDrawEvents();

  // clear data first
  if (original_image) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  }

  var url = URL.createObjectURL(e.target.files[0]);
  var img = new Image();
  img.onload = function() {
    scaleFactor = Math.min((canvasWidth / img.width), (canvasHeight / img.height));
    canvas.width = img.width * scaleFactor;
    canvas.height = img.height * scaleFactor;
    ctx.drawImage(img, 0, 0, img.width * scaleFactor, img.height * scaleFactor);
    
    var img2 = cv.matFromArray(getInput(), 24); // 24 for rgba
    original_image = new cv.Mat(); // Opencv likes RGB
    cv.cvtColor(img2, original_image, cv.ColorConversionCodes.COLOR_RGBA2RGB.value, 0);
    img2.delete();
  }
  img.src = url;
}

function getInput() {
  var canvas = document.getElementById('canvas1');
  var ctx = canvas.getContext('2d');
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  return imgData;
}

function grabCut() {
  var result = new cv.Mat();
  var bgdModel = new cv.Mat();
  var fgdModel = new cv.Mat();
  var roiRect = new cv.Rect(rect.startX, rect.startY, rect.w, rect.h);
  cv.grabCut(original_image, result, roiRect, bgdModel, fgdModel, 1, cv.GrabCutModes.GC_INIT_WITH_RECT.value); //TODO: Review GrabCutModes
  
  var fg = original_image.clone();
  var view = fg.data();
  let step = 3 * result.cols;

  // could be improved ....
  for (var x = 0; x < result.rows; x++) {
    for (var y = 0; y < result.cols; y++) {
      var category = result.get_uchar_at(x, y);
      if (category == cv.GrabCutClasses.GC_BGD.value || category == cv.GrabCutClasses.GC_PR_BGD.value) {
        view[x * step + 3 * y] = 255;
        view[x * step + 3 * y + 1] = 255;
        view[x * step + 3 * y + 2] = 255;
      }
    }
  }
  show_image(fg, "canvas2");
}

function downloadImage() {
  var a = document.getElementById("download");
  a.href = document.getElementById("canvas2").toDataURL();
  a.download = 'screenshot.png';
}

$('#square-mode').change(function() {
  setDrawEvents();
});

function setDrawEvents() {
  if (isSquareMode()) {
    setOrRemoveDoodlesEvents(true);
    setOrRemoveSquareEvents();
  } else {
    setOrRemoveSquareEvents(true);
    setOrRemoveDoodlesEvents();
  }
}