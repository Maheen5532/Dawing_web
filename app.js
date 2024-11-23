const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const toolBtns = document.querySelectorAll(".tools");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("size-slider");
const clearBoard = document.getElementById("clear-board");
const saveImg = document.getElementById("save-img");
const fillColor = document.getElementById("fill-color");

let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let prevMouseX, prevMouseY;
let snapshot;

// Set canvas dimensions
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Update brush or shape color
colorPicker.addEventListener("input", (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
});

// Update brush size
sizeSlider.addEventListener("input", (e) => {
    brushWidth = e.target.value;
    ctx.lineWidth = brushWidth;
});

// Start drawing
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); // Prepare for drawing
    ctx.lineWidth = brushWidth; // Set brush size
};

// Drawing logic
const drawing = (e) => {
    if (!isDrawing) return;

    // Restore the canvas to its previous state
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "square") {
        const rectWidth = e.offsetX - prevMouseX;
        const rectHeight = e.offsetY - prevMouseY;
        if (fillColor.checked) {
            ctx.fillRect(prevMouseX, prevMouseY, rectWidth, rectHeight);
        } else {
            ctx.strokeRect(prevMouseX, prevMouseY, rectWidth, rectHeight);
        }
    } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
            Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2)
        );
        ctx.beginPath();
        ctx.arc(prevMouseX, prevMouseY, radius, 0, Math.PI * 2);
        fillColor.checked ? ctx.fill() : ctx.stroke();
    } else if (selectedTool === "triangle") {
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
        ctx.closePath();
        fillColor.checked ? ctx.fill() : ctx.stroke();
    } else if (selectedTool === "eraser") {
        ctx.strokeStyle = "#ffffff"; // Erase with white color
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
};

// Stop drawing
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// Tool selection
toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector(".tools.active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// Clear the canvas
clearBoard.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save canvas as image
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
});

// Attach event listeners
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
