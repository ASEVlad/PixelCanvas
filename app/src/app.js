import Web3 from 'web3';

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('./contractABI.json');

const connectMetaMaskButton = document.getElementById('connectMetaMask');














const canvas = document.getElementById('pixelCanvas');
var context = canvas.getContext('2d');
console.log(context)
let isDragging = false;
let lastX = 0;
let lastY = 0;
let downX = 0;
let downY = 0;

const rectSize = 300;
var pixelSize = 5;
const rectPixelSize = rectSize * pixelSize;
const batchSize = 100;

var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var rectX = centerX - (rectPixelSize / 2);
var rectY = centerY - (rectPixelSize / 2);

let scale = 1;
let offsetX = 0;
let offsetY = 0;

async function drawFullCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the position to draw the rectangle in the middle of the canvas
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    rectX = centerX - (rectPixelSize / 2);
    rectY = centerY - (rectPixelSize / 2);

    // Save the current transformation matrix
    context.save();

    // Apply translation and scaling
    context.translate(offsetX, offsetY);
    context.scale(scale, scale);

    drawBorders()
    await updateCanvas()

    // Restore the transformation matrix to its original state
    context.restore();
}

function drawBorders() {
    // Draw the empty rectangle
    context.strokeStyle = '#0095DD';
    context.lineWidth = pixelSize / 2; // Adjust line width as needed
    context.strokeRect(rectX + pixelSize / 2, rectY + pixelSize / 2, rectPixelSize + pixelSize, rectPixelSize + pixelSize);
}


function handleMouseDown(e) {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function handleMouseUp(e) {
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    offsetX += deltaX;
    offsetY += deltaY;

    drawFullCanvas();
    if ((Math.abs(deltaX) < 5) && (Math.abs(deltaY) < 5)) {
        canvasClick(e)
    }

    isDragging = false;
}

// function handleWheel(e) {
//     const delta = e.deltaY;
//     const scaleFactor = delta > 0 ? 0.9 : 1.1; // Decrease scale for zooming out, increase for zooming in

//     if (scale > 0.5 && scale < 1.5) {
//     // Calculate the position of the cursor relative to the canvas
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     // Adjust the offset to zoom towards the cursor
//     offsetX = mouseX - (mouseX - offsetX) * scaleFactor;
//     offsetY = mouseY - (mouseY - offsetY) * scaleFactor;

//     // Update the scale
//     scale *= scaleFactor;

//     drawFullCanvas();
// }

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
// canvas.addEventListener('mousemove', handleMouseMove);
// canvas.addEventListener('wheel', handleWheel);







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
const apiKey = process.env.API_KEY;
const infuraUrl = `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`;
const web3Alchemy = new Web3(new Web3.providers.HttpProvider(infuraUrl));
const contractAlchemy = new web3Alchemy.eth.Contract(contractABI, contractAddress); // Replace with ABI
let contract;

// Function to fetch and update the entire canvas based on smart contract data in batches
async function updateCanvas() {
    if (web3MM) {
        contract = contractMM
        console.log("MM")
    } else {
        contract = contractAlchemy
        console.log("Alchemy")
    }

    // Loop through batches of 100x100
    for (let x = 0; x < rectSize; x += batchSize) {
        for (let y = 0; y < rectSize; y += batchSize) {
            const regionWidth = Math.min(batchSize, rectSize - x);
            const regionHeight = Math.min(batchSize, rectSize - y);
            await updateCanvasRegion(contract, x, y, regionWidth, regionHeight);
        }
    }
}

// Function to update a region of pixels on the canvas
async function updateCanvasRegion(contract, startX, startY, width, height) {
    const canvasData = await contract.methods.getCanvasRegion(startX, startY, width, height).call();

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const color = convertHexColor(canvasData[i][j]);
            context.fillStyle = color;
            if ((i === 0) && (j === 0)) {
                console.log("fill", rectX + (startX + i + 1) * pixelSize, rectY + (startY + j + 1) * pixelSize)
            }
            context.fillRect(rectX + (startX + i + 1) * pixelSize, rectY + (startY + j + 1) * pixelSize, pixelSize, pixelSize);
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


// setInterval(updateCanvas, 10000)












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





















// --------------- METAMASK CONNECT
let connectedAddress;
let web3MM;

async function connectToMetaMask() {
    if (!window.ethereum) {
        alert('Please install MetaMask to connect');
        return;
    }
    try {
        // Check if MetaMask is connected to Arbitrum One network
        const networkId = await ethereum.request({ method: 'net_version' });
        if (networkId !== '42161') { // Arbitrum One network ID
            alert('Please switch to the Arbitrum One network');
            return;
        }

        // Request account access from MetaMask
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        connectedAddress = accounts[0];
        web3MM = new Web3(window.ethereum);

        contractMM = new web3MM.eth.Contract(contractABI, contractAddress); // Replace with ABI
        console.log('Connected to MetaMask account:', connectedAddress);
        connectMetaMaskButton.innerText = shortenWalletAddress(connectedAddress);
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
    }
}


function shortenWalletAddress(walletAddress) {

    // Shorten the wallet address
    const prefix = walletAddress.substring(0, 7);
    const suffix = walletAddress.substring(walletAddress.length - 5);
    const stars = '*'.repeat(5);
    const shortenedAddress = prefix + stars + suffix;

    // Return the shortened address
    return shortenedAddress;
}

connectMetaMaskButton.addEventListener('click', connectToMetaMask);













// --------------- CLICK CANVAS

// Get the canvas element
let contractMM;

// Function to handle canvas click event
async function canvasClick(event) {
    // Get the position of the click relative to the canvas

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Calculate the grid position based on the clicked position
    var posX = Math.floor(x / pixelSize);
    var posY = Math.floor(y / pixelSize);

    // Display confirmation dialog
    var confirmation = confirm("Do you want to change the square at position (" + posX + ", " + posY + ") to color " + getReadableColorName(selectedColor) + "?");
    if (confirmation) {
        try {
            // Connect to MetaMask using the function
            await connectToMetaMask();

            // Execute the placePixel function of your smart contract
            const color = rgbToHex(selectedColor); // Convert hex color to bytes3 format


            contractMM = new web3MM.eth.Contract(contractABI, contractAddress); // Replace with ABI
            await contractMM.methods.placePixel(posX, posY, color)
            .send({
                from: connectedAddress,
                gasLimit: 1500000,
                gasPrice: web3Alchemy.utils.toWei('0.02', 'gwei'),
                value: web3Alchemy.utils.toWei('20', 'gwei')
            })
            .on('transactionHash', (hash) => {
              console.log(`Transaction hash: ${hash}`);
            })
            .on('receipt', (receipt) => {
              console.log(`Pixel placed successfully!`);
            })
            .catch((error) => {
              console.error(`Error placing pixel: ${error}`);
            });

            console.log("Transaction successful:", result);
            // You can add code here to update the canvas if needed
        } catch (error) {
            console.error('Error executing smart contract function:', error);
        }
    }
}

// Function to convert hex color code to color name
function getReadableColorName(rgb) {
    if (rgb === '#000000') {
        return 'Black';
    }

    // Define color mappings
    const colorMap = {
        '255, 255, 255': 'White',
        '0, 0, 0': 'Black',
        '255, 0, 0': 'Red',
        '0, 255, 0': 'Green',
        '0, 0, 255': 'Blue',
        '255, 255, 0': 'Yellow',
        '255, 0, 255': 'Magenta',
        '0, 255, 255': 'Cyan',
        '255, 165, 0': 'Orange'
        // Add more color mappings as needed
    };

    // Convert RGB string to array
    const key = rgb.match(/\d+/g).join(", ");
    return colorMap[key] || "Unknown";
}



function rgbToHex(rgb) {
    if (rgb === '#000000') {
        return '0x000000';
    }

    // Define color mappings
    const colorMap = {
        '255, 255, 255': '0xffffff',
        '0, 0, 0': '0x000000',
        '255, 0, 0': '0xff0000',
        '0, 255, 0': '0x00ff00',
        '0, 0, 255': '0x0000ff',
        '255, 255, 0': '0xffff00',
        '255, 0, 255': '0xff00ff',
        '0, 255, 255': '0x00ffff',
        '255, 165, 0': '0xffa500'
        // Add more color mappings as needed
    };

    // Convert RGB string to array
    const key = rgb.match(/\d+/g).join(", ");
    return colorMap[key] || "Unknown";
}



drawFullCanvas()