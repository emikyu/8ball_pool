export const BALL_CONSTANTS = {
    RADIUS: 8.5,
    BORDER_COLOR: "gray"
};

export class PoolBall {
    constructor(position, number, color, marking) {
        this.vx = 0; 
        this.vy = 0;

        this.x = position.x;
        this.y = position.y;

        this.number = number;
        this.color = color;
        this.marking = marking;
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

            ctx.font = "bold 8px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(this.number, this.x, this.y * 1.007);
        }
    }

    animate(ctx) {
        this.drawBall(ctx);
    }
}