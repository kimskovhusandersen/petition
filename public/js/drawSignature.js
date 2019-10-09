(function() {
    const canvas = document.getElementById("canvas");
    const signature = document.getElementsByName("signature");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth * 0.5;
    ctx.canvas.height = window.innerHeight * 0.5;
    let mouseIsDown, lastMousePosition, animId, pngUrl;

    mouseIsDown = false;

    function onMouseDown(e) {
        mouseIsDown = true;
        lastMousePosition = { x: e.offsetX, y: e.offsetY };
        canvas.addEventListener("mousemove", onMouseMove, false);
        // For touch screen
        canvas.addEventListener("ontouchmove", onMouseMove, false);
    }

    function onMouseUp() {
        mouseIsDown = false;
        cancelAnimationFrame(animId);
        canvas.removeEventListener("mousemove", onMouseMove, false);
        // For touch screen
        canvas.removeEventListener("ontouchmove", onMouseMove, false);
    }

    function onMouseMove(e) {
        if (
            lastMousePosition.x != e.offsetX ||
            lastMousePosition.y != e.offsetY
        ) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            lastMousePosition.x = e.offsetX;
            lastMousePosition.y = e.offsetY;
        }
    }

    function saveSignature() {
        pngUrl = canvas.toDataURL();
        signature[0].value = pngUrl;
    }

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("click", saveSignature);

    // For touch screen
    canvas.addEventListener("ontouchstart", onMouseDown, false);
    canvas.addEventListener("ontouchend", onMouseUp, false);
    canvas.addEventListener("ontouchcancel", onMouseUp, false);

    // const imageSignature = document.getElementById("image-signature");
})();
