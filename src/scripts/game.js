import { PoolTable, innerBorder, outerBorder, margin, bigRadius, smallRadius} from './table';
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

const energyLoss = 0.9;

export default class EightBallPool {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.dimensions = { width: canvas.width, height: canvas.height };


        this.innerTopLeft = [margin + outerBorder + innerBorder / 2, margin + outerBorder + innerBorder / 2];
        this.innerBottomRight = [this.dimensions.width - margin - outerBorder - innerBorder / 2, this.dimensions.height - margin - outerBorder - innerBorder / 2];
        this.innerWidthHeight = [this.dimensions.width - margin * 2 - outerBorder * 2 - innerBorder, this.dimensions.height - margin * 2 - outerBorder * 2 - innerBorder];

        this.pocketedBalls = new Array(15);

    } 

    animate() {
        this.table.animate(this.ctx);

        this.poolBalls.forEach(poolBall => {
            poolBall.move(this.ctx);
        });
        this.checkCollisions();
        this.checkPocketsAndBoundary();
        this.poolBalls.forEach(poolBall => {
            poolBall.animate(this.ctx);
        });

        // console.log(this.poolBalls.map(poolBall => [poolBall.number, poolBall.vx, poolBall.vy]));

        // if (this.poolBalls.every(poolBall => poolBall.vx === 0 && poolBall.vy === 0)) {
        //     console.log("balls have stopped moving!");
        // }
        
        if (this.running) requestAnimationFrame(this.animate.bind(this));
    }

    // check for collisions among pool balls
    checkCollisions() {
        this.poolBalls.forEach(poolBall => poolBall.colliding = false );
        // goes through every unique pair of pool balls to check for collision
        for (let i = 0; i < this.poolBalls.length; i++) {
            for (let j = i + 1; j < this.poolBalls.length; j++) {
                if (this.poolBalls[i].intersect(this.poolBalls[j])) {
                    this.poolBalls[i].colliding = true;
                    this.poolBalls[j].colliding = true;
                    this.updateSpeed(this.poolBalls[i], this.poolBalls[j]);
                }
            } 
        }
    }

    // check for pocketing balls & collisions with pool table sides
    checkPocketsAndBoundary() {
        this.poolBalls.forEach((poolBall, idx) => {
            const isNearPocket = this.isNearPocket(poolBall);

            if (this.isPocketed(poolBall)) {
                this.pocketedBalls.push(poolBall);
                this.poolBalls[idx] = null;
            } else if (isNearPocket) {

            }
            else {
                if (poolBall.x - BALL_CONSTANTS.RADIUS <= this.innerTopLeft[0] + innerBorder / 2 || poolBall.x + BALL_CONSTANTS.RADIUS >= this.innerBottomRight[0] - innerBorder / 2) {
                    poolBall.vx = -poolBall.vx;
                    // poolBall.vy *= energyLoss;
                }
                if (poolBall.y - BALL_CONSTANTS.RADIUS <= this.innerTopLeft[1] + innerBorder / 2 || poolBall.y + BALL_CONSTANTS.RADIUS >= this.innerBottomRight[1] - innerBorder / 2) {
                    poolBall.vy = -poolBall.vy;
                    // poolBall.vx *= energyLoss;
                }
            }
        });
        this.poolBalls = this.poolBalls.filter(poolBall => poolBall);
    }

    isNearPocket(poolBall) {
        const left = this.innerTopLeft[0] + innerBorder / 2 + 1.4 * bigRadius + BALL_CONSTANTS.RADIUS;
        const top = this.innerTopLeft[1] + innerBorder / 2 + 1.4 * bigRadius + BALL_CONSTANTS.RADIUS;
        const right = this.innerBottomRight[0] - innerBorder / 2 - 1.4 * bigRadius - BALL_CONSTANTS.RADIUS;
        const bottom = this.innerBottomRight[1] - innerBorder / 2 - 1.4 * bigRadius - BALL_CONSTANTS.RADIUS;
        const midLeft = 0.5 * this.dimensions.width - smallRadius - innerBorder + BALL_CONSTANTS.RADIUS;
        const midRight = 0.5 * this.dimensions.width + smallRadius + innerBorder - BALL_CONSTANTS.RADIUS;

        // returns the slopes & intercepts to check - (y + x - c): slope = +1 OR (y - x - c): slope = -1; dir is which side of circle hits line
        if (poolBall.x <= left && poolBall.y <= top) return [{ slope: -1, intercept: 1.4 * bigRadius, dir: "bottomLeft"}, 
                                                            { slope: -1, intercept: -1.4 * bigRadius, dir: "topRight"}];
        if (poolBall.x <= left && poolBall.y >= bottom) return [{ slope: 1, intercept: this.dimensions.height - 1.4 * bigRadius, dir: "topLeft" },
                                                                { slope: 1, intercept: this.dimensions.height + 1.4 * bigRadius, dir: "bottomRight"}];
        if (poolBall.x >= right && poolBall.y <= top) return [{ slope: 1, intercept: this.dimensions.width - 1.4 * bigRadius, dir: "topLeft"},
                                                                { slope: 1, intercept: this.dimensions.width + 1.4 * bigRadius, dir: "bottomRight"}];
        if (poolBall.x >= right && poolBall.y >= bottom) return [{ slope: -1, intercept: this.dimensions.height - this.dimensions.width - 1.4 * bigRadius, dir: "topRight"},
                                                                { slope: -1, intercept: this.dimensions.height - this.dimensions.width + 1.4 * bigRadius, dir: "bottomLeft"}];
        if (poolBall.y <= top && poolBall.x >= midLeft && poolBall.x <= midRight) return [{ slope: 1, intercept: "TBD", dir: "topLeft"}, // START HERE ON THURSDAY
                                                                                            { slope: -1, intercept: "TBD", dir: "topRight"}];
        if (poolBall.y >= bottom && poolBall.x >= midLeft && poolBall.x <= midRight) return [{ slope: -1, intercept: "TBD", dir: "bottomLeft"},
                                                                                            {slope: 1, intercept: "TBD", dir: "bottomRight"}];

        return null;
    }

    isPocketed(poolBall) {
        return this.table.pocketCenters.some(center => {
            if ((center[0] - poolBall.x) * (center[0] - poolBall.x) + 
                (center[1] - poolBall.y) * (center[1] - poolBall.y) <= 
                center[2] * center[2]) {
                    return true;
            } else {
                return false;
            }
        });
    }

    updateSpeed(ballOne, ballTwo) {
        debugger
        const vColl = {x: ballTwo.x - ballOne.x, y: ballTwo.y - ballOne.y};
        const d = Math.sqrt(vColl.x * vColl.x + vColl.y * vColl.y);
        const vNColl = {x: vColl.x / d, y: vColl.y / d};

        const vRelVel = {x: ballOne.vx - ballTwo.vx, y: ballOne.vy - ballTwo.vy};
        
        const dotProd = (vNColl.x * vRelVel.x + vNColl.y * vRelVel.y) * energyLoss;

        debugger;
        if (dotProd < 0) return;

        ballOne.vx -= vNColl.x * dotProd;
        ballOne.vy -= vNColl.y * dotProd;
        ballTwo.vx += vNColl.x * dotProd;
        ballTwo.vy += vNColl.y * dotProd;

        debugger
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

        const initVelocity = { x: 0, y: 0};
        const poolBalls = [];
        // initiate cue ball -- change initial x speed for testing
        poolBalls[0] = new PoolBall(positions[0], {x: 15, y: 0}, POOL_BALLS[0].number, POOL_BALLS[0].color, POOL_BALLS[0].marking);
        // initiate 8-ball
        poolBalls[5] = new PoolBall(positions[5], initVelocity, POOL_BALLS[8].number, POOL_BALLS[8].color, POOL_BALLS[8].marking);


        // initiate end corners - one striped and one solid
        const solidBalls = POOL_BALLS.slice(1, 8);
        const stripedBalls = POOL_BALLS.slice(9);
        const randSolid = Math.floor(Math.random() * solidBalls.length);
        const randStriped = Math.floor(Math.random() * stripedBalls.length);
        poolBalls[11] = new PoolBall(positions[11], initVelocity, solidBalls[randSolid].number, solidBalls[randSolid].color, solidBalls[randSolid].marking);
        poolBalls[15] = new PoolBall(positions[15], initVelocity, stripedBalls[randStriped].number, stripedBalls[randStriped].color, stripedBalls[randStriped].marking);
        
        solidBalls.splice(randSolid, 1);
        stripedBalls.splice(randStriped, 1);
        const tempBalls = solidBalls.concat(stripedBalls);

        positions.forEach((pos, idx) => {
            if (!poolBalls[idx]) {
                const randBall = Math.floor(Math.random() * tempBalls.length);
                const poolBall = new PoolBall(pos, initVelocity, tempBalls[randBall].number, tempBalls[randBall].color, tempBalls[randBall].marking);
                poolBalls[idx] = poolBall;
                tempBalls.splice(randBall, 1);
            }
        });

        return poolBalls;
    }

    restart() {
        // this.running = false;
        this.running = true;
        this.table = new PoolTable(this.dimensions);
        this.poolBalls = this.rackPoolBalls();
        this.animate();
    }

    play() {
        this.running = true;
        this.animate();
    }
}