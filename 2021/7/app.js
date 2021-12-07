"use strict";

const fs = require("fs");

console.log(solve("./input"));

function solve(filepath) {
    const numbers = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split(",")
        .map(s => parseInt(s));

    let lowestPart1Fuel = Number.MAX_SAFE_INTEGER;
    let lowestPart2Fuel = Number.MAX_SAFE_INTEGER;

    for (let x = Math.min(...numbers); x < Math.max(...numbers); x++) { // x = position to try
        let part1Fuel = 0;
        let part2Fuel = 0;

        for (const number of numbers) {
            if (number !== x) {
                part1Fuel += Math.abs(number - x);

                let currentX = Math.min(number, x);
                let targetX = Math.max(number, x);
                let cost = 0;
                while (currentX !== targetX) {
                    currentX++;
                    part2Fuel += ++cost;
                }
            }
        }

        if (part1Fuel < lowestPart1Fuel) { lowestPart1Fuel = part1Fuel; }
        if (part2Fuel < lowestPart2Fuel) { lowestPart2Fuel = part2Fuel; }
    }

    return `Part 1: ${lowestPart1Fuel}, Part 2: ${lowestPart2Fuel}`;
}