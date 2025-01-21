const pixelCanvas = document.getElementById("pixel-circle");
const overlayCanvas = document.getElementById("overlay-circle");
const aInput = document.getElementById("a-input");
const bInput = document.getElementById("b-input");
const fillInput = document.getElementById("fill-color-input");
const thicknessInput = document.getElementById("thickness-input");
const outlineInput = document.getElementById("outline-color-input");
const overlayCheck = document.getElementById("overlay-check");
const circleContainer = document.getElementById("circle-container");
const button = document.getElementById("button");

let a = 0, b = 0;
let fillColor = [240, 80, 37, 255];
let thickness = 0;
let outlineColor = [0, 0, 0, 255];
let isOverlay = false;

function ratio() {
    if (a === 0 || b === 0) {
        return 1;
    }
    return Math.sqrt((2 * a + thickness) / (2 * b + thickness));
}

function drawPixelCircle() {
    const ctx = pixelCanvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, pixelCanvas.width, pixelCanvas.height);
    const data = imageData.data;
    const xc = pixelCanvas.width / 2, yc = pixelCanvas.height / 2;

    for (let y = 0; y < pixelCanvas.height; y++) {
        for (let x = 0; x < pixelCanvas.width; x++) {
            const index = (y * pixelCanvas.width + x) * 4;
            if (eq(x + 0.5, y + 0.5, a, b) <= 1) {
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
            if (1 <= eq(x + 0.5, y + 0.5, a - thickness / 2, b - thickness / 2) &&
                eq(x + 0.5, y + 0.5, a + thickness / 2, b + thickness / 2) <= 1) {
                data[index] = outlineColor[0];
                data[index + 1] = outlineColor[1];
                data[index + 2] = outlineColor[2];
                data[index + 3] = outlineColor[3];
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    function eq(x, y, a, b) {
        return (x - xc) * (x - xc) / (a * a) + (y - yc) * (y - yc) / (b * b);
    }
}

function drawOverlay() {
    overlayCanvas.width = 1000 * ratio();
    overlayCanvas.height = 1000 / ratio();
    let ctx = overlayCanvas.getContext("2d");
    const width = overlayCanvas.width, height = overlayCanvas.height;
    ctx.clearRect(0, 0, width, height);
    if (!isOverlay)
        return;

    const ratioX = overlayCanvas.width / (2 * a + thickness);
    const ratioY = overlayCanvas.height / (2 * b + thickness);
    ctx.lineWidth = 10;
    if (thickness > 0) {
        ctx.strokeStyle = "#E6E8E6";
    } else {
        ctx.strokeStyle = "#191919";
    }
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, ratioX * a, ratioY * b, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

aInput.addEventListener("change", () => {
    a = aInput.value / 2;
    pixelCanvas.width = 2 * a + thickness;
    pixelCanvas.height = 2 * b + thickness;
    circleContainer.style.width = 40 * ratio() + "vh";
    circleContainer.style.height = 40 / ratio() + "vh";
    drawPixelCircle();
    drawOverlay();
});

bInput.addEventListener("change", () => {
    b = bInput.value / 2;
    pixelCanvas.height = 2 * b + thickness;
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

button.addEventListener("click", () => {
    let url = pixelCanvas.toDataURL("image/png");
    const ce = document.createElement("a");
    ce.href = url;
    ce.download = "imager";
    ce.click();
    ce.remove();
})

