export class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static parse(value) {
        const split = value.split(',');
        if (split.length !== 2) throw new Error('invalid pos to parse!');
        return new Pos(parseInt(split[0]), parseInt(split[1]));
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    add(x, y) {
        this.x += x;
        this.y += y;
    }

    addPos(other) {
        this.x += other.x;
        this.y += other.y;
    }

    addToNew(x, y) {
        return new Pos(this.x + x, this.y + y);
    }

    multToNew(x, y) {
        return new Pos(this.x * x, this.y * y);
    }

    addPosToNew(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

