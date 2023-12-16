/**
 * Day 15: Lens Library
 * https://adventofcode.com/2023/day/15
 */

console.time("Run time");

import fs from "fs";

const input = fs.readFileSync("./15/input.txt", "utf-8").replaceAll(/[\r\n]+/g, "");
const sequence = input.split(",");

console.info("Part 1: " + sequence.map(HASH).reduce((a, b) => a + b, 0));

// Part 2
const STEP_PATTERN = /([a-z]+)(=|-)(\d)?/;
const boxes: {label: string, focalLength: number}[][] = Array.from(new Array(256)).map(_arr => []);
for (const step of sequence) {
    const match = STEP_PATTERN.exec(step);
    if (!match) {
        throw new Error(`Failed to parse step "${step}"`);
    }

    const label = match[1];
    const boxNumber = HASH(label);
    const currentIndex = boxes[boxNumber].findIndex(o => o.label === label);

    if (match[2] === "-" && currentIndex >= 0) {
        boxes[boxNumber].splice(currentIndex, 1);
    }
    else if (match[2] === "=") {
        if (currentIndex >= 0) {
            boxes[boxNumber].splice(currentIndex, 1, {label: label, focalLength: parseInt(match[3])});
        }
        else {
            boxes[boxNumber].push({label: label, focalLength: parseInt(match[3])});
        }
    }
}
console.info("Part 2: " + boxes
    .flatMap((box, boxNumber) => box.map((slot, slotNumber) => (1 + boxNumber) * (slotNumber + 1) * slot.focalLength))
    .reduce((a, b) => a + b, 0)
);

console.timeEnd("Run time");

function HASH(input: string): number {
    let currentValue = 0;
    for (const char of input.split("")) {
        currentValue += char.charCodeAt(0);
        currentValue *= 17;
        currentValue %= 256;
    }
    return currentValue;
}