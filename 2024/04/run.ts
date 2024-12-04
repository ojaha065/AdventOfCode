/**
 * Day 4: Ceres Search
 * https://adventofcode.com/2024/day/4
 */

console.time("Run time");

import fs from "fs";

const grid: string[][] = fs.readFileSync("./04/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.split(""));

let part1Result = 0;
let part2Result = 0;
for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
        if (grid[x][y] === "X") {
            // horizontal
            if (isXMAS(() => [grid[x + 1][y], grid[x + 2][y], grid[x + 3][y]])) { part1Result++; }
            if (isXMAS(() => [grid[x - 1][y], grid[x - 2][y], grid[x - 3][y]])) { part1Result++; }

            // vertical
            if (isXMAS(() => [grid[x][y + 1], grid[x][y + 2], grid[x][y + 3]])) { part1Result++; }
            if (isXMAS(() => [grid[x][y - 1], grid[x][y - 2], grid[x][y - 3]])) { part1Result++; }

            // diagonal
            if (isXMAS(() => [grid[x + 1][y + 1], grid[x + 2][y + 2], grid[x + 3][y + 3]])) { part1Result++; }
            if (isXMAS(() => [grid[x - 1][y - 1], grid[x - 2][y - 2], grid[x - 3][y - 3]])) { part1Result++; }
            if (isXMAS(() => [grid[x + 1][y - 1], grid[x + 2][y - 2], grid[x + 3][y - 3]])) { part1Result++; }
            if (isXMAS(() => [grid[x - 1][y + 1], grid[x - 2][y + 2], grid[x - 3][y + 3]])) { part1Result++; }
        }
        else if (grid[x][y] === "A" && isMAS(() => [grid[x - 1][y - 1], grid[x + 1][y - 1], grid[x - 1][y + 1], grid[x + 1][y + 1]])) {
            part2Result++;
        }
    }
}
console.info("Part 1: " + part1Result);
console.info("Part 2: " + part2Result);
console.timeEnd("Run time");

function isXMAS(provider: () => string[]): boolean {
    let values: string[];
    try {
        values = provider.call(null);
    } catch { return false; }

    if (!values.every(Boolean)) {
        return false;
    }

    const word = values.join("");
    return word === "MAS";
}

function isMAS(provider: () => string[]): boolean {
    let values: string[];
    try {
        values = provider.call(null);
    } catch { return false; }

    if (!values.every(Boolean)) {
        return false;
    }

    const word = values.join("");
    return ["MMSS", "SSMM", "SMSM", "MSMS"].some(pattern => pattern === word);
}