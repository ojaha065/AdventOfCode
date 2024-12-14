/**
 * Day 14: Restroom Redoubt
 * https://adventofcode.com/2024/day/14
 */

console.time("Run time");

import fs from "fs";

type Coord = {x: number, y: number};
type Robot = {start: Coord, velocity: Coord};

const SIZE: Coord = {x: 101, y: 103};

const input: Robot[] = fs.readFileSync("./14/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => /p=(-?\d+),(-?\d+)\sv=(-?\d+),(-?\d+)/.exec(row))
    .filter(matcher => matcher != null)
    .map(matcher => {
        return {
            start: {x: parseInt(matcher[1]), y: parseInt(matcher[2])},
            velocity: {x: parseInt(matcher[3]), y: parseInt(matcher[4])}
        };
    });

console.info("Part 1: " + safetyFactor(input.map(robot => calculatePosition(robot, SIZE, 100)), SIZE));

// Part 2
// Turns out the Christmas tree is arranged the first time none of the robots are overlapping
for (let i = 101; true; i++) {
    const positions = input.map(robot => calculatePosition(robot, SIZE, i));
    if (positions.every((position, index, arr) => arr.findIndex(pos => pos.x === position.x && pos.y === position.y) === index)) {
        console.info("Part 2: " + i);
        break;
    }
}

function calculatePosition(robot: Robot, size: Coord, seconds: number): Coord {
    return {
        x: ((robot.start.x + robot.velocity.x * seconds) % size.x + size.x) % size.x,
        y: ((robot.start.y + robot.velocity.y * seconds) % size.y + size.y) % size.y
    };
}

function safetyFactor(positions: Coord[], size: Coord): number {
    const midX = Math.floor(size.x / 2);
    const midY = Math.floor(size.y / 2);

    let quadrant0 = 0; // Top-left
    let quadrant1 = 0; // Top-right
    let quadrant2 = 0; // Bottom-left
    let quadrant3 = 0; // Bottom-right

    for (const {x,y} of positions) {
        if (x === midX || y === midY) { continue; }

        if (x < midX && y < midY) { quadrant0++; }
        else if (x > midX && y < midY) { quadrant1++; }
        else if (x < midX && y > midY) { quadrant2++; }
        else if (x > midX && y > midY) { quadrant3++; }
    }

    return quadrant0 * quadrant1 * quadrant2 * quadrant3;
}

console.timeEnd("Run time");