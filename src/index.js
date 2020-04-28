import './styles/index.scss';
import EightBallPool from './scripts/game';

const canvas = document.getElementById('pool-game');

document.addEventListener("DOMContentLoaded", () => {
    const game = new EightBallPool(canvas);
    game.restart();
});