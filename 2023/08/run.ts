/**
 * Day 8: Haunted Wasteland
 * https://adventofcode.com/2023/day/8
 */

console.time("Run time");

import fs from "fs";

const nodeRegex = /^([A-Z1-9]{3})\s+=\s+\(([A-Z1-9]{3}),\s+([A-Z1-9]{3})\)$/;

const rows = fs.readFileSync("./08/input.txt", "utf-8").split(/[\n\r]+/).map(row => row.trim()).filter(Boolean);
const directions = rows.shift()?.split("") ?? [];
const network = Object.fromEntries(rows
    .map(row => nodeRegex.exec(row))
    .map(arr => {
        if (!arr) { throw new Error("Parse error"); }
        return [arr[1], [arr[2], arr[3]]];
    }));

console.info("Part 1: " + walk("AAA"));

// This assumes the path length from __A to __Z is equal to the period of the cycle 
console.info("Part 2: " + Object.keys(network)
    .filter(node => node.endsWith("A"))
    .map(node => walk(node, true))
    .reduce(LCM)
);

console.timeEnd("Run time");

function walk(from: string, partTwoRules = false): number {
    let currentNode = network[from];
    for (let i = 0; true; i++) {
        const nextNode = directions[i % directions.length] === "L" ? currentNode[0] : currentNode[1];
        if (nextNode === "ZZZ" || (partTwoRules && nextNode.endsWith("Z"))) {
            return i + 1;
        }

        currentNode = network[nextNode];
    }
}

function LCM(a: number, b: number): number {
    const max = Math.max(a, b);
    const min = Math.min(a, b);

    for (let i = max; true; i += max) {
        if (i % min == 0)
            return i;
    }
};