const inputs = {
    isCircle: document.getElementById('is-circle-check'),
    hasOverlay: document.getElementById('overlay-check'),
    a: document.getElementById('a-input'),
    b: document.getElementById('b-input'),
    fillColor: document.getElementById('fill-color-input'),
    thickness: document.getElementById('thickness-input'),
    outlineColor: document.getElementById('outline-color-input')
};

const labels = {
    isOverlaid: document.getElementById('overlay-label'),
    a: document.getElementById('a-label'),
    b: document.getElementById('b-label')
};

const canvases = {
    container: document.getElementById('circle-container'),
    pixelCircle: document.getElementById('pixel-circle'),
    overlay: document.getElementById('overlay-circle'),
    update() {
        canvases.container.style.width = 60 * state.ratio() + "vh";
        canvases.container.style.height = 60 / state.ratio() + "vh";
        drawPixelCircle();
        drawOverlay();
    }
};

const button = document.getElementById("button");


const state = {
    isCircle: true,
    isOverlay: false,
    a: 0,
    b: 0,
    fillColor: [240, 80, 37, 255],
    thickness: 0,
    outlineColor: [25, 25, 25, 255],
    ratio() {
        if (state.a === 0 || state.b === 0) {
            return 1;
        }
        return Math.sqrt((2 * state.a + state.thickness) / (2 * state.b + state.thickness));
    }
};

function hexToRgba(hex) {
    hex = hex.replace('#', '');
    return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
        255
    ];
}

function drawPixelCircle() {
    canvases.pixelCircle.width = 2 * state.a + state.thickness;
    canvases.pixelCircle.height = 2 * state.b + state.thickness;

    const ctx = canvases.pixelCircle.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvases.pixelCircle.width, canvases.pixelCircle.height);
    const data = imageData.data;
    const xc = canvases.pixelCircle.width / 2, yc = canvases.pixelCircle.height / 2;

    for (let y = 0; y < canvases.pixelCircle.height; y++) {
        for (let x = 0; x < canvases.pixelCircle.width; x++) {
            const index = (y * canvases.pixelCircle.width + x) * 4;
            if (eq(x + 0.5, y + 0.5, state.a, state.b) <= 1) {
                data[index] = state.fillColor[0];
                data[index + 1] = state.fillColor[1];
                data[index + 2] = state.fillColor[2];
                data[index + 3] = state.fillColor[3];
            } else {
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 0;
            }
            if (1 <= eq(x + 0.5, y + 0.5, state.a - state.thickness / 2, state.b - state.thickness / 2) &&
                eq(x + 0.5, y + 0.5, state.a + state.thickness / 2, state.b + state.thickness / 2) <= 1) {
                data[index] = state.outlineColor[0];
                data[index + 1] = state.outlineColor[1];
                data[index + 2] = state.outlineColor[2];
                data[index + 3] = state.outlineColor[3];
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    function eq(x, y, a, b) {
        return (x - xc) * (x - xc) / (a * a) + (y - yc) * (y - yc) / (b * b);
    }
}

function drawOverlay() {
    canvases.overlay.width = 1000 * state.ratio();
    canvases.overlay.height = 1000 / state.ratio();
    let ctx = canvases.overlay.getContext("2d");
    const width = canvases.overlay.width, height = canvases.overlay.height;
    ctx.clearRect(0, 0, width, height);
    if (!state.hasOverlay)
        return;

    const ratioX = canvases.overlay.width / (2 * state.a + state.thickness);
    const ratioY = canvases.overlay.height / (2 * state.b + state.thickness);

    ctx.lineWidth = 30;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, ratioX * state.a, ratioY * state.b, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, ratioX * state.a, ratioY * state.b, 0, 0, 2 * Math.PI);
    ctx.stroke();
}


inputs.isCircle.addEventListener("change", () => {
    state.isCircle = !state.isCircle;
    labels.b.hidden = state.isCircle;
    inputs.b.hidden = state.isCircle;
    if (state.isCircle) {
        labels.a.innerHTML = 'Diameter:';
        labels.isOverlaid.innerHTML = "Overlay real circle:";
    } else {
        labels.a.innerHTML = "Width:";
        labels.isOverlaid.innerHTML = "Overlay real ellipse:";
    }
    state.b = state.a;
    inputs.b.value = 2 * state.b;
    canvases.update();
})

inputs.hasOverlay.addEventListener("change", () => {
    state.hasOverlay = !state.hasOverlay;
    drawOverlay();
})

inputs.a.addEventListener("change", () => {
    let temp = parseFloat(inputs.a.value);
    if (temp > 100) temp = 100;
    if (temp < state.thickness) {
        state.thickness = temp;
        inputs.thickness.value = state.thickness;
    }
    state.a = temp / 2;
    if (state.isCircle) {
        state.b = state.a;
        inputs.b.value = 2 * state.b;
    }
    canvases.update();
});

inputs.b.addEventListener("change", () => {
    let temp = parseFloat(inputs.b.value);
    if (temp > 100) temp = 100;
    if (temp < state.thickness) {
        state.thickness = temp;
        inputs.thickness.value = state.thickness;
    }
    state.b = temp / 2;
    canvases.update();
});

inputs.fillColor.addEventListener("change", () => {
    const hex = inputs.fillColor.value;
    state.fillColor = hexToRgba(hex);
    canvases.update();
})

inputs.thickness.addEventListener("change", () => {
    let temp = parseFloat(inputs.thickness.value);
    if (temp / 2 > state.a || temp / 2 > state.b) {
        inputs.thickness.value = state.thickness;
    } else {
        state.thickness = temp;
    }
    canvases.update();
})

inputs.outlineColor.addEventListener("change", () => {
    const hex = inputs.outlineColor.value;
    state.outlineColor = hexToRgba(hex);
    canvases.update();
})

button.addEventListener("click", () => {
    let imageURL = canvases.pixelCircle.toDataURL("image/png");
    const tempAnchor = document.createElement("a");
    tempAnchor.href = imageURL;
    if (state.isCircle)
        tempAnchor.download = "pixel-circle";
    else
        tempAnchor.download = "pixel-ellipse";
    tempAnchor.click();
    tempAnchor.remove();
})

