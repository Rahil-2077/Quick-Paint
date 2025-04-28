const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let painting = false;
let tool = 'brush';
let brushColor = '#000000';
let brushSize = 5;

// For undo/redo
let undoStack = [];
let redoStack = [];

// Resize canvas
function resizeCanvas() {
  const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - toolbarHeight;
}

window.addEventListener('resize', () => {
  const oldData = canvas.toDataURL();
  resizeCanvas();
  const img = new Image();
  img.src = oldData;
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  };
});
resizeCanvas();

// Start painting
canvas.addEventListener('mousedown', (e) => {
  saveState();  // Save before starting new drawing
  painting = true;
  draw(e);
});

canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

// Drawing function
function draw(e) {
  if (!painting) return;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = (tool === 'brush') ? brushColor : 'white';

  const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
  ctx.lineTo(e.clientX, e.clientY - toolbarHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY - toolbarHeight);
}

// Tool select
function selectTool(selectedTool) {
  tool = selectedTool;
}

// Change color
function changeColor(color) {
  brushColor = color;
}

// Change brush size
function changeSize(size) {
  brushSize = size;
}

// Save current canvas state
function saveState() {
  undoStack.push(canvas.toDataURL());
  redoStack = []; // Clear redo stack
}

// Undo action
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL());
    const previousState = undoStack.pop();
    const img = new Image();
    img.src = previousState;
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

// Redo action
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(canvas.toDataURL());
    const nextState = redoStack.pop();
    const img = new Image();
    img.src = nextState;
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

// Download canvas
function downloadCanvas() {
  const link = document.createElement('a');
  link.download = 'QuickPaint.png';
  link.href = canvas.toDataURL();
  link.click();
}
