/*
The Aldous-Broder algorithm also produces uniform spanning trees.
https://weblog.jamisbuck.org/2011/1/17/maze-generation-aldous-broder-algorithm

Pick a random cell as the current cell and mark it as visited.
While there are unvisited cells:
    Pick a random neighbour.
    If the chosen neighbour has not been visited:
        Remove the wall between the current cell and the chosen neighbour.
        Mark the chosen neighbour as visited.
    Make the chosen neighbour the current cell.
 */

import {Pos} from "./pos.js";

export const cells = new Map();
export const doors = new Map();

export const visitedPath = [];
let shortestPath = [];
let showShortestPath = false;

export const width = 195;
export const height = 95;

const startPos = new Pos(1, 1);
const targetPos = new Pos(width, height);

for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
        cells.set(new Pos(x, y).toString(), 0);
    }
}
// cells.delete(new Pos(2, 3).toString());
// cells.delete(new Pos(3, 3).toString());
// cells.delete(new Pos(3, 2).toString());
// cells.delete(new Pos(4, 2).toString());
//

function clearArea(xStart, yStart, width, height) {
    for (let y = yStart; y <= yStart + height; y++) {
        for (let x = xStart; x <= xStart + width; x++) {
            cells.delete(new Pos(x, y).toString());
        }
    }
}

{
    clearArea(40, 44, 10, 1);
    // clearArea(40, 1, 10, 3);
    clearArea(43, 20, 4, 4);
    clearArea(110, 30, 4, 3);
}


/**
 * min and max included
 * @param min
 * @param max
 * @returns {number}
 */
export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const isCell = (x, y) => {
    return isCellByPos(new Pos(x, y));
};

export const isCellByPos = (pos) => {
    return cells.has(pos.toString());
};

export const hasEmptyCells = () => {
    return cells.size - visitedPath.length > 0;
};

export const getNeighborsByPos = (pos) => {
    const neighbors = [];
    let test = pos.addToNew(1, 0);
    if (isCellByPos(test))
        neighbors.push(test);
    test = pos.addToNew(-1, 0);
    if (isCellByPos(test))
        neighbors.push(test);
    test = pos.addToNew(0, 1);
    if (isCellByPos(test))
        neighbors.push(test);
    test = pos.addToNew(0, -1);
    if (isCellByPos(test))
        neighbors.push(test);
    return neighbors;
};

export const getNeighborsByPosNotVisited = (pos) => {
    const neighbors = getNeighborsByPos(pos);
    const result = [];

    for (const neighbor of neighbors) {
        if (!isVisitedByPos(neighbor))
            result.push(neighbor);
    }

    return result;
};

const getNeighborsByPosReachable = (pos) => {
    const neighbors = getNeighborsByPos(pos);
    const result = [];

    for (const neighbor of neighbors) {
        if (isDoorByPos(pos, neighbor))
            result.push(neighbor);
    }

    return result;
};

export const setVisitedByPos = (pos) => {
    if (!isCellByPos(pos)) return;
    if (visitedPath.includes(pos)) return;
    cells.set(pos.toString(), 1);
    visitedPath.push(pos);
};

const isVisited = (x, y) => {
    return isVisitedByPos(new Pos(x, y));
};
export const isVisitedByPos = (pos) => {
    return !!cells.get(pos.toString());
};

export const addDoorByPos = (pos1, pos2) => {
    if (pos1.x === pos2.x) {
        if (pos1.y < pos2.y)
            doors.set(pos1 + '-' + pos2, 1);
        else
            doors.set(pos2 + '-' + pos1, 1);
    } else {
        if (pos1.x < pos2.x)
            doors.set(pos1 + '-' + pos2, 1);
        else
            doors.set(pos2 + '-' + pos1, 1);
    }
};

const isDoor = (x, y, x2, y2) => {
    return isDoorByPos(new Pos(x, y), new Pos(x2, y2));
};

export const isDoorByPos = (pos1, pos2) => {
    if (pos1.x === pos2.x) {
        if (pos1.y < pos2.y)
            return !!doors.get(pos1 + '-' + pos2);
        else
            return !!doors.get(pos2 + '-' + pos1);
    } else {
        if (pos1.x < pos2.x)
            return !!doors.get(pos1 + '-' + pos2);
        else
            return !!doors.get(pos2 + '-' + pos1);
    }
};

export const toggleShortestPath = (ctx) => {
    showShortestPath = !showShortestPath;
    draw(ctx);
}
export const draw = (ctx) => {
    const xStart = 20;
    const yStart = 50;

    const cellWidth = 16;
    const wallWidth = 3;
    const borderWidth = 5;

    // console.info(cells);


    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.rect(xStart, yStart, cellWidth * width, cellWidth * height);
    ctx.fill();

    const lineFromToRelative = (x, y, xAdd, yAdd, lineWidth, color) => {
        ctx.beginPath();
        ctx.lineWidth = lineWidth; // Dicke
        ctx.strokeStyle = color || '#4b4b4b';
        ctx.moveTo(x, y);
        ctx.lineTo(x + xAdd, y + yAdd);
        ctx.stroke();
    };

    for (let y = 1; y <= height; y++) {
        for (let x = 1; x <= width; x++) {
            if (isCell(x, y)) {
                // if (isVisited(x, y)) {
                //     ctx.beginPath();
                //     ctx.fillStyle = isVisited(x, y) ? '#f0a0a0' : '#f0f0f0';
                //     ctx.rect(xStart + (x - 1) * cellWidth + 1, yStart + (y - 1) * cellWidth + 1, cellWidth - 1, cellWidth - 1);
                //     ctx.fill();
                // }

                let lineW = 0;
                if (isCell(x - 1, y)) {
                    if (!isDoor(x, y, x - 1, y))
                        lineW = wallWidth;
                } else { // Border
                    lineW = borderWidth;
                }
                if (lineW > 0)
                    lineFromToRelative(xStart + (x - 1) * cellWidth, yStart + (y - 1) * cellWidth - 1, 0, cellWidth + 2, lineW);

                lineW = 0;
                if (isCell(x + 1, y)) {
                    if (!isDoor(x, y, x + 1, y))
                        lineW = wallWidth;
                } else { // Border
                    lineW = borderWidth;
                }
                if (lineW > 0)
                    lineFromToRelative(xStart + (x - 1 + 1) * cellWidth, yStart + (y - 1) * cellWidth - 1, 0, cellWidth + 2, lineW);

                lineW = 0;
                if (isCell(x, y - 1)) {
                    if (!isDoor(x, y, x, y - 1))
                        lineW = wallWidth;
                } else { // Border
                    lineW = borderWidth;
                }
                if (lineW > 0)
                    lineFromToRelative(xStart + (x - 1) * cellWidth - 1, yStart + (y - 1) * cellWidth, cellWidth + 2, 0, lineW);

                lineW = 0;
                if (isCell(x, y + 1)) {
                    if (!isDoor(x, y, x, y + 1))
                        lineW = wallWidth;
                } else { // Border
                    lineW = borderWidth;
                }
                if (lineW > 0)
                    lineFromToRelative(xStart + (x - 1) * cellWidth - 1, yStart + (y - 1 + 1) * cellWidth, cellWidth + 2, 0, lineW);
            }
        }
    }

    const startEndBorderWidth = cellWidth / 6;

    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.rect(xStart + startEndBorderWidth, yStart + startEndBorderWidth, cellWidth - 2 * startEndBorderWidth, cellWidth - 2 * startEndBorderWidth);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.rect(xStart + cellWidth * (width - 1) + startEndBorderWidth, yStart + cellWidth * (height - 1) + startEndBorderWidth, cellWidth - 2 * startEndBorderWidth, cellWidth - 2 * startEndBorderWidth);
    ctx.fill();

    if (showShortestPath) {
        let prev = null;
        for (const actPos of shortestPath) {
            if (prev == null)
                prev = actPos;
            else {
                lineFromToRelative(xStart + cellWidth / 2 + (prev.x - 1) * cellWidth, yStart + cellWidth / 2 + (prev.y - 1) * cellWidth, (actPos.x - prev.x) * cellWidth, (actPos.y - prev.y) * cellWidth, wallWidth, '#00ff00');
                prev = actPos;
            }
        }
    }
};

export const findPath = () => {
    shortestPath = [];
    const global = {
        visited: new Map(),
        visitedPositions: [],
        minSteps: Number.MAX_SAFE_INTEGER, // Number.MAX_SAFE_INTEGER,
        minStepsPath: [],
    };
    /* const minFromTo = */
    findMin(startPos, targetPos, global, 0, [startPos]);
    shortestPath = global.minStepsPath;
};

function findMin(actPos, target, global, soFarSteps, soFarPath) {
    if (soFarSteps > global.minSteps)
        return Number.MAX_SAFE_INTEGER;

    if (actPos.equals(target)) {
        if (soFarSteps < global.minSteps) {
            global.minSteps = soFarSteps;
            global.minStepsPath = soFarPath;
        }
        return soFarSteps;
    }

    let min = Number.MAX_SAFE_INTEGER;
    const nextPositions = getNeighborsByPosReachable(actPos);
    for (const nextPosition of nextPositions) {
        const alreadyVisited = global.visited.get(nextPosition.toString())
        if (typeof alreadyVisited === "number") {
            if (alreadyVisited <= soFarSteps + 1)
                continue;
        } else
            global.visitedPositions.push(nextPosition);
        global.visited.set(nextPosition.toString(), soFarSteps + 1);
        const m = findMin(nextPosition, target, global, soFarSteps + 1, [...soFarPath, nextPosition]);
        if (m < min)
            min = m;
    }
    return min;
}