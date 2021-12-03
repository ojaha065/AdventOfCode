"use strict";

const fs = require("fs");

const result = solve("./input");
console.log(`Part 1: ${result[0]}, Part 2: ${result[1]}`);

function solve(filepath) {
    const rows = fs.readFileSync(filepath, "UTF-8")
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean);

    let gamma = "";
    let epsilon = "";

    let oxygen = [...rows];
    let scrubber = [...rows];

    // Part 1
    for (let i = 0; i < rows[0].length; i++) { // 12 loops
        const _hasMoreOnes = hasMoreOnes(rows, i);
        gamma += _hasMoreOnes ? "1" : "0";
        epsilon += _hasMoreOnes ? "0" : "1";
    }

    // Part 2
    for (let i = 0; oxygen.length > 1; i++) {
        oxygen = oxygen.filter(row => row.charAt(i) === (hasMoreOnes(oxygen, i) ? "1" : "0"));
    }
    for (let i = 0; scrubber.length > 1; i++) {
        scrubber = scrubber.filter(row => row.charAt(i) === (hasMoreOnes(scrubber, i) ? "0" : "1"));
    }

    return [
        parseInt(gamma, 2) * parseInt(epsilon, 2),
        parseInt(oxygen[0], 2) * parseInt(scrubber[0], 2)
    ];
}

function hasMoreOnes(rows, i) {
    return rows
        .map(row => row.charAt(i))
        .map(bit => parseInt(bit))
        .filter(Boolean)
        .length >= rows.length / 2;
}