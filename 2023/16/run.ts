/**
 * Day 16: The Floor Will Be Lava
 * https://adventofcode.com/2023/day/16
 */

console.time("Run time");

import fs from "fs";

enum DIRECTION {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
};

const grid: string[][] = fs.readFileSync("./16/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => row.split(""));

console.info("Part 1: " + solve([[-1, 0, DIRECTION.RIGHT]]));

// Part 2
let highestConfiguration = 0;

// Top and bottom rows
for (let x = 0; x < grid[0].length; x++) {
    const resultTop = solve([[x, -1, DIRECTION.DOWN]]);
    if (resultTop > highestConfiguration) {
        highestConfiguration = resultTop;
    }

    const resultBottom = solve([[x, grid.length, DIRECTION.UP]]);
    if (resultBottom > highestConfiguration) {
        highestConfiguration = resultBottom;
    }
}

// Right and left columns
for (let y = 0; y < grid.length; y++) {
    const resultRight = solve([[-1, y, DIRECTION.RIGHT]]);
    if (resultRight > highestConfiguration) {
        highestConfiguration = resultRight;
    }

    const resultLeft = solve([[grid[y].length, y, DIRECTION.LEFT]]);
    if (resultLeft > highestConfiguration) {
        highestConfiguration = resultLeft;
    }
}

console.info("Part 2: " + highestConfiguration);

console.timeEnd("Run time");

/**
 * @param beams [x, y, direction]
 */
function solve(beams: number[][]): number {
    const visited: Set<string> = new Set();
    const energized: Set<string> = new Set();

    while (beams.length) {
        for (let i = beams.length - 1; i >= 0; i--) {
            const beam = beams[i];

            // Move
            switch (beam[2]) {
                case DIRECTION.UP: beam[1]--; break;
                case DIRECTION.RIGHT: beam[0]++; break;
                case DIRECTION.DOWN: beam[1]++; break;
                case DIRECTION.LEFT: beam[0]--; break;
                default: throw new Error(`Invalid direction ${beam[2]}`);
            }

            // Outside grid => destroy
            // Already visited in this direction => destroy
            if (beam[0] < 0 || beam[0] >= grid[0].length || beam[1] < 0 || beam[1] >= grid.length || visited.has(beam.join(","))) {
                beams.splice(i, 1);
                continue;
            }

            visited.add(beam.join(","));
            energized.add([beam[0], beam[1]].join(","));

            // Switch direction and split
            switch (grid[beam[1]][beam[0]][0]) {
                case ".": break;
                case "/":
                    switch (beam[2]) {
                        case DIRECTION.UP: beam[2] = DIRECTION.RIGHT; break;
                        case DIRECTION.RIGHT: beam[2] = DIRECTION.UP; break;
                        case DIRECTION.DOWN: beam[2] = DIRECTION.LEFT; break;
                        case DIRECTION.LEFT: beam[2] = DIRECTION.DOWN; break;
                    }
                    break;
                case "\\":
                    switch (beam[2]) {
                        case DIRECTION.UP: beam[2] = DIRECTION.LEFT; break;
                        case DIRECTION.RIGHT: beam[2] = DIRECTION.DOWN; break;
                        case DIRECTION.DOWN: beam[2] = DIRECTION.RIGHT; break;
                        case DIRECTION.LEFT: beam[2] = DIRECTION.UP; break;
                    }
                    break;
                case "|":
                    switch (beam[2]) {
                        case DIRECTION.RIGHT:
                        case DIRECTION.LEFT:
                            beam[2] = DIRECTION.UP;
                            beams.push([beam[0], beam[1], DIRECTION.DOWN]);
                    }
                    break;
                case "-":
                    switch (beam[2]) {
                        case DIRECTION.UP:
                        case DIRECTION.DOWN:
                            beam[2] = DIRECTION.LEFT;
                            beams.push([beam[0], beam[1], DIRECTION.RIGHT]);
                    }
                    break;
                default: throw new Error(`Invalid character ${grid[beam[1]][beam[0]][0]}`);
            }
        }
    }

    return energized.size;
}