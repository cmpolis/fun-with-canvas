//
//
//

var width = 600,
    height = 400,
    radius = 1.5,
    pointCount = 10e3,
    renderCount = 1,
    canvas = document.getElementById('scatterplot'),
    context = canvas.getContext('2d'),
    palette = '#E9AEC8 #9ADF97 #DCCB6A #77DFD3 #A5C8E4'.split(' ');

//
var generatePoint = function() {
  var obj = {
    x: _.random(width),
    y: _.random(height),
    color: palette[_.random(palette.length-1)]
  };
  return obj;
};
var points = _.range(pointCount).map(generatePoint);

///////////////////////////
// MAKE NOT LOOK AWFUL ON RETINA/High DPI
// http://jsfiddle.net/4xe4d/
var devicePixelRatio = window.devicePixelRatio || 1;
var backingStoreRatio = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
var ratio = devicePixelRatio / backingStoreRatio;
if (devicePixelRatio !== backingStoreRatio) { // upscale ratio if neccesary
  var oldWidth = canvas.width;
  var oldHeight = canvas.height;
  canvas.width = Math.round(oldWidth * ratio);
  canvas.height = Math.round(oldHeight * ratio);
  canvas.style.width = oldWidth + 'px';
  canvas.style.height = oldHeight + 'px';
  context.scale(ratio, ratio);
}

///////////////////////////
// RENDERING

// Simple render
var renderA = function(context, points) {
  context.globalAlpha = 0.64;
  points.forEach(function(point, ndx) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = point.isSelected ? 'black' : point.color;
    context.fill();
  });
};

// Group by color (fewer fill changes)
var groupRender = function(context, points) {
  context.globalAlpha = 0.44;
  _.forEach(_.groupBy(points, 'color'), function(points, color) {
    context.fillStyle = color;
    points.forEach(function(point, ndx) {
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
      context.fill();
    });
  })
};

var start;
for(var renderNdx = 0; renderNdx < renderCount; renderNdx++) {
  start = performance.now();
  //renderA(context, points);
  groupRender(context, points);
  console.log((performance.now() - start) + ' ms.');
}

///////////////////////////
// INTERACTION
// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/

var isDragging = false, initialPos;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(evt) {
  //console.log(mousePos);
  if(isDragging) {
    var mousePos = getMousePos(canvas, evt),
        minX = Math.min(mousePos.x, initialPos.x),
        maxX = Math.max(mousePos.x, initialPos.x),
        minY = Math.min(mousePos.y, initialPos.y),
        maxY = Math.max(mousePos.y, initialPos.y);
    points.forEach(function(point) {
      point.isSelected = point.x >= minX && point.x <= maxX &&
                         point.y >= minY && point.y <= maxY;
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderA(context, points);
  }
}, false);
canvas.addEventListener('mousedown', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  initialPos = mousePos;
  isDragging = true;
}, false);
canvas.addEventListener('mouseup', function(evt) {
  var mousePos = getMousePos(canvas, evt),
      minX = Math.min(mousePos.x, initialPos.x),
      maxX = Math.max(mousePos.x, initialPos.x),
      minY = Math.min(mousePos.y, initialPos.y),
      maxY = Math.max(mousePos.y, initialPos.y);

  isDragging = false;
  // var pointsInBounds = points.filter(function(point) {
  //   return point.x >= minX && point.x <= maxX &&
  //          point.y >= minY && point.y <= maxY;
  // });
  points.forEach(function(point) {
    point.isSelected = point.x >= minX && point.x <= maxX &&
                       point.y >= minY && point.y <= maxY;
  });
  context.clearRect(0, 0, canvas.width, canvas.height);
  renderA(context, points);
}, false);
