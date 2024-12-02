/**
 * Day 2: Red-Nosed Reports
 * https://adventofcode.com/2024/day/2
 */

console.time("Run time");

import fs from "fs";

const grid: number[][] = fs.readFileSync("./02/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.split(/\s+/))
    .map(row => row.map(s => parseInt(s)));

console.info("Part 1: " + grid.filter(isSafe).length);

let part2Count = 0;
for (const row of grid) {
    if (isSafe(row)) {
        part2Count++;
        continue;
    }

    for (let i = 0; i < row.length; i++) {
        const copy = [...row];
        copy.splice(i, 1);
        if (isSafe(copy)) {
            part2Count++;
            break;
        }
    }
}
console.info("Part 2: " + part2Count);

function isSafe(row: number[]): boolean {
    let current = row[0];
    let direction: 1 | -1 | null = null;

    for (let i = 1; i < row.length; i++) {
        const difference = current - row[i];

        const absoluteDifference = Math.abs(difference);
        if (
            absoluteDifference < 1
            || absoluteDifference > 3
            || (direction === 1 && difference < 0)
            || (direction === -1 && difference > 0)
        ) { return false; }

        if (direction === null) {
            if (difference > 0) { direction = 1; }
            else { direction = -1; }
        }

        current = row[i];
    }

    return true;
}

console.timeEnd("Run time");