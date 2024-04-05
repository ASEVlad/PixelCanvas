// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PixelCanvas {
    // Define canvas dimensions (4K resolution: 3840x2160 pixels)
    uint256 public constant canvasWidth = 1080;
    uint256 public constant canvasHeight = 1080;

    // Mapping to store pixel colors (each pixel represented by (x, y) coordinates)
    mapping(uint256 => mapping(uint256 => bytes3)) private canvas;

    // Event emitted when a pixel color is changed
    event PixelChanged(uint256 x, uint256 y, bytes3 color);

    // Event emitted when the full canvas is retrieved
    event FullCanvasRetrieved(bytes3[][canvasWidth] canvasData);

    // Function to place a pixel with the specified color (requires payment)
    function placePixel(uint256 x, uint256 y, bytes3 color) external payable {
        require(x < canvasWidth, "Invalid x coordinate");
        require(y < canvasHeight, "Invalid y coordinate");
        require(msg.value >= 20 gwei, "Insufficient fee"); // Require at least 20 Gwei (0.00002 Ether)

        // Update the canvas
        canvas[x][y] = color;

        // Emit an event
        emit PixelChanged(x, y, color);
    }

    // Function to get the color of a specific pixel
    function getPixelColor(uint256 x, uint256 y) external view returns (bytes3) {
        require(x < canvasWidth, "Invalid x coordinate");
        require(y < canvasHeight, "Invalid y coordinate");

        return canvas[x][y];
    }

    // Function to retrieve the full canvas
    function getFullCanvas() external view returns (bytes3[][canvasWidth] memory) {
        bytes3[][canvasWidth] memory canvasData;

        for (uint256 i = 0; i < canvasWidth; i++) {
            for (uint256 j = 0; j < canvasHeight; j++) {
                canvasData[i][j] = canvas[i][j];
            }
        }

        return canvasData;
    }
}
