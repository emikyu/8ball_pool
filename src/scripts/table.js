export const outerBorder = 32;
export const innerBorder = 16;
export const margin = 150;
export const bigRadius = 15;
export const smallRadius = 14;


export class PoolTable {
    constructor(dimensions) {
        this.dimensions = dimensions;
    }

    drawBackground(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);

        // takes into account the 150 outer border & half of the table border at 16
        // table is 655 x 375
        const topLeft = [margin + outerBorder / 2, margin + outerBorder / 2];
        const bottomRight = [this.dimensions.width - margin - outerBorder/2, this.dimensions.height - margin - outerBorder/2];
        const widthHeight = [this.dimensions.width - margin * 2 - outerBorder, this.dimensions.height - margin * 2 - outerBorder];
        ctx.rect(...topLeft, ...widthHeight);

        // table and outer border
        const grad = ctx.createRadialGradient(this.dimensions.width / 2, this.dimensions.height / 2, 5, this.dimensions.width / 2, this.dimensions.height / 2, 300);
        grad.addColorStop(0, "lightgreen");
        grad.addColorStop(1, "green");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = outerBorder; // borders are drawn at the outline of the fill area 48 - 32 brown, 16 green trapezoids
        ctx.strokeStyle = "rgb(203, 113, 33)";
        ctx.strokeRect(...topLeft, ...widthHeight);

        // inner borders
        if (!this.innerBorders) this.innerBorders = [
            [[margin + outerBorder, margin + outerBorder + 1.4 * bigRadius], 
                [margin + outerBorder, this.dimensions.height - margin - outerBorder - 1.4 * bigRadius],
                [margin + outerBorder + innerBorder, this.dimensions.height - margin - outerBorder - innerBorder - 1.4 * bigRadius],
                [margin + outerBorder + innerBorder, margin + outerBorder + 1.4 * bigRadius + innerBorder]],
            [[this.dimensions.width - margin - outerBorder, margin + outerBorder + 1.4 * bigRadius],
                [this.dimensions.width - margin - outerBorder, this.dimensions.height - margin - outerBorder - 1.4 * bigRadius],
                [this.dimensions.width - margin - outerBorder - innerBorder, this.dimensions.height - margin - outerBorder - innerBorder - 1.4 * bigRadius],
                [this.dimensions.width - margin - outerBorder - innerBorder, margin + outerBorder + 1.4 * bigRadius + innerBorder]],
            [[margin + outerBorder + 1.4 * bigRadius, margin + outerBorder],
                [0.5 * this.dimensions.width - smallRadius, margin + outerBorder],
                [0.5 * this.dimensions.width - smallRadius - innerBorder, margin + outerBorder + innerBorder],
                [margin + outerBorder + 1.4 * bigRadius + innerBorder, margin + outerBorder + innerBorder]],
            [[this.dimensions.width - margin - outerBorder - 1.4 * bigRadius, margin + outerBorder],
                [0.5 * this.dimensions.width + smallRadius, margin + outerBorder],
                [0.5 * this.dimensions.width + smallRadius + innerBorder, margin + outerBorder + innerBorder],
                [this.dimensions.width - margin - outerBorder - 1.4 * bigRadius - innerBorder, margin + outerBorder + innerBorder]],
            [[margin + outerBorder + 1.4 * bigRadius, this.dimensions.height - margin - outerBorder],
                [0.5 * this.dimensions.width - smallRadius, this.dimensions.height - margin - outerBorder],
                [0.5 * this.dimensions.width - smallRadius - innerBorder, this.dimensions.height - margin - outerBorder - innerBorder],
                [margin + outerBorder + 1.4 * bigRadius + innerBorder, this.dimensions.height - margin - outerBorder - innerBorder]],
            [[this.dimensions.width - margin - outerBorder - 1.4 * bigRadius, this.dimensions.height - margin - outerBorder],
                [0.5 * this.dimensions.width + smallRadius, this.dimensions.height - margin - outerBorder],
                [0.5 * this.dimensions.width + smallRadius + innerBorder, this.dimensions.height - margin - outerBorder - innerBorder],
                [this.dimensions.width - margin - outerBorder - 1.4 * bigRadius - innerBorder, this.dimensions.height - margin - outerBorder - innerBorder]],
        ];

        this.innerBorders.forEach(innerBorder => {
            ctx.beginPath();
            ctx.moveTo(...innerBorder[0]);            
            ctx.lineTo(...innerBorder[1]);            
            ctx.lineTo(...innerBorder[2]);            
            ctx.lineTo(...innerBorder[3]);            
            ctx.closePath();
            ctx.fillStyle = "yellowgreen";
            ctx.fill();
        });

        // pockets
        const bigPockets = [
            [topLeft[0] + outerBorder * 0.75, topLeft[1] + outerBorder * 0.75, bigRadius],
            [topLeft[0] + outerBorder * 0.75, bottomRight[1] - outerBorder * 0.75, bigRadius],
            [bottomRight[0] - outerBorder * 0.75, topLeft[1] + outerBorder * 0.75, bigRadius],
            [bottomRight[0] - outerBorder * 0.75, bottomRight[1] - outerBorder * 0.75, bigRadius]
        ];

        
        ctx.fillStyle = "black";
        bigPockets.forEach(center => {
            ctx.beginPath();
            ctx.arc(...center, 0, 2 * Math.PI);
            ctx.fill();
        });

        const smallPockets = [
            [(topLeft[0] + bottomRight[0]) / 2, topLeft[1] + outerBorder * 0.65 - smallRadius * 0.3, smallRadius],
            [(topLeft[0] + bottomRight[0]) / 2, bottomRight[1] - outerBorder * 0.65 + smallRadius * 0.3, smallRadius],
        ];

        smallPockets.forEach(center => {
            ctx.beginPath();
            ctx.arc(...center, 0, 2 * Math.PI);
            ctx.fill();
        });

        if (!this.pocketCenters) this.pocketCenters = bigPockets.concat(smallPockets);
    }

    animate(ctx) {
        this.drawBackground(ctx);
    }
}