import * as dat from 'dat.gui';
import { Render } from './render';
import { Game } from './game';
import { figures } from './figures';
import { readRLE, Figure } from './rle';

const width = window.innerWidth;
const height = window.innerHeight;
const rgba = [0, 0, 0, 255];

const center = [0, 0];

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

let figure: Figure | undefined;

const gui = new dat.GUI();
const config = {
    speed: 10,
    resolution: 0.3,
    initialDensity: 0.1,
    restart: () => {
        figure = undefined;
        startGame();
    },
    figures: {} as {[name: string]: () => void},
    step: () => gameStep(),
};

gui.add(config, 'resolution', 0.01, 1).onChange(() => startGame());
gui.add(config, 'initialDensity', 0, 1).onChange(() => startGame());
gui.add(config, 'speed', 0, 10, 1);
gui.add(config, 'restart');
gui.add(config, 'step');

const figuresFolder = gui.addFolder('Figures');
for (const name in figures) {
    config.figures[name] = () => {
        figure = readRLE(figures[name]);
        startGame();
    };
    figuresFolder.add(config.figures, name);
}

let game: Game, render: Render;

const renderSize = {
    width: 100,
    height: 100,
};

function startGame() {
    game = new Game();

    if (figure) {
        game.addFigure(
            0,
            0,
            figure,
        );
    }

    render = new Render(
        canvas,
        [renderSize.width, renderSize.height],
    );

    renderGame(game, render);
}

startGame();

function renderGame(game: Game, render: Render) {
    for (let i = 0; i < renderSize.width; i++) {
        for (let j = 0; j < renderSize.height; j++) {
            const living = game.alive(
                Math.floor(center[0] - renderSize.width / 2 + i),
                Math.floor(center[1] - renderSize.height / 2 + j),
            );

            if (living) {
                render.draw(i, j, rgba);
            }
        }
    }

    render.commit();
}

let lastStepTime = Date.now();

function gameStep() {
    requestAnimationFrame(gameStep);

    if (game && render && config.speed !== 0) {
        const now = Date.now();

        const k = (16 - 1000) / 9;
        const c = 1000 - k;

        if (now - lastStepTime > k * config.speed + c) {
            console.time('step');
            game.step();
            renderGame(game, render);
            console.timeEnd('step');
            lastStepTime = now;
        }
    }
}

// requestAnimationFrame(gameStep);
