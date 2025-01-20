const pixelCanvas = document.getElementById("pixel-circle");
const overlayCanvas = document.getElementById("overlay-circle");
const aInput = document.getElementById("a-input");
const fillInput = document.getElementById("fill-color-input");
const thicknessInput = document.getElementById("thickness-input");

let radius = 0;
let fillColor = [240, 80, 37, 255];
let thickness = 0;
let outlineColor = [0, 0, 0, 255];

function fill() {
    const ctx = pixelCanvas.getContext("2d");

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    const imageData = ctx.getImageData(0, 0, pixelCanvas.width, pixelCanvas.height);
    const data = imageData.data;
    const xc = pixelCanvas.width / 2, yc = pixelCanvas.height / 2;

    for (let y = 0; y < pixelCanvas.height; y++) {
        for (let x = 0; x < pixelCanvas.width; x++) {
            const index = (y * pixelCanvas.width + x) * 4;
            if (distance(x + 0.5, y + 0.5, xc, yc) <= radius) {
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
            const d = distance(x + 0.5, y + 0.5, xc, yc);
            if (radius - thickness / 2 <= d && d <= radius + thickness / 2) {
                data[index] = outlineColor[0];
                data[index + 1] = outlineColor[1];
                data[index + 2] = outlineColor[2];
                data[index + 3] = outlineColor[3];
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function outline() {
    if (thickness === 0)
        return;

    const ctx = pixelCanvas.getContext("2d");

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    const imageData = ctx.getImageData(0, 0, pixelCanvas.width, pixelCanvas.height);
    const data = imageData.data;
    const xc = pixelCanvas.width / 2, yc = pixelCanvas.height / 2;

    for (let y = 0; y < pixelCanvas.height; y++) {
        for (let x = 0; x < pixelCanvas.width; x++) {
            const index = (y * pixelCanvas.width + x) * 4;

        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function overlay() {
    const width = overlayCanvas.width, height = overlayCanvas.height;
    let ctx = overlayCanvas.getContext("2d");
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

aInput.addEventListener("change", () => {
    radius = aInput.value / 2;
    pixelCanvas.width = pixelCanvas.height = 2 * radius + thickness;
    fill();
    overlay();
});

fillInput.addEventListener("change", () => {
    const hex = fillInput.value;
    fillColor[0] = parseInt(hex.substring(1, 3), 16);
    fillColor[1] = parseInt(hex.substring(3, 5), 16);
    fillColor[2] = parseInt(hex.substring(5, 7), 16);
    fillColor[3] = 255;
    fill();
    overlay();
})

thicknessInput.addEventListener("change", () => {
    thickness = parseInt(thicknessInput.value);
    pixelCanvas.width = pixelCanvas.height = 2 * radius + thickness;
    fill();
    overlay();
})

