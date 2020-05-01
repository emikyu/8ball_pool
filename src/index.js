import './styles/index.scss';
import EightBallPool from './scripts/game';

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('pool-game');
    const game = new EightBallPool(canvas);
    game.restart();

    const button = document.getElementById('restart-game');
    button.addEventListener('click', e => {
        game.restart();
    });
});