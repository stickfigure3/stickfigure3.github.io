// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

let canvas;
var VSOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

var SHADER_F_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let u_FragColor;

let u_Size;


let gl;
let a_Position;


function setupWebGL(){
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Did not get rendering context.');
    return;
  }
}

function connectVariablesToGLSL(){
  if (!initShaders(gl, VSOURCE, SHADER_F_SOURCE)) {
    console.log('Falied to create the shaders. Error');
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Sotorage loactin falied');
    return;
  }
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Sotorage loactin falied');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Sotorage loactin falied');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 5;

function addActionsForHtmlUI(){
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];};
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];};
  document.getElementById('clearButton').onclick = function() {shape_LIST_G=[]; renderAllShapes();};
  document.getElementById("drawPictureButton").onclick = drawHouse;


  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};

  document.getElementById('redSlide').addEventListener('mouseup', function(){g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function(){g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function(){g_selectedColor[2] = this.value/100;});

  document.getElementById('sizeSlide').addEventListener('mouseup', function(){g_selectedSize = this.value;});
  document.getElementById('circleSeg').addEventListener('mouseup', function(){g_selectedSegments = this.value;});
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1){ click(ev)}};
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var shape_LIST_G = [];

function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segments = g_selectedSegments;
  shape_LIST_G.push(point);
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var a = ev.clientY;
  var tilt = ev.target.getBoundingClientRect();


  var z = ev.clientX;


  z = ((z - tilt.left) - canvas.width/2)/(canvas.width/2);
  a = (canvas.height/2 - (a - tilt.top))/(canvas.height/2);

  return([z,a]);
}

function renderAllShapes(){
  var time = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT);

  var y = shape_LIST_G.length;
  for(var i = 0; i < y; i++) {
    shape_LIST_G[i].render();
  }
  var duration = performance.now()  - time;
  sendTextToHTML("num: " + y + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10,"num");
}

function sendTextToHTML(t,ID){
  var ELM = document.getElementById(ID);
  ELM.innerHTML = t;
}

const HOUSE_TRIANGLES = [
  //# House base

    {'vertices': [-0.6, -0.3,  0.6, -0.3,  0.6, 0.3], 'color': [0.76, 0.60, 0.42, 1.0]},

    {'vertices': [-0.6, -0.3, -0.6, 0.3,  0.6, 0.3], 'color': [0.76, 0.60, 0.42, 1.0]},



    //# House roof

    {'vertices': [-0.7, 0.3, 0.7, 0.3, 0.0, 0.6], 'color':  [0.60, 0.40, 0.20, 1.0]},



    //# House windows

    {'vertices': [-0.4, 0.1, -0.2, 0.1, -0.2, 0.3], 'color': [0.2, 0.5, 0.8, 1.0]},

    {'vertices': [-0.4, 0.1, -0.4, 0.3, -0.2, 0.3], 'color': [0.2, 0.5, 0.8, 1.0]},

    {'vertices': [0.4, 0.1, 0.2, 0.1, 0.2, 0.3], 'color': [0.2, 0.5, 0.8, 1.0]},

    {'vertices': [0.4, 0.1, 0.4, 0.3, 0.2, 0.3], 'color': [0.2, 0.5, 0.8, 1.0]},



    //# House door

    {'vertices': [-0.1, -0.3, 0.1, -0.3, 0.1, 0.05], 'color': [0.55, 0.27, 0.07, 1.0]},

    {'vertices': [-0.1, -0.3, -0.1, 0.05, 0.1, 0.05], 'color': [0.55, 0.27, 0.07, 1.0]},



    //# Stick Figure head touching body


    {'vertices': [-.7, 0.3, -1, 0.3, -0.85, 0.1], 'color': [0.9, 0.1, 0.1, 1.0]},



    //# Stick Figure body

    {'vertices': [-0.9, 0.1, -0.8, 0.1, -0.85, -0.1], 'color': [0.9, 0.1, 0.1, 1.0]},



    //Stick Figure arms

    {'vertices': [-1.0, 0.05, -0.7, 0.05, -0.85, 0.1], 'color': [0.9, 0.1, 0.1, 1.0]},



    // Stick Figure legs

    {'vertices': [-0.9, -0.1, -0.8, -0.1, -0.85, -0.3], 'color': [0.9, 0.1, 0.1, 1.0]},

];


function drawHouse() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let tri of HOUSE_TRIANGLES) {
      drawTriangle(tri.vertices, tri.color);
  }
}

