import { Figure } from './rle';

export class Game {
    public livingCells: Set<number>;
    private checkedCells: Set<number>;

    constructor() {
        this.livingCells = new Set();
        this.checkedCells = new Set();
    }

    public step() {
        const checkedCells = this.checkedCells;
        const livingCells = this.livingCells;
        const createdCells = new Set();
        const deadCells = new Set();

        checkedCells.forEach((cell) => {
            const neighbors = countAliveNeighbors(livingCells, cell);

            if (livingCells.has(cell)) {
                if (neighbors !== 2 && neighbors !== 3) {
                    deadCells.add(cell);
                }
            } else {
                if (neighbors === 3) {
                    createdCells.add(cell);
                }
            }
        });

        checkedCells.clear();

        deadCells.forEach((cell) => {
            livingCells.delete(cell);
            addNeighborsToCheck(checkedCells, cell);
        });

        createdCells.forEach((cell) => {
            livingCells.add(cell);
            addNeighborsToCheck(checkedCells, cell);
        });
    }

    public addFigure(x: number, y: number, figure: Figure) {
        const {width, height, data} = figure;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (data[j * width + i] === 1) {
                    const cell = getIndex(x + i, y + j);
                    this.livingCells.add(cell);
                    this.checkedCells.add(cell);
                    addNeighborsToCheck(this.checkedCells, cell);
                }
            }
        }
    }
}

function addNeighborsToCheck(nextCheckedCells: Set<number>, cell: number) {
    const x = cell >>> 16;
    const y = cell & 0xffff;

    nextCheckedCells.add(getIndex(x - 1, y - 1));
    nextCheckedCells.add(getIndex(x - 1, y));
    nextCheckedCells.add(getIndex(x - 1, y + 1));
    nextCheckedCells.add(getIndex(x, y - 1));
    nextCheckedCells.add(getIndex(x, y + 1));
    nextCheckedCells.add(getIndex(x + 1, y - 1));
    nextCheckedCells.add(getIndex(x + 1, y));
    nextCheckedCells.add(getIndex(x + 1, y + 1));
}

function countAliveNeighbors(livingCells: Set<number>, cell: number) {
    const x = cell >>> 16;
    const y = cell & 0xffff;

    return alive(livingCells, x - 1, y - 1) +
        alive(livingCells, x - 1, y) +
        alive(livingCells, x - 1, y + 1) +
        alive(livingCells, x, y - 1) +
        alive(livingCells, x, y + 1) +
        alive(livingCells, x + 1, y - 1) +
        alive(livingCells, x + 1, y) +
        alive(livingCells, x + 1, y + 1);
}

function alive(livingCells: Set<number>, x: number, y: number): number {
    return livingCells.has(getIndex(x, y)) ? 1 : 0;
}

function getIndex(x: number, y: number): number {
    return x << 16 | y;
}
