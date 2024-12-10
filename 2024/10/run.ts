/**
 * Day 10: Hoof It
 * https://adventofcode.com/2024/day/10
 */

console.time("Run time");

import fs from "fs";

type xy = {x: number, y: number};
type result = {score: number, rating: number};

const grid: number[][] = fs.readFileSync("./10/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .filter(Boolean)
    .map(row => row.split(""))
    .map(row => row.map(s => parseInt(s)));

let totalScore = 0;
let totalRating = 0;
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 0) {
            const result = walk({x, y});
            totalScore += result.score;
            totalRating += result.rating;
        }
    }
}

console.info("Part 1: " + totalScore);
console.info("Part 2: " + totalRating);
console.timeEnd("Run time");

function walk(position: xy, result: result = {score: 0, rating: 0}, scoreSet: Set<string> = new Set()): result {
    const value = grid[position.y][position.x];

    if (value >= 9) {
        result.rating++;
        scoreSet.add(`${position.x},${position.y}`);
        return result;
    }

    const next = [
        [position.x, position.y - 1], // up
        [position.x, position.y + 1], // down
        [position.x - 1, position.y], // left
        [position.x + 1, position.y] // right
    ];
    for (const [x, y] of next) {
        if (
            y >= 0 && y < grid.length
            && x >= 0 && x < grid[y].length
            && grid[y][x] === value + 1
        ) {
            walk({x, y}, result, scoreSet);
        }
    }

    result.score = scoreSet.size;
    return result;
}