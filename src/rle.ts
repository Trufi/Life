export interface Figure {
    width: number;
    height: number;
    data: Uint8Array;
}

export function readRLE(text: string): Figure | undefined {
    const lines = text.split(/[\r\n]+/g);

    let i = 0;

    // skip comments
    while (lines[i++][0] === '#') {}

    const desc = lines[i - 1];

    const matchX = desc.match(/x\s*=\s*([0-9]+)/);
    const matchY = desc.match(/y\s*=\s*([0-9]+)/);

    if (!matchX || !matchY) {
        return;
    }

    const width = Number(matchX[1]);
    const height = Number(matchY[1]);

    const data = new Uint8Array(width * height);

    let x = 0;
    let y = 0;

    let count = 1;

    while (i < lines.length) {
        const line = lines[i++];
        const glyphs = line.match(/[0-9]+|[bo]|\$|!/g);

        if (!glyphs) {
            continue;
        }

        let end = false;

        for (let j = 0; j < glyphs.length; j++) {
            const glyph = glyphs[j];

            if (glyph === 'b') {
                x += count;
                count = 1;
            } else if (glyph === 'o') {
                for (let k = 0; k < count; k++) {
                    data[width * y + x] = 1;
                    x++;
                }
                count = 1;
            } else if (glyph === '$') {
                x = 0;
                y += count;
                count = 1;
            } else if (glyph === '!') {
                end = true;
                break;
            } else if (Number(glyph)) {
                count = Number(glyph);
            }
        }

        if (end) {
            break;
        }
    }

    return {
        width,
        height,
        data,
    };
}
