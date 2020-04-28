export default class PoolTable {
    constructor(dimensions) {
        this.dimensions = dimensions;
    }

    drawBackground(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);

        // takes into account the 150 outer border & half of the table border at 16
        // table is 655 x 375
        const outerBorder = 32;
        const margin = 150;
        const topLeft = [margin + outerBorder / 2, margin + outerBorder / 2];
        const bottomRight = [this.dimensions.width - margin - outerBorder/2, this.dimensions.height - margin - outerBorder/2];
        const widthHeight = [this.dimensions.width - margin * 2 - outerBorder, this.dimensions.height - margin * 2 - outerBorder];
        ctx.rect(...topLeft, ...widthHeight);

        const grad = ctx.createRadialGradient(this.dimensions.width / 2, this.dimensions.height / 2, 5, this.dimensions.width / 2, this.dimensions.height / 2, 300);
        grad.addColorStop(0, "lightgreen");
        grad.addColorStop(1, "green");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = outerBorder; // borders are drawn at the outline of the fill area 48 - 32 brown, 16 green trapezoids
        ctx.strokeStyle = "rgb(203, 113, 33)";
        ctx.stroke();

        // pockets
        const bigRadius = 15;
        const bigPockets = [
            [topLeft[0] + outerBorder / 2, topLeft[1] + outerBorder / 2],
            [topLeft[0] + outerBorder / 2, bottomRight[1] - outerBorder / 2],
            [bottomRight[0] - outerBorder / 2, topLeft[1] + outerBorder / 2],
            [bottomRight[0] - outerBorder / 2, bottomRight[1] - outerBorder / 2]
        ];

        
        ctx.fillStyle = "black";
        bigPockets.forEach(center => {
            ctx.beginPath();
            ctx.arc(...center, bigRadius, 0, 2 * Math.PI);
            ctx.fill();
        });

        const smallRadius = 14;
        const smallPockets = [
            [(topLeft[0] + bottomRight[0]) / 2, topLeft[1] + outerBorder / 2 - smallRadius * 0.3],
            [(topLeft[0] + bottomRight[0]) / 2, bottomRight[1] - outerBorder / 2 + smallRadius * 0.3],
        ];

        smallPockets.forEach(center => {
            ctx.beginPath();
            ctx.arc(...center, smallRadius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    animate(ctx) {
        this.drawBackground(ctx);
    }
}