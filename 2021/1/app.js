"use strict";

const fs = require("fs");

const rows = fs.readFileSync("./input", "UTF-8").split("\n");

let part1Count = 0;
let part2Count = 0;

let prev = Number.MAX_SAFE_INTEGER;
let prevSliding = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < rows.length; i++) {
    const current = Number(rows[i]);

    // Part 1
    if (current > prev) {
        part1Count++;
    }
    prev = current;

    // Part 2
    if (i + 2 <= rows.length) {
        const currentSliding = current + Number(rows[i + 1]) + Number(rows[i + 2]);
        if (currentSliding > prevSliding) {
            part2Count++;
        }
        prevSliding = currentSliding;
    }
}

console.log(`Part 1: ${part1Count}, Part 2: ${part2Count}`);