function setOrRemoveSquareEvents(remove = false) {
  canvas1 = document.getElementById("canvas1");
  
  if (remove) {
    canvas1.removeEventListener("mousedown", onMouseDown, false);
    canvas1.removeEventListener("mousemove", onMouseMove, false);
    canvas1.removeEventListener("mouseup", onMouseUp, false);
    canvas1.removeEventListener("mouseout", onMouseUp, false);
  } else {
    canvas1.addEventListener("mousedown", onMouseDown, false);
    canvas1.addEventListener("mousemove", onMouseMove, false);
    canvas1.addEventListener("mouseup", onMouseUp, false);
    canvas1.addEventListener("mouseout", onMouseUp, false);
  }
}

const onMouseUp = () => { drag = false; }

function onMouseDown(e) {
  var mousePos = getMousePos(e);
  rect.startX = mousePos.x;
  rect.startY = mousePos.y;
  drag = true;
}

function onMouseMove(e) {
  if (drag) {
    var mousePos = getMousePos(e);
    rect.w = mousePos.x - rect.startX;
    rect.h = mousePos.y - rect.startY;

    if (rect.w && rect.h && rect.startX && rect.startY) {
      var p1 = [rect.startX, rect.startY];
      var p2 = [p1[0] + rect.w, p1[1] + rect.h];
      var blueColor = new cv.Scalar(0, 0, 255);
      var imgWithRect = original_image.clone();
      cv.rectangle(imgWithRect, p1, p2, blueColor, 2, 8, 0); //TODO
      show_image(imgWithRect, "canvas1");
    }
  }
}

function isSquareMode() {
  return $('#square-mode').is(':checked');
}

function getMousePos(evt) {
  var rect = canvas1.getBoundingClientRect();

  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}