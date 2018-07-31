export class Render {
    private width: number;
    private ctx: CanvasRenderingContext2D;
    private imageData: ImageData;

    constructor(canvas: HTMLCanvasElement, size: number[]) {
        canvas.width = size[0];
        canvas.height = size[1];
        this.width = size[0];
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.imageData = this.ctx.createImageData(size[0], size[1]);
    }

    public draw(x: number, y: number, rgba: number[]) {
        const {data} = this.imageData;
        const width = this.width;

        data[(y * width + x) * 4] = rgba[0];
        data[(y * width + x) * 4 + 1] = rgba[1];
        data[(y * width + x) * 4 + 2] = rgba[2];
        data[(y * width + x) * 4 + 3] = rgba[3];
    }

    public drawByIndex(index: number, rgba: number[]) {
        const {data} = this.imageData;
        data[index * 4] = rgba[0];
        data[index * 4 + 1] = rgba[1];
        data[index * 4 + 2] = rgba[2];
        data[index * 4 + 3] = rgba[3];
    }

    public commit() {
        this.ctx.putImageData(this.imageData, 0, 0);
        this.clear();
    }

    private clear() {
        const {data} = this.imageData;
        for (let i = 0; i < data.length; i++) {
            data[i] = 0;
        }
    }
}
