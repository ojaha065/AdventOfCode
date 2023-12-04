console.time("Run time");

import fs from "fs";

const cardRegex = /Card\s+\d{1,3}:\s+([\d\s]+)\|([\d\s]+)/;
const whitespace = /\s+/;

const cards = fs.readFileSync("./04/input.txt", "utf-8")
    .split("\r\n")
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => cardRegex.exec(row))
    .map(arr => {
        if (arr) { return arr; }
        throw new Error("Error parsing row");
    })
    .map(arr => {
        const arr1 = arr[1].trim().split(whitespace).map(number => parseInt(number.trim()));
        const arr2 = arr[2].trim().split(whitespace).map(number => parseInt(number.trim()));
        return arr1.filter(number1 => arr2.includes(number1)).length;
    });

// Part 1
console.info("Part 1: " + cards
    .filter(Boolean)
    .map(winningNumbers => Math.pow(2, winningNumbers - 1))
    .reduce((a, b) => a + b, 0)
);

// Part 2
const copies: Record<string, number> = {};
for (let i = 0; i < cards.length; i++) { // Loop all (initial) cards
    copies[i.toString()] = copies[i.toString()] ? (copies[i.toString()] + 1) : 1; // Add the initial card to total

    // Loop each copy we have
    for (let j = 0; j < copies[i.toString()]; j++) {
        // Pay out prizes (more cards!) for each copy
        for (let k = 1; k <= cards[i]; k++) {
            copies[(i + k).toString()] = copies[(i + k).toString()] ? (copies[(i + k).toString()] + 1) : 1
        }
    }
}
console.info("Part 2: " + Object.values(copies).reduce((a, b) => a + b, 0));

console.timeEnd("Run time");