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

    const modal = document.getElementById('modal');
    const trigger = document.getElementById('modal-trigger');
    trigger.addEventListener('click', e=> {
        e.preventDefault();
        modal.classList.add('show');
    })

    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', e => {
        e.preventDefault();
        modal.classList.remove('show');
    });

    window.addEventListener('click', e => {
        if (e.target.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
});