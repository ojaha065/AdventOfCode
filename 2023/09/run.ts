/**
 * Day 9: Mirage Maintenance
 * https://adventofcode.com/2023/day/9
 */

console.time("Run time");

import fs from "fs";

const rows = fs.readFileSync("./09/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => row.split(/\s+/).map(number => parseInt(number)));

console.info("Part 1: " + solve(structuredClone(rows)));
console.info("Part 2: " + solve(structuredClone(rows), true));

console.timeEnd("Run time");

function solve(rows: number[][], part2 = false): number {
    let total = 0;
    for (const row of rows) {
        const sequences: number[][] = [row];
        while (sequences[sequences.length - 1].some(number => number !== 0)) { // Loop until all are zero
            const lastSequence = sequences[sequences.length - 1];
            const newSequence: number[] = [];
            for (let i = 0; i < lastSequence.length; i++) {
                if (lastSequence[i + 1] !== undefined) {
                    newSequence.push(lastSequence[i + 1] - lastSequence[i]);
                }
            }
            sequences.push(newSequence);
        }

        // For part two just reverse the sequences
        if (part2) {
            sequences.forEach(sequence => sequence.reverse());
        }

        // Add the first zero manually and loop the rest
        sequences[sequences.length - 1].push(0);
        for (let i = sequences.length - 2; i >= 0; i--) {
            sequences[i].push(part2
                ? sequences[i][sequences[i].length - 1] - sequences[i + 1][sequences[i + 1].length - 1]
                : sequences[i][sequences[i].length - 1] + sequences[i + 1][sequences[i + 1].length - 1]
            );
        }
    
        total += sequences[0].reverse()[0];
    }

    return total;
}