"use strict";

const targetArea = "target area: x=20..30, y=-10..-5"
    .split("target area:")[1]
    .trim()
    .split(",")
    .map(coord => coord.split("=")[1].trim())
    .map(coord => coord.split("..").map(s => parseInt(s)));
console.debug(targetArea);

const workingHighYValues = [];
const workingStartVelocityValues = [];
for (let startVelocityX = -1000; startVelocityX < 1000; startVelocityX++) {
    for (let startVelocityY = -1000; startVelocityY < 1000; startVelocityY++) {
        let probeX = 0;
        let probeY = 0;
        let velocityX = startVelocityX;
        let velocityY = startVelocityY;

        let highestY = Number.MIN_SAFE_INTEGER;

        for (let loop = 0; loop < 1000; loop++) {
            probeX += velocityX;
            probeY += velocityY;

            if (velocityX < 0) {velocityX++}
            if (velocityX > 0) {velocityX--}

            velocityY--;

            if (probeY > highestY) {
                highestY = probeY;
            }

            if (probeX >= targetArea[0][0] && probeX <= targetArea[0][1] && probeY >= targetArea[1][0] && probeY <= targetArea[1][1]) {
                workingHighYValues.push(highestY);
                workingStartVelocityValues.push(`${startVelocityX},${startVelocityY}`);
            }
        }
    }
}

// What is the highest y position it reaches on this trajectory?
console.log(`Part 1: ${workingHighYValues.sort((a, b) => b - a)[0]}`);

// How many distinct initial velocity values cause the probe to be within the target area after any step?
console.log(`Part 2: ${workingStartVelocityValues.filter((v, i, a) => a.indexOf(v) === i).length}`);