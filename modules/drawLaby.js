import * as labyrinth from "./labyrinth.js";
import {Pos} from "./pos.js";

export const drawLaby = ({ctx /*, center, WIDTH, HEIGHT */}) => {
    const move = (x, y) => {
        ctx.moveTo(x, y);
    }
    const line = (x, y) => {
        ctx.lineTo(x, y);
    }

    ctx.beginPath();
    ctx.lineWidth = 2; // Dicke
    // ctx.strokeStyle = '#ff0000'; // Farbe;
    // move(50, 50);
    // line(100, 200);
    ctx.fillStyle = '#a0a0a0'; // Farbe;

    // labyrinth.setVisited(4, 3);
    // labyrinth.addDoorByPos(new Pos(1, 1), new Pos(1, 2));


    const numCells = labyrinth.cells.size;
    console.log(numCells);
    const zufall = labyrinth.randomIntFromInterval(1, numCells);
    console.log(zufall);
    const startPos = Pos.parse([...labyrinth.cells.keys()][zufall - 1]);
    console.log(startPos);
    labyrinth.setVisitedByPos(startPos);

    let currentPos = startPos;

    if (labyrinth.hasEmptyCells()) {
        while (labyrinth.hasEmptyCells()) {
            const neighbors = labyrinth.getNeighborsByPos(currentPos);
            // console.log(neighbors);

            const neighborPos = neighbors[labyrinth.randomIntFromInterval(1, neighbors.length) - 1];

            if (!labyrinth.isVisitedByPos(neighborPos)) {
                labyrinth.setVisitedByPos(neighborPos);
                labyrinth.addDoorByPos(currentPos, neighborPos);
            }

            currentPos = neighborPos;
        }


        labyrinth.findPath();
    }

    labyrinth.draw(ctx);
    // window.lab = labyrinth;
    // window.pos = Pos;

    // labyrinth.log();

};

export const drawLabyTogglePath = ({ctx}) => {
    labyrinth.toggleShortestPath(ctx);
}
