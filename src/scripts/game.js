import PoolTable from './table';

export default class EightBallPool {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.dimensions = { width: canvas.width, height: canvas.height };
    }

    animate() {
        this.table.animate(this.ctx);
    }

    restart() {
        this.table = new PoolTable(this.dimensions);
        this.animate();
    }
}