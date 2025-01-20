const pixelCanvas = document.getElementById("pixel-circle");
const overlayCanvas = document.getElementById("overlay-circle");
const aInput = document.getElementById("a-input");
const fillInput = document.getElementById("fill-color-input");
const thicknessInput = document.getElementById("thickness-input");
const outlineInput = document.getElementById("outline-color-input");
const overlayCheck = document.getElementById("overlay-check");

let radius = 0;
let fillColor = [240, 80, 37, 255];
let thickness = 0;
let outlineColor = [0, 0, 0, 255];
let isOverlay = false;

function drawPixelCircle() {
    const ctx = pixelCanvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, pixelCanvas.width, pixelCanvas.height);
    const data = imageData.data;
    const xc = pixelCanvas.width / 2, yc = pixelCanvas.height / 2;

    for (let y = 0; y < pixelCanvas.height; y++) {
        for (let x = 0; x < pixelCanvas.width; x++) {
            const index = (y * pixelCanvas.width + x) * 4;
            const d = distance(x + 0.5, y + 0.5, xc, yc);
            if (d <= radius) {
                data[index] = fillColor[0];
                data[index + 1] = fillColor[1];
                data[index + 2] = fillColor[2];
                data[index + 3] = fillColor[3];
            } else {
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 0;
            }
            if (radius - thickness / 2 <= d && d <= radius + thickness / 2) {
                data[index] = outlineColor[0];
                data[index + 1] = outlineColor[1];
                data[index + 2] = outlineColor[2];
                data[index + 3] = outlineColor[3];
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}

function drawOverlay() {
    let ctx = overlayCanvas.getContext("2d");
    const width = overlayCanvas.width, height = overlayCanvas.height;
    ctx.clearRect(0, 0, width, height);
    if (!isOverlay)
        return;

    const ratioX = overlayCanvas.width / (2 * radius + thickness);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#E6E8E6";
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, ratioX * radius, ratioX * radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

aInput.addEventListener("change", () => {
    radius = aInput.value / 2;
    pixelCanvas.width = pixelCanvas.height = 2 * radius + thickness;
    drawPixelCircle();
    drawOverlay();
});

fillInput.addEventListener("change", () => {
    const hex = fillInput.value;
    fillColor[0] = parseInt(hex.substring(1, 3), 16);
    fillColor[1] = parseInt(hex.substring(3, 5), 16);
    fillColor[2] = parseInt(hex.substring(5, 7), 16);
    fillColor[3] = 255;
    drawPixelCircle();
    drawOverlay();
})

thicknessInput.addEventListener("change", () => {
    thickness = parseInt(thicknessInput.value);
    pixelCanvas.width = pixelCanvas.height = 2 * radius + thickness;
    drawPixelCircle();
    drawOverlay();
})

outlineInput.addEventListener("change", () => {
    const hex = outlineInput.value;
    outlineColor[0] = parseInt(hex.substring(1, 3), 16);
    outlineColor[1] = parseInt(hex.substring(3, 5), 16);
    outlineColor[2] = parseInt(hex.substring(5, 7), 16);
    outlineColor[3] = 255;
    drawPixelCircle();
    drawOverlay();
})

overlayCheck.addEventListener("change", () => {
    isOverlay = !isOverlay;
    drawOverlay();
})

