// ColoredPoint.js (c) 2012 matsuda
// Taken by Ethan Heffan 2024

// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_PointSize;
  uniform mat4 u_xformMatrix;
  void main() {
    gl_Position = u_xformMatrix * a_Position;
    gl_PointSize =  u_PointSize;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_PointSize;
let u_xformMatrix;
let u_FragColor;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_PointSize = gl.getUniformLocation(gl.program, 'u_PointSize');
  if (u_PointSize < 0) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }

  u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (u_xformMatrix < 0) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI Globals
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=15;
let g_selectedType=POINT;
let g_selectedSegmentCount = 6;
let g_triangleType = 0;
function addActionsForHtmlUI() {

  // Button events
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; updatePreview(); renderAllShapes(); }

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT; updatePreview();}
  document.getElementById('triangleButton').onclick = function() {g_selectedType=TRIANGLE; updatePreview();}
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE; updatePreview();}
  document.getElementById('ballButton').onclick = function() {instantiateBall();}

  // Color sliders
  document.getElementById("redSlide").addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; updatePreview();});
  document.getElementById("greenSlide").addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; updatePreview();});
  document.getElementById("blueSlide").addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; updatePreview();});

  // Size slider
  document.getElementById("shapeSize").addEventListener('mouseup', function() { g_selectedSize = this.value; updatePreview();});

  // Segment slider
  document.getElementById("circleSegmentCount").addEventListener('mouseup', function() {g_selectedSegmentCount = this.value; updatePreview();});

  // Rotation slider
  document.getElementById("triangleType").addEventListener('mouseup', function() {g_triangleType = this.value; updatePreview();});
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev);}};
  addActionsForHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  createPreview();

  instantiateBall();

  requestAnimationFrame(update);

}

let dt = 0;
let lastTimeStamp = 0;

function update(timestamp) {
  // used reference https://github.com/llopisdon/webgl-pong/blob/master/main.js
  const t = timestamp / 1000;
  dt = t - lastTimeStamp;
  lastTimeStamp = t;

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (balls.length > 0) { // If ball in play
    balls.forEach((ball) => {if (ball.size > 0) ball.update()})
  }

  renderAllShapes();

  requestAnimationFrame(update);
}



let preview;
let previewShapes
function createPreview() {
  previewShapes = [new Point(), new Triangle(), new Circle()]
  updatePreview();
}

function updatePreview() {
  if (preview) preview.size = 0;
  preview = previewShapes[g_selectedType];
  preview.position = [.92, -.92];
  preview.color = g_selectedColor.slice();
  preview.size = g_selectedSize;
  preview.triangleType = g_triangleType;
  preview.segments = g_selectedSegmentCount;
  g_shapesList.push(preview);
}


// FUNCTIONS FOR RENDERING NEW SHAPES
var g_shapesList = [];
var balls = [];
function instantiateBall() {
  ball = new Ball();
  ball.position = [.75, 1];
  ball.color = g_selectedColor.slice();
  ball.size = 5;
  ball.segments = 10;
  g_shapesList.push(ball);
  balls.push(ball);
}

function click(ev) {

  [x, y] = convertClientCoordinatesToGL(ev);

  // Create and store new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
    point.triangleType = g_triangleType;
  } else if (g_selectedType==CIRCLE) {
    point = new Circle();
    point.segments = g_selectedSegmentCount;
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
}

function convertClientCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x,y];
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();
  }
}
