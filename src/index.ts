import * as dat from 'dat.gui';
import { Render } from './render';
import { Game } from './game';

const width = window.innerWidth;
const height = window.innerHeight;
const rgba = [0, 0, 0, 255];

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

const gui = new dat.GUI();
const config = {
    speed: 10,
    resolution: 0.2,
    initialDensity: 0.1,
    restart: startGame,
};
gui.add(config, 'resolution', 0.01, 1).onChange(startGame);
gui.add(config, 'initialDensity', 0, 1).onChange(startGame);
gui.add(config, 'speed', 0, 10, 1);
gui.add(config, 'restart');

let game: Game, render: Render;

function startGame() {
    game = new Game(
        [Math.floor(width * config.resolution), Math.floor(height * config.resolution)],
        config.initialDensity,
    );
    render = new Render(
        canvas,
        [game.width, game.height],
    );
    renderGame(game, render);
}

startGame();

function renderGame(game: Game, render: Render) {
    const {field} = game;
    for (let i = 0; i < field.length; i++) {
        if (field[i] !== 0) {
            render.drawByIndex(i, rgba);
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

requestAnimationFrame(gameStep);
