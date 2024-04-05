// PixelCanvas.test.ts

import { ethers } from "hardhat";
import { expect } from "chai";

describe("PixelCanvas", function () {
    let pixelCanvas;

    before(async function () {
        const PixelCanvas = await ethers.getContractFactory("PixelCanvas");
        pixelCanvas = await PixelCanvas.deploy();
        await pixelCanvas.deployed();
    });

    it("should allow placing a pixel", async function () {
        const x = 100;
        const y = 200;
        const color = "0x112233"; // Example color (RGB hex)

        await pixelCanvas.placePixel(x, y, color, { value: ethers.utils.parseUnits("0.00002", "ether") });

        const pixelColor = await pixelCanvas.getPixelColor(x, y);
        expect(pixelColor).to.equal(color);
    });

    it("should reject invalid coordinates", async function () {
        const invalidX = 5000;
        const invalidY = 3000;
        const color = "0x445566";

        await expect(pixelCanvas.placePixel(invalidX, invalidY, color))
            .to.be.revertedWith("Invalid x coordinate");
    });

    it("should require sufficient fee", async function () {
        const x = 100;
        const y = 200;
        const color = "0x778899";

        // Send an insufficient fee (less than 20 Gwei)
        await expect(pixelCanvas.placePixel(x, y, color, { value: ethers.utils.parseUnits("0.000000011111111111", "ether") }))
            .to.be.revertedWith("Insufficient fee");
    });
});

