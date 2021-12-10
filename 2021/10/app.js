"use strict";

const fs = require("fs");

console.log(solve("./input"));

function solve(filepath) {
    const rows = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean); // Removes empty rows

    const charMap = {
        "(": ")",
        "[": "]",
        "{": "}",
        "<": ">"
    };

    let part1Score = 0;
    let part2Scores = [];

    rows.forEach(row => {
        const stack = [];
        let corrupted = false;

        for (const char of row) {
            if (["(", "[", "{", "<"].some(startChar => char === startChar)) {
                stack.push(charMap[char]);
            } else if (char !== stack.pop()) {
                if (char === ")") {
                    part1Score += 3;
                } else if (char === "]") {
                    part1Score += 57;
                } else if (char === "}") {
                    part1Score += 1197;
                } else if (char === ">") {
                    part1Score += 25137;
                }
                corrupted = true;
                break;
            }
        }

        if (!corrupted) {
            part2Scores.push(stack.reverse().reduce((a, b) => {
                a *= 5;
                if (b === ")") {
                    a += 1;
                } else if (b === "]") {
                    a += 2;
                } else if (b === "}") {
                    a += 3;
                } else if (b === ">") {
                    a += 4;
                }
                return a;
            }, 0));
        }
    });

    return `Part 1: ${part1Score}, Part 2: ${part2Scores.sort((a, b) => a - b)[Math.floor(part2Scores.length / 2)]}`;
}