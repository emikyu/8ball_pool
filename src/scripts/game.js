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

const FRAMES = 50;

// const energyLoss = 0.9;

export default class EightBallPool {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.dimensions = { width: canvas.width, height: canvas.height };


        this.innerTopLeft = [margin + outerBorder + innerBorder / 2, margin + outerBorder + innerBorder / 2];
        this.innerBottomRight = [this.dimensions.width - margin - outerBorder - innerBorder / 2, this.dimensions.height - margin - outerBorder - innerBorder / 2];
        this.innerWidthHeight = [this.dimensions.width - margin * 2 - outerBorder * 2 - innerBorder, this.dimensions.height - margin * 2 - outerBorder * 2 - innerBorder];

        this.pocketedBalls = {striped: [], solid: []};
        this.currentPocketed = [];

        this.playerOne = { id: 1, marking: null };
        this.playerTwo = { id: 2, marking: null };
        this.currentPlayer = this.playerOne;

        this.gameStatus = null;
        this.newGame = true;

        this.scratched = null;

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
    } 

    animate() {
        this.table.animate(this.ctx);

        for (let i = 0; i < FRAMES; i ++) {

            this.poolBalls.forEach(poolBall => {
                poolBall.move(this.ctx);
            });
            this.checkCollisions();
            this.checkPocketsAndBoundary();
        }


        this.poolBalls.forEach(poolBall => {
            poolBall.animate(this.ctx);
        });

        // console.log(this.poolBalls.map(poolBall => [poolBall.number, poolBall.vx, poolBall.vy]));

        if (this.poolBalls.every(poolBall => poolBall.vx === 0 && poolBall.vy === 0)) {
            this.running = false;
            if (this.newGame) {
                this.gameStatus = `New game! Player ${this.currentPlayer.id}'s Turn`;
                this.newGame = false;
                this.takeTurn();
            }
            else if(!this.newGame && this.checkContinueGame()) { this.takeTurn(); }
        } else {
            this.gameStatus = "Pending...";
        }
        
        this.drawGameStatus();
        if (this.running) requestAnimationFrame(this.animate.bind(this));

    }

    checkContinueGame() {
        // player that just moved
        let eightBall = false;
        let cueBall = null;
        let hitCount = 0;
        this.currentPocketed.forEach(poolBall => {
            if (poolBall.number === 8) {
                eightBall = true; // if pocketed eightball
            }
            else if (poolBall.number) {
                this.pocketedBalls[poolBall.marking].push(poolBall);
                if (poolBall.marking === this.currentPlayer.marking) hitCount++;
            } else {
                cueBall = poolBall; // if pocketed cueBall
                const y0 = this.innerTopLeft[1] + 0.50 * this.innerWidthHeight[1];

                const position = { x: this.innerTopLeft[0] + 0.25 * this.innerWidthHeight[0], y: y0 };
                cueBall.x = position.x;
                cueBall.y = position.y;
                cueBall.vx = 0;
                cueBall.vy = 0;
            }
        });

        if (eightBall && this.currentPlayer.marking) {
            if (this.pocketedBalls[this.currentPlayer.marking].length === 7 && !cueBall) {
                this.gameStatus = `Eight ball was pocketed. Player ${this.currentPlayer.id} won!`;
            }
            else {
                this.gameStatus = `Eight ball was pocketed. Player ${this.currentPlayer.id} lost!`;
            }
            return false;
        } else if (eightBall) {
            this.gameStatus = `Eight ball was pocketed. Player ${this.currentPlayer.id} lost!`;
            return false;
        } else if (cueBall) {
            this.poolBalls = [cueBall].concat(this.poolBalls); // always have cueBall first
            this.currentPlayer = this.currentPlayer.id === 1 ? this.playerTwo : this.playerOne;
            this.gameStatus = `Scratch. Player ${this.currentPlayer.id}'s Turn`;
        } else if (this.currentPocketed.length === 0 || this.scratched) {
            if (this.scratched) this.scratched = null;
            this.currentPlayer = this.currentPlayer.id === 1 ? this.playerTwo : this.playerOne;
            this.gameStatus = `Scratch. Player ${this.currentPlayer.id}'s Turn`;
        } else if (!this.currentPlayer.marking) {
            this.currentPlayer.marking = this.currentPocketed[0].marking;
            const otherPlayer = this.currentPlayer.id === 1 ? this.playerTwo : this.playerOne;
            otherPlayer.marking = this.currentPlayer.marking === "striped" ? "solid" : "striped";
            this.gameStatus = `Player ${this.currentPlayer.id}'s Turn`;
        } else if (hitCount) {
            this.gameStatus = `Player ${this.currentPlayer.id}'s Turn`;
        } else {
            this.currentPlayer = this.currentPlayer.id === 1 ? this.playerTwo : this.playerOne;
            this.gameStatus = `Scratch. Player ${this.currentPlayer.id}'s Turn`;
        }

        this.currentPocketed = [];
        return true;
    };

    handleClick(e) {
        const cRect = this.canvas.getBoundingClientRect();
        const x = e.clientX - cRect.left * (this.canvas.width / cRect.width);
        const y = e.clientY - cRect.top * (this.canvas.height / cRect.height);
        // debugger
        let vx = (this.poolBalls[0].x - x) / (2 * margin);
        let vy = (this.poolBalls[0].y - y) / (2 * margin);
        const v = Math.sqrt(vx * vx + vy * vy);
        if (v > BALL_CONSTANTS.RADIUS / FRAMES) {
            vx = vx / v * BALL_CONSTANTS.RADIUS / FRAMES * 0.8;
            vy = vy / v * BALL_CONSTANTS.RADIUS / FRAMES * 0.8;
        }
        this.poolBalls[0].vx = vx;
        this.poolBalls[0].vy = vy;

        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);

        if (!this.running) this.play();
    };

    handleMouseMove(e) {
        // debugger
        this.table.animate(this.ctx);
        this.poolBalls.forEach(poolBall => {
            poolBall.animate(this.ctx);
        });
        this.drawGameStatus();

        const cRect = this.canvas.getBoundingClientRect();
        const x = e.clientX - cRect.left * (this.canvas.width / cRect.width);
        const y = e.clientY - cRect.top * (this.canvas.height / cRect.height);
        // debugger
        this.ctx.beginPath();
        this.ctx.moveTo(this.poolBalls[0].x, this.poolBalls[0].y);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = "maroon";
        this.ctx.stroke();
        this.poolBalls[0].animate(this.ctx);

        this.canvas.addEventListener('click', this.handleClick);
    };


    takeTurn() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
    }

    drawGameStatus() {
        // draw game status

        this.ctx.font = "bold 36px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "rgb(64,64,64)";
        this.ctx.fillText(this.gameStatus, this.dimensions.width / 2, margin * 0.9);

        const padding = 5;
        const r = BALL_CONSTANTS.RADIUS;

        this.ctx.font = "18px sans-serif";
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "rgb(64,64,64)";
        this.ctx.fillText(`Player 1's Pocketed Balls${this.playerOne.marking ? ` (${this.playerOne.marking})` : ""}`, margin, this.dimensions.height - margin * 0.75);
        this.ctx.fillStyle = "thistle";
        this.ctx.fillRect(margin, this.dimensions.height - 0.7 * margin, (this.dimensions.width - 2 * margin) * 0.45, 0.25 * margin);
        if (this.playerOne.marking) this.pocketedBalls[this.playerOne.marking].forEach((poolBall, idx) => {
            poolBall.x = margin + (idx + 1) * padding + (idx * 2 + 1) * r;
            poolBall.y = this.dimensions.height - 0.7 * margin + (0.25 * margin) / 2;
            poolBall.vx = 0;
            poolBall.vy = 0;
            poolBall.drawBall(this.ctx);
        });


        this.ctx.font = "18px sans-serif";
        this.ctx.textAlign = "right";
        this.ctx.fillStyle = "rgb(64,64,64)";
        this.ctx.fillText(`Player 2's Pocketed Balls${this.playerTwo.marking ? ` (${this.playerTwo.marking})` : ""}`, this.dimensions.width - margin, this.dimensions.height - margin * 0.75);
        this.ctx.fillStyle = "thistle";
        this.ctx.fillRect(this.dimensions.width - margin - (this.dimensions.width - 2 * margin) * 0.45, this.dimensions.height - 0.7 * margin, (this.dimensions.width - 2 * margin) * 0.45, 0.25 * margin);
        if (this.playerTwo.marking) this.pocketedBalls[this.playerTwo.marking].forEach((poolBall, idx) => {
            poolBall.x = this.dimensions.width - (margin + (idx + 1) * padding + (idx * 2 + 1) * r);
            poolBall.y = this.dimensions.height - 0.7 * margin + (0.25 * margin) / 2;
            poolBall.vx = 0;
            poolBall.vy = 0;
            poolBall.drawBall(this.ctx);
        });
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
                    
                    // check if scratched
                    if (i === 0 && this.currentPlayer.marking && this.scratched === null) {
                        if (this.poolBalls[j].marking != this.currentPlayer.marking) {
                            this.scratched = true;
                        } else if (this.poolBalls[j].number === "8" && this.pocketedBalls[this.currentPlayer.marking].length < 7) {
                            this.scratched = true;
                        }
                        else {
                            this.scratched = false;
                        }
                    }

                    this.updateSpeed(this.poolBalls[i], this.poolBalls[j]);
                }
            } 
        }
    }

    // check for pocketing balls & collisions with pool table sides
    checkPocketsAndBoundary() {
        this.poolBalls.forEach((poolBall, idx) => {
            const isNearPocket = this.isNearPocket(poolBall);
            const r = BALL_CONSTANTS.RADIUS;

            if (this.isPocketed(poolBall)) {
                this.currentPocketed.push(poolBall);
                this.poolBalls[idx] = null;
            } else if (isNearPocket) {
                isNearPocket.forEach(side => {
                    switch(side.dir) {
                        case "bottomLeft":
                            // debugger
                            if (Math.abs((poolBall.y + r / Math.sqrt(2)) + side.slope * (poolBall.x - r / Math.sqrt(2)) - side.intercept) < 1) {
                                [poolBall.vx, poolBall.vy] = [poolBall.vy, poolBall.vx];
                            }
                            break;
                        case "bottomRight":
                            // debugger
                            if (Math.abs((poolBall.y + r / Math.sqrt(2)) + side.slope * (poolBall.x + r / Math.sqrt(2)) - side.intercept) < 1) {
                                [poolBall.vx, poolBall.vy] = [-poolBall.vy, -poolBall.vx];
                            }
                            break;
                        case "topLeft":
                            // debugger
                            if (Math.abs((poolBall.y - r / Math.sqrt(2)) + side.slope * (poolBall.x - r / Math.sqrt(2)) - side.intercept) < 1) {
                                [poolBall.vx, poolBall.vy] = [-poolBall.vy, -poolBall.vx];
                            }
                            break;
                        case "topRight":
                            // debugger
                            if (Math.abs((poolBall.y - r / Math.sqrt(2)) + side.slope * (poolBall.x + r / Math.sqrt(2)) - side.intercept) < 1) {
                                [poolBall.vx, poolBall.vy] = [poolBall.vy, poolBall.vx];
                            }
                            break;
                        default: break;
                    }
                });
            }
            else {
                debugger
                if (poolBall.x - BALL_CONSTANTS.RADIUS - 0.5<= this.innerTopLeft[0] + innerBorder / 2 || poolBall.x + BALL_CONSTANTS.RADIUS + 0.5 >= this.innerBottomRight[0] - innerBorder / 2) {
                    poolBall.vx = -poolBall.vx;
                    // poolBall.vy *= energyLoss;
                }
                if (poolBall.y - BALL_CONSTANTS.RADIUS - 0.5<= this.innerTopLeft[1] + innerBorder / 2 || poolBall.y + BALL_CONSTANTS.RADIUS + 0.5 >= this.innerBottomRight[1] - innerBorder / 2) {
                    poolBall.vy = -poolBall.vy;
                    // poolBall.vx *= energyLoss;
                }
            }
        });
        this.poolBalls = this.poolBalls.filter(poolBall => poolBall);
    }

    isNearPocket(poolBall) {
        const left = this.innerTopLeft[0] + innerBorder / 2 + 1.4 * bigRadius;
        const top = this.innerTopLeft[1] + innerBorder / 2 + 1.4 * bigRadius;
        const right = this.innerBottomRight[0] - innerBorder / 2 - 1.4 * bigRadius;
        const bottom = this.innerBottomRight[1] - innerBorder / 2 - 1.4 * bigRadius;
        const midLeft = 0.5 * this.dimensions.width - smallRadius - innerBorder;
        const midRight = 0.5 * this.dimensions.width + smallRadius + innerBorder;

        debugger
        // returns the slopes & intercepts to check - (y + x - c): slope = +1 OR (y - x - c): slope = -1; dir is which side of circle hits line
        if (poolBall.x < left && poolBall.y < top) return [{ slope: -1, intercept: 1.4 * bigRadius, dir: "bottomLeft"}, 
                                                            { slope: -1, intercept: -1.4 * bigRadius, dir: "topRight"}];
        if (poolBall.x < left && poolBall.y > bottom) return [{ slope: 1, intercept: this.dimensions.height - 1.4 * bigRadius, dir: "topLeft" },
                                                                { slope: 1, intercept: this.dimensions.height + 1.4 * bigRadius, dir: "bottomRight"}];
        if (poolBall.x > right && poolBall.y < top) return [{ slope: 1, intercept: this.dimensions.width - 1.4 * bigRadius, dir: "topLeft"},
                                                                { slope: 1, intercept: this.dimensions.width + 1.4 * bigRadius, dir: "bottomRight"}];
        if (poolBall.x > right && poolBall.y > bottom) return [{ slope: -1, intercept: this.dimensions.height - this.dimensions.width - 1.4 * bigRadius, dir: "topRight"},
                                                                { slope: -1, intercept: this.dimensions.height - this.dimensions.width + 1.4 * bigRadius, dir: "bottomLeft"}];
        if (poolBall.y <= top + BALL_CONSTANTS.RADIUS && poolBall.x > midLeft && poolBall.x < midRight) return [{ slope: 1, intercept: 0.5 * this.dimensions.width - smallRadius + margin + outerBorder, dir: "topLeft"}, // START HERE ON THURSDAY
                                                                                            { slope: -1, intercept: margin + outerBorder - (0.5 * this.dimensions.width + smallRadius), dir: "topRight"}];
        if (poolBall.y >= bottom - BALL_CONSTANTS.RADIUS && poolBall.x > midLeft && poolBall.x < midRight) return [{ slope: -1, intercept: this.dimensions.height - margin - outerBorder - (0.5 * this.dimensions.width - smallRadius), dir: "bottomLeft"},
                                                                                            { slope: 1, intercept: 0.5 * this.dimensions.width + smallRadius + this.dimensions.height - margin - outerBorder, dir: "bottomRight"}];

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
        const vColl = {x: ballTwo.x - ballOne.x, y: ballTwo.y - ballOne.y};
        const d = Math.sqrt(vColl.x * vColl.x + vColl.y * vColl.y);
        const vNColl = {x: vColl.x / d, y: vColl.y / d};
        
        const vRelVel = {x: ballOne.vx - ballTwo.vx, y: ballOne.vy - ballTwo.vy};
        
        const dotProd = vNColl.x * vRelVel.x + vNColl.y * vRelVel.y;
        
        if (dotProd < 0) return;
        // console.log(ballOne.vy + ballTwo.vy);

        ballOne.vx -= vNColl.x * dotProd;
        ballOne.vy -= vNColl.y * dotProd;
        ballTwo.vx += vNColl.x * dotProd;
        ballTwo.vy += vNColl.y * dotProd;
        // console.log(ballOne.vy + ballTwo.vy);
        // console.log("--");
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
        poolBalls[0] = new PoolBall(positions[0], {x: 0 / FRAMES, y: 0 / FRAMES}, POOL_BALLS[0].number, POOL_BALLS[0].color, POOL_BALLS[0].marking);
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
        this.running = false;
        this.table = new PoolTable(this.dimensions);
        this.poolBalls = this.rackPoolBalls();


        this.pocketedBalls = { striped: [], solid: [] };
        this.currentPocketed = [];

        this.playerOne = { id: 1, marking: null };
        this.playerTwo = { id: 2, marking: null };
        this.currentPlayer = this.playerOne;

        this.gameStatus = null;
        this.newGame = true;

        this.scratched = null;

        this.animate();
    }

    play() {
        this.running = true;
        this.animate();
    }

    
}