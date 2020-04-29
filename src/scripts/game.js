import { PoolTable, innerBorder, outerBorder, margin} from './table';
import { BALL_CONSTANTS, PoolBall } from './ball';

const POOL_BALLS = [
    { number: null, color: "white", marking: null },
    { number: 1, color: "yellow", marking: "solid" },
    { number: 2, color: "blue", marking: "solid" },
    { number: 3, color: "red", marking: "solid" },
    { number: 4, color: "purple", marking: "solid" },
    { number: 5, color: "orange", marking: "solid" },
    { number: 6, color: "green", marking: "solid" },
    { number: 7, color: "brown", marking: "solid" },
    { number: 8, color: "black", marking: "solid" },
    { number: 9, color: "yellow", marking: "striped" },
    { number: 10, color: "blue", marking: "striped" },
    { number: 11, color: "red", marking: "striped" },
    { number: 12, color: "purple", marking: "striped" },
    { number: 13, color: "orange", marking: "striped" },
    { number: 14, color: "green", marking: "striped" },
    { number: 15, color: "brown", marking: "striped" }
];

export default class EightBallPool {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.dimensions = { width: canvas.width, height: canvas.height };


        this.innerTopLeft = [margin + outerBorder + innerBorder / 2, margin + outerBorder + innerBorder / 2];
        this.innerBottomRight = [this.dimensions.width - margin - outerBorder - innerBorder / 2, this.dimensions.height - margin - outerBorder - innerBorder / 2];
        this.innerWidthHeight = [this.dimensions.width - margin * 2 - outerBorder * 2 - innerBorder, this.dimensions.height - margin * 2 - outerBorder * 2 - innerBorder];
    }

    animate() {
        this.table.animate(this.ctx);
        this.poolBalls.forEach(poolBall => {
            poolBall.animate(this.ctx);
        });
    }

    rackPoolBalls() {
        const x0 = this.innerTopLeft[0] + 0.75 * this.innerWidthHeight[0];
        const y0 = this.innerTopLeft[1] + 0.50 * this.innerWidthHeight[1];

        const positions = [{x: this.innerTopLeft[0] + 0.25 * this.innerWidthHeight[0], y: y0}];

        [...Array(5).keys()].forEach(n => {
            return [...Array(n + 1).keys()].forEach(m => {
                const x = x0 + n * BALL_CONSTANTS.RADIUS * Math.sqrt(3);
                const y = y0 - n * BALL_CONSTANTS.RADIUS + 2 * m * BALL_CONSTANTS.RADIUS;
                positions.push({x, y});
            });
        });

        const poolBalls = [];
        // initiate cue ball
        poolBalls[0] = new PoolBall(positions[0], POOL_BALLS[0].number, POOL_BALLS[0].color, POOL_BALLS[0].marking);
        // initiate 8-ball
        poolBalls[5] = new PoolBall(positions[5], POOL_BALLS[8].number, POOL_BALLS[8].color, POOL_BALLS[8].marking);


        // initiate end corners - one striped and one solid
        const solidBalls = POOL_BALLS.slice(1, 8);
        const stripedBalls = POOL_BALLS.slice(9);
        const randSolid = Math.floor(Math.random() * solidBalls.length);
        const randStriped = Math.floor(Math.random() * stripedBalls.length);
        poolBalls[11] = new PoolBall(positions[11], solidBalls[randSolid].number, solidBalls[randSolid].color, solidBalls[randSolid].marking);
        poolBalls[15] = new PoolBall(positions[15], stripedBalls[randStriped].number, stripedBalls[randStriped].color, stripedBalls[randStriped].marking);
        
        solidBalls.splice(randSolid, 1);
        stripedBalls.splice(randStriped, 1);
        const tempBalls = solidBalls.concat(stripedBalls);
        console.log(tempBalls);

        positions.forEach((pos, idx) => {
            if (!poolBalls[idx]) {
                const randBall = Math.floor(Math.random() * tempBalls.length);
                const poolBall = new PoolBall(pos, tempBalls[randBall].number, tempBalls[randBall].color, tempBalls[randBall].marking);
                poolBalls[idx] = poolBall;
                tempBalls.splice(randBall, 1);
            }
        });

        return poolBalls;
    }

    restart() {
        this.table = new PoolTable(this.dimensions);
        this.poolBalls = this.rackPoolBalls();
        this.animate();
    }
}