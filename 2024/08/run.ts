/**
 * Day 8: Resonant Collinearity
 * https://adventofcode.com/2024/day/8
 */

console.time("Run time");

import fs from "fs";

const grid: string[][] = fs.readFileSync("./08/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.trim())
    .filter(row => row.length)
    .map(row => row.split(""));

const antennas: {x: number, y: number, frequency: string}[] = [];
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] !== ".") {
            antennas.push({x, y, frequency: grid[y][x]});
        }
    }
}

const antinodes: Set<string> = new Set();

// Part 1
for (const antenna1 of antennas) {
    for (const antenna2 of antennas) {
        if (antenna1.frequency !== antenna2.frequency) {
            continue;
        }

        if (antenna1.x === antenna2.x && antenna1.y === antenna2.y) {
            // Same antenna => skip
            continue;
        }

        // Direction vector
        const dx = antenna2.x - antenna1.x;
        const dy = antenna2.y - antenna1.y;

        const x1 = antenna1.x - dx;
        const y1 = antenna1.y - dy;
        const x2 = antenna2.x + dx;
        const y2 = antenna2.y + dy;

        if (x1 >= 0 && y1 >= 0 && x1 < grid[0].length && y1 < grid.length) {
            antinodes.add(`${x1},${y1}`);
        }
        if (x2 >= 0 && y2 >= 0 && x2 < grid[0].length && y2 < grid.length) {
            antinodes.add(`${x2},${y2}`);
        }
    }
}
console.info("Part 1: " + antinodes.size);

// Part 2
for (const antenna1 of antennas) {
    for (const antenna2 of antennas) {
        if (antenna1.frequency !== antenna2.frequency) {
            continue;
        }

        if (antenna1.x === antenna2.x && antenna1.y === antenna2.y) {
            // Same antenna => skip
            continue;
        }

        // Find all collinear points
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if ((x - antenna1.x) * (antenna2.y - antenna1.y) === (y - antenna1.y) * (antenna2.x - antenna1.x)) {
                    antinodes.add(`${x},${y}`);
                }
            }
        }
    }
}
console.info("Part 2: " + antinodes.size);
console.timeEnd("Run time");