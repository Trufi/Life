import { Render } from './render';
import { Game } from './game';

const width = 250;
const height = 250;
const rgba = [0, 0, 0, 255];

const game = new Game([width, height]);

const render = new Render(
    document.body,
    [game.width, game.height],
    [500, 500],
);

function renderGame(game: Game, render: Render) {
    const {field} = game;
    for (let i = 0; i < field.length; i++) {
        if (field[i] !== 0) {
            render.drawByIndex(i, rgba);
        }
    }
    render.commit();
}

let play = true;

document.body.addEventListener('click', () => play = !play);

function gameStep() {
    console.time('step');
    game.step();
    renderGame(game, render);
    console.timeEnd('step');
}

renderGame(game, render);

setInterval(() => {
    if (play) {
        gameStep();
    }
}, 16);
