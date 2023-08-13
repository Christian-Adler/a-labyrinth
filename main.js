import {clear} from "./modules/drawer.js";
import {drawLaby, drawLabyTogglePath} from "./modules/drawLaby.js";

const main = () => {
    const canvas = document.getElementById("drawArea");
    const ctx = canvas.getContext("2d");
    let ctxData = {};
    // Start listening to resize events and draw canvas.
    initialize();

    function initialize() {
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('click', () => drawLabyTogglePath(ctxData), false);
        resizeCanvas();
    }

    // Runs each time the DOM window resize event fires. Resets the canvas dimensions to match window,
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        ctxData = {ctx, WIDTH, HEIGHT, center: {x: WIDTH / 2, y: HEIGHT / 2}};
        draw();
    }

    function update(progress) {
        // Update the state of the world for the elapsed time since last render
    }

    function translateForPxLines() {
        ctx.translate(0.5, 0.5); // https://stackoverflow.com/questions/13879322/drawing-a-1px-thick-line-in-canvas-creates-a-2px-thick-line
    }

    function translateBackAfterPxLines() {
        ctx.translate(-0.5, -0.5);
    }

    function draw() {
        clear(ctxData);
        // drawBorder(ctxData);

        translateForPxLines();
        {
            // zeichneKoordinatenSystem(ctxData);
            // drawLine(ctxData);

            drawLaby(ctxData);
        }
        translateBackAfterPxLines();
    }

    // https://www.sitepoint.com/quick-tip-game-loop-in-javascript/
    function loop(timestamp) {
        const progress = timestamp - lastRender

        update(progress)
        draw()

        lastRender = timestamp
        window.requestAnimationFrame(loop)
    }

    let lastRender = 0;
    if (1 > 1)
        window.requestAnimationFrame(loop)
};

main();