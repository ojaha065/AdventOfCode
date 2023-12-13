/**
 * Day 13: Point of Incidence
 * https://adventofcode.com/2023/day/13
 */

console.time("Run time");

import fs from "fs";

const patterns = fs.readFileSync("./13/input.txt", "utf-8")
    .split(/[\r\n]{4}/)
    .map(pattern => pattern.split(/[\r\n]+/));

let part1 = 0;
let part2 = 0;
for (const pattern of patterns) {
    const originalSummary = getSummary(pattern);
    part1 += originalSummary;

    let otherSummaryFound = false;
    for (let y = 0; !otherSummaryFound && y < pattern.length; y++) {
        for (let x = 0; !otherSummaryFound && x < pattern[y].length; x++) {
            pattern[y] = pattern[y].substring(0, x) + (pattern[y][x] === "#" ? "." : "#") + pattern[y].substring(x + 1);
            const newSummary = getSummary(pattern, originalSummary);
            if (newSummary && newSummary !== originalSummary) {
                part2 += newSummary;
                otherSummaryFound = true;
                break;
            }
            pattern[y] = pattern[y].substring(0, x) + (pattern[y][x] === "#" ? "." : "#") + pattern[y].substring(x + 1);
        }
    }
}

console.info(`Part 1: ${part1}, Part 2: ${part2}`);
console.timeEnd("Run time");

/**
 * @param disallow Disregard if results equal to
 */
function getSummary(pattern: string[], disallow: number = 0): number {
    // Find horizontal
    for (let y = 0; y < pattern.length - 1; y++) {
        for (let delta = 0; true; delta++) {
            if (y - delta < 0 && y + 1 + delta >= pattern.length) {
                if (100 * (y + 1) === disallow) {
                    break;
                }

                return 100 * (y + 1);
            }

            if (y - delta < 0 || y + 1 + delta >= pattern.length) {
                continue;
            }

            if (pattern[y - delta] !== pattern[y + 1 + delta]) {
                break;
            }
        }
    }

    // Find vertical
    for (let x = 0; x < pattern[0].length - 1; x++) {
        for (let delta = 0; true; delta++) {
            if (x - delta < 0 && x + 1 + delta >= pattern[0].length) {
                if (x + 1 === disallow) {
                    break;
                }

                return x + 1;
            }

            if (x - delta < 0 || x + 1 + delta >= pattern[0].length) {
                continue;
            }

            if (pattern.map(row => row[x - delta]).join("") !== pattern.map(row => row[x + 1 + delta]).join("")) {
                break;
            }
        }
    }

    return 0;
}