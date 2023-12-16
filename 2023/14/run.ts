/**
 * Day 14: Parabolic Reflector Dish
 * https://adventofcode.com/2023/day/14
 */

console.time("Run time");

import fs from "fs";

const grid = fs.readFileSync("./14/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => row.split(""));

console.info("Part 1: " + calculateLoad(tiltNorth(structuredClone(grid))));

// Part 2
const cache: string[] = [];
for (let cycle = 0; true; cycle++) { // Loop until cycle is found
    const result = JSON.stringify(tiltEast(tiltSouth(tiltWest(tiltNorth(grid)))));
    if (cache.includes(result)) {
        // Cycle found
        const cycleLength = cache.findIndex(r => r === result) + 1;
        const last = ((1_000_000_000 - cycleLength) % (cycle + 1 - cycleLength)) + cycleLength;
        console.info("Part 2: " + calculateLoad(JSON.parse(cache[last - 1])));
        break;
    }

    cache.push(result);
}

console.timeEnd("Run time");

function tiltNorth(grid: string[][]): string[][] {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                for (let y2 = y; true; y2--) {
                    if (y2 - 1 < 0 || grid[y2 - 1][x] === "O" || grid[y2 - 1][x] === "#") {
                        grid[y][x] = ".";
                        grid[y2][x] = "O";
                        break;
                    }
                }
            }
        }
    }

    return grid;
}

function tiltSouth(grid: string[][]): string[][] {
    for (let y = grid.length - 1; y >= 0; y--) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                for (let y2 = y; true; y2++) {
                    if (y2 + 1 >= grid.length || grid[y2 + 1][x] === "O" || grid[y2 + 1][x] === "#") {
                        grid[y][x] = ".";
                        grid[y2][x] = "O";
                        break;
                    }
                }
            }
        }
    }

    return grid;
}

function tiltWest(grid: string[][]): string[][] {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                for (let x2 = x; true; x2--) {
                    if (x2 - 1 < 0 || grid[y][x2 - 1] === "O" || grid[y][x2 - 1] === "#") {
                        grid[y][x] = ".";
                        grid[y][x2] = "O";
                        break;
                    }
                }
            }
        }
    }

    return grid;
}

function tiltEast(grid: string[][]): string[][] {
    for (let y = 0; y < grid.length; y++) {
        for (let x = grid[y].length - 1; x >= 0; x--) {
            if (grid[y][x] === "O") {
                for (let x2 = x; true; x2++) {
                    if (x2 + 1 >= grid[y].length || grid[y][x2 + 1] === "O" || grid[y][x2 + 1] === "#") {
                        grid[y][x] = ".";
                        grid[y][x2] = "O";
                        break;
                    }
                }
            }
        }
    }

    return grid;
}

function calculateLoad(grid: string[][]): number {
    let result = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                result += grid.length - y;
            }
        }
    }

    return result;
}