// const random = (() => {
//     let seed = 15;

//     return () => {
//         seed = seed * 16807 % 2147483647;
//         return (seed - 1) / 2147483646;
//     };
// })();

export class Game {
    public width: number;
    public height: number;
    public field: Uint8Array;
    private temp: Uint8Array;

    constructor(size: number[]) {
        this.width = size[0];
        this.height = size[1];
        this.field = new Uint8Array(this.width * this.height);
        this.temp = new Uint8Array(this.field.length);

        for (let i = 0; i < this.field.length; i++) {
            this.field[i] = Math.round(Math.random());
        }
    }

    public step() {
        // if empty field has three neighbors - alive
        collectCounts(this.temp, this.field, this.width, this.height);

        for (let i = 0; i < this.field.length; i++) {
            const live = this.field[i] !== 0;
            const neighbors = this.temp[i];

            if (live) {
                if (neighbors !== 2 && neighbors !== 3) {
                    this.field[i] = 0;
                }
            } else {
                if (neighbors === 3) {
                    this.field[i] = 1;
                }
            }
        }
    }
}

function collectCounts(out: Uint8Array, field: Uint8Array, width: number, height: number) {
    for (let i = 0; i < out.length; i++) {
        out[i] = 0;
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (field[width * y + x] !== 0) {
                out[getIndex(width, height, x - 1, y - 1)]++;
                out[getIndex(width, height, x - 1, y)]++;
                out[getIndex(width, height, x - 1, y + 1)]++;
                out[getIndex(width, height, x, y - 1)]++;
                out[getIndex(width, height, x, y + 1)]++;
                out[getIndex(width, height, x + 1, y - 1)]++;
                out[getIndex(width, height, x + 1, y)]++;
                out[getIndex(width, height, x + 1, y + 1)]++;
            }
        }
    }
}

function getIndex(width: number, height: number, x: number, y: number): number {
    return width * ((y + height) % height) + (x + width) % width;
}

// function getCell(field: Uint8Array, width: number, height: number, x: number, y: number): number {
//     return field[width * ((y + height) % height) + (x + width) % width];
// }

// function countLiveNeighbors(field: Uint8Array, width: number, height: number, x: number, y: number): number {
//     return getCell(field, width, height, x - 1, y - 1) +
//         getCell(field, width, height, x - 1, y) +
//         getCell(field, width, height, x - 1, y + 1) +
//         getCell(field, width, height, x, y - 1) +
//         getCell(field, width, height, x, y + 1) +
//         getCell(field, width, height, x + 1, y - 1) +
//         getCell(field, width, height, x + 1, y) +
//         getCell(field, width, height, x + 1, y + 1);
// }
