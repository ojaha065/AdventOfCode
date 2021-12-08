"use strict";

const fs = require("fs");

console.log(solve("./input"));

function solve(filepath) {
    const rows = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean); // Removes empty rows

    let part1Result = 0;
    let part2Result = 0;

    rows.forEach(row => {
        const [patterns, output] = row.split("|");

        // Figuring out each number (0-9) from the segments
        const patternsSplit = patterns.split(/\s+/).map(s => s.trim()).filter(Boolean);
        const numbers = new Array(10);

        //console.debug(patternsSplit);

        // Let's start with the easy ones; 1, 4, 7 and 8 all use unique number of segments
        // so they are easy to recognize. This is basically the part one of the puzzle
        numbers[1] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(s => s.length === 2));
        numbers[4] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(s => s.length === 4));
        numbers[7] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(s => s.length === 3));
        numbers[8] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(s => s.length === 7));

        const outputSplit = output.split(/\s+/).map(s => s.trim()).filter(Boolean).map(s => s.split("")); // [ [], [], [] ]
        part1Result += outputSplit
            .filter(arr => {
                return (numbers[1].length === arr.length && numbers[1].split("").every(char => arr.includes(char))) ||
                    (numbers[4].length === arr.length && numbers[4].split("").every(char => arr.includes(char))) ||
                    (numbers[7].length === arr.length && numbers[7].split("").every(char => arr.includes(char))) ||
                    (numbers[8].length === arr.length && numbers[8].split("").every(char => arr.includes(char)))
            })
            .length;

        // Then the hard part: Rest of the numbers

        // 6 has a length of six and it has one same segment with 1
        const charsOfOne = numbers[1].split("");
        numbers[6] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(pattern => pattern.length === 6 && pattern.split("").filter(char => charsOfOne.includes(char)).length === 1));

        // 9 has a length of six and it has 6 same segments with 8
        const charsOfEight = numbers[8].split("");
        numbers[9] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(pattern =>
            pattern.length === 6 &&
            pattern.split("").filter(char => charsOfEight.includes(char)).length === 6 &&
            pattern.split("").filter(char => numbers[4].split("").includes(char)).length === 4 // Also has four same segments with 4 the differentiate it from zero
        ));

        // 0 is the last remaining with a length of six
        numbers[0] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(pattern => pattern.length === 6));

        // 5 has a length of five and five same segments with 6
        const charsOfSix = numbers[6].split("");
        numbers[5] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(pattern => pattern.length === 5 && pattern.split("").filter(char => charsOfSix.includes(char)).length === 5));

        // 3 is the only one left with three same segments with 7
        const charsOfSeven = numbers[7].split("");
        numbers[3] = removeIndexAndReturn(patternsSplit, patternsSplit.findIndex(pattern => pattern.split("").filter(char => charsOfSeven.includes(char)).length === 3));

        // 2 is the last one
        numbers[2] = patternsSplit[0];

        // We should now have all the numbers figured out
        if (numbers.filter(Boolean).length !== 10) {
            throw new Error("Something went wrong!");
        }

        // Decoding the output
        part2Result += parseInt(outputSplit
            .map(arr => numbers.findIndex(number => number.length === arr.length && number.split("").every(char => arr.includes(char))))
            .reduce((a, b) => `${a}${b}`, ""));
    });

    return `Part 1: ${part1Result}, Part 2: ${part2Result}`;
}

function removeIndexAndReturn(patternsSplit, i) {
    if (i < 0 || i >= patternsSplit.length) {
        throw new Error(`Something went wrong! i=${i}`);
    }

    return patternsSplit.splice(i, 1)[0];
}