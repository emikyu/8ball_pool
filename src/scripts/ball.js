export const BALL_CONSTANTS = {
    RADIUS: 8.5,
    BORDER_COLOR: "gray",
    FRICTION: 0.000005
};

export class PoolBall {
    constructor(position, velocity, number, color, marking) {
        this.vx = velocity.x; 
        // if (color === "white") {
        //     this.vx = 1; // for testing animation
        // }
        this.vy = velocity.y;

        this.x = position.x;
        this.y = position.y;

        this.number = number;
        this.color = color;
        this.marking = marking;

        this.colliding = false;
    }

    // checks if 'this' ball intersects 'that' ball given positions
    intersect(that) {
        const sqDist = (this.x - that.x) * (this.x - that.x) + (this.y - that.y) * (this.y - that.y);
        return sqDist <= 4 * (BALL_CONSTANTS.RADIUS) * (BALL_CONSTANTS.RADIUS);
    }

    drawBall(ctx) {
        if (this.marking === "solid" || !this.marking) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, BALL_CONSTANTS.RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = BALL_CONSTANTS.BORDER_COLOR;
            ctx.stroke();
        } else if (this.marking === "striped") {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.x, this.y, BALL_CONSTANTS.RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = BALL_CONSTANTS.BORDER_COLOR;
            ctx.stroke();

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, BALL_CONSTANTS.RADIUS, - Math.PI / 6, Math.PI / 6);
            ctx.lineTo(this.x - BALL_CONSTANTS.RADIUS * Math.sqrt(3) / 2, this.y - BALL_CONSTANTS.RADIUS / 2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, BALL_CONSTANTS.RADIUS, Math.PI - Math.PI / 6, Math.PI + Math.PI / 6);
            ctx.lineTo(this.x + BALL_CONSTANTS.RADIUS * Math.sqrt(3) / 2, this.y + BALL_CONSTANTS.RADIUS / 2);
            ctx.closePath();
            ctx.fill();
        }

        if (this.number) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.x, this.y, BALL_CONSTANTS.RADIUS * .6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = "bold 8px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(this.number, this.x, this.y + 2.5);
        }

        // // test code
        // if (this.colliding) {
        //     ctx.fillStyle = "pink";
        //     ctx.beginPath();
        //     ctx.arc(this.x, this.y, BALL_CONSTANTS.RADIUS, 0, 2 * Math.PI);
        //     ctx.fill();
        //     ctx.lineWidth = 0.5;
        //     ctx.strokeStyle = BALL_CONSTANTS.BORDER_COLOR;
        //     ctx.stroke();
        // }        
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // take into account friction from table
        const v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (v > 0.001) {
            const aNorm = {x: this.vx / v, y: this.vy / v};

            if (Math.abs(this.vx) > Math.abs(aNorm.x * BALL_CONSTANTS.FRICTION)) { 
                this.vx -= aNorm.x * BALL_CONSTANTS.FRICTION;
            } else {
                this.vx = 0;
            }
            if (Math.abs(this.vy) > Math.abs(aNorm.y * BALL_CONSTANTS.FRICTION)) { 
                this.vy -= aNorm.y * BALL_CONSTANTS.FRICTION;
            } else {
                this.vy = 0;
            }

        }
        else {
            this.vx = 0;
            this.vy = 0;
        }
    }

    animate(ctx) {
        // this.move();
        this.drawBall(ctx);
    }
}