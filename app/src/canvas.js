var rectSize = 5;

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let lastX = 0;
let lastY = 0;

let offsetX = 0;
let offsetY = 0;

function drawBorders() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the position to draw the rectangle in the middle of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rectX = centerX - (rectWidth / 2);
    const rectY = centerY - (rectHeight / 2);

    // Save the current transformation matrix
    ctx.save();

    // Apply translation and scaling
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw the empty rectangle
    ctx.strokeStyle = '#0095DD';
    ctx.lineWidth = 5; // Adjust line width as needed
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Restore the transformation matrix to its original state
    ctx.restore();
}

function handleMouseDown(e) {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function handleMouseUp() {
  isDragging = false;
}

function handleMouseMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    offsetX += deltaX;
    offsetY += deltaY;

    drawBorders();
}

function handleWheel(e) {
    const delta = e.deltaY;
    const scaleFactor = delta > 0 ? 0.9 : 1.1; // Decrease scale for zooming out, increase for zooming in

    // Calculate the position of the cursor relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Adjust the offset to zoom towards the cursor
    offsetX = mouseX - (mouseX - offsetX) * scaleFactor;
    offsetY = mouseY - (mouseY - offsetY) * scaleFactor;

    // Update the scale
    scale *= scaleFactor;

    drawBorders();
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('wheel', handleWheel);

draw();



// Function to update canvas size based on display area
function updateCanvasSize() {
    // Get the width and height of the display area
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // Set canvas width and height
    canvas.width = displayWidth;
    canvas.height = displayHeight;
}

// Call the function initially and on window resize
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);









// --------------- CANVAS UPDATE
const canvasElement = document.getElementById('pixelCanvas');

const apiKey = process.env.API_KEY;
const infuraUrl = `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`;
const web3Alchemy = new Web3(new Web3.providers.HttpProvider(infuraUrl));
const contractAlchemy = new web3Alchemy.eth.Contract(contractABI, contractAddress); // Replace with ABI

// Function to update a region of pixels on the canvas
async function updateCanvasRegion(contract, startX, startY, width, height) {
    const canvasData = await contract.methods.getCanvasRegion(startX, startY, width, height).call();

    var context = canvasElement.getContext('2d');
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const color = convertHexColor(canvasData[i][j]);
            context.fillStyle = color;
            context.fillRect((startX + i) * rectSize, (startY + j) * rectSize, rectSize, rectSize);
        }
    }
}

// Function to fetch and update the entire canvas based on smart contract data in batches
async function updateCanvas() {
    if (web3Alchemy) {
        console.log("Full");
        const canvasWidth = Math.floor(window.innerWidth / rectSize);
        const canvasHeight = Math.floor(window.innerHeight / rectSize);

        // Loop through batches of 100x100
        for (let x = 0; x < canvasWidth; x += 100) {
            for (let y = 0; y < canvasHeight; y += 100) {
                const regionWidth = Math.min(100, canvasWidth - x);
                const regionHeight = Math.min(100, canvasHeight - y);
                updateCanvasRegion(contractAlchemy, x, y, regionWidth, regionHeight);
            }
        }
    }
}

function convertHexColor(hexColor) {
    // Remove the "0x" prefix if present
    if (hexColor.startsWith("0x")) {
        hexColor = hexColor.slice(2);
    }

    // Add "#" prefix
    return "#" + hexColor;
}


updateCanvas();
setInterval(updateCanvas, 1000)












// PALETTE
// Set default color
let selectedColor = "rgb(0, 0, 0)";

// Function to handle color selection
function selectColor(event) {
    let color = event.target.getAttribute('data-color');
    if (color) {
        selectedColor = color;
        updateSelectedColor();
    }
}

// Function to update the selected color appearance
function updateSelectedColor() {
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.style.border = '1px solid #ccc'; // Reset border
        if (color.getAttribute('data-color') === selectedColor) {
            color.style.border = '4px solid grey'; // Add additional border to selected color
        }
    });
}

// Add click event listeners to color swatches
const colorSwatches = document.querySelectorAll('.color');
colorSwatches.forEach(color => {
    color.addEventListener('click', selectColor);
});

// Initial update of the selected color appearance
updateSelectedColor();



