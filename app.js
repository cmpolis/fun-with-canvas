//
//
//

var width = 600,
    height = 400,
    radius = 1.5,
    pointCount = 10e3,
    renderCount = 10,
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

//
//

// Simple render
var renderA = function(context, points) {
  context.globalAlpha = 0.44;
  points.forEach(function(point, ndx) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = point.color;
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
