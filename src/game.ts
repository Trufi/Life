import { Figure } from './rle';
import { TreeNode, emptyTree, expand, setBit, step, getBit } from './node';

export class Game {
    private tree: TreeNode;

    constructor() {
        this.tree = emptyTree(3);
    }

    public step() {
        let tree = this.tree;

        let steps = 0;

        while (
            tree.level < 3 ||
            tree.nw.population !== tree.nw.se.se.population ||
            tree.ne.population !== tree.ne.sw.sw.population ||
            tree.sw.population !== tree.sw.ne.ne.population ||
            tree.se.population !== tree.se.nw.nw.population
        ) {
            tree = expand(tree);
            steps++;
            if (steps > 5) {
                console.log('stack overflow');
                break;
            }
        }

        this.tree = step(tree);
    }

    public addFigure(x: number, y: number, figure: Figure) {
        const {width, height, data} = figure;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const living = data[j * width + i];
                if (living) {
                    this.setField(x + j, y + i, data[j * width + i]);
                }
            }
        }
    }

    public alive(x: number, y: number): number {
        return getBit(this.tree, x, y);
    }

    private setField(x: number, y: number, living: number) {
        let max = 2 ** (this.tree.level - 1);

        // A root node at level n supports coordinates from -2^(n-1) to 2^(n-1)-1
        while (
            x < -max || x > max - 1 ||
            y < -max || y > max - 1
        ) {
            this.tree = expand(this.tree);
            max = 2 ** (this.tree.level - 1);
        }

        this.tree = setBit(this.tree, x, y, living);
    }
}
