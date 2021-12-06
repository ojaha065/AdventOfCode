"use strict";

const fs = require("fs");

console.log(`Part 1: ${solve("./input", 80)}, Part 2: ${solve("./input", 256)}`);

function solve(filepath, generations) {
    const simulation = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split(",")
        .map(s => parseInt(s))
        .reduce((arr, int) => {
            arr[int]++;
            return arr;
        }, new Array(9).fill(0));

    for (let loop = 0; loop < generations; loop++) {
        const zeros = simulation.shift(); // "each other number decreases by 1 if it was present at the start of the day"
        simulation[6] += zeros; // "a 0 becomes a 6..."
        simulation.push(zeros); // "...and adds a new 8 to the end of the list"
    }

    return simulation.reduce((a, b) => a + b);
}