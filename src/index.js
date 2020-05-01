import './styles/index.scss';
import EightBallPool from './scripts/game';

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('pool-game');
    const game = new EightBallPool(canvas);
    game.restart();
});