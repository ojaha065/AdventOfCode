console.time("Run time");

import fs from "fs";

class Coord {
    readonly x: number;
    readonly y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isAdjacentTo(coord: Coord): boolean {
        return Math.abs(this.x - coord.x) <= 1 && Math.abs(this.y - coord.y) <= 1;
    }
};

const isDigit = /\d/;
const isSymbol = /[^\d\.]/;

const numbers: { value: number, coords: Coord[] }[] = [];
const symbols: { char: string, coord: Coord }[] = [];

let activeNumber: string = "";
let activeNumberCoords: Coord[] = [];

// Read input
fs.readFileSync("./03/input.txt", "utf-8").split("\r\n").filter(Boolean).forEach((row, y) => {
    row.trim().split("").forEach((char, x) => {
        if (isDigit.test(char)) {
            activeNumber += char;
            activeNumberCoords.push(new Coord(x, y));
            return;
        }

        if (activeNumber.length) {
            numbers.push({ value: parseInt(activeNumber), coords: activeNumberCoords });
            activeNumber = "";
            activeNumberCoords = [];
        }

        if (isSymbol.test(char)) {
            symbols.push({ char: char, coord: new Coord(x, y) });
        }
    });
});

// Part 1
// The sum of all numbers adjacent to a symbol
console.info("Part 1: " + numbers
    .filter(number => number.coords.some(numberCoord => symbols.some(symbol => numberCoord.isAdjacentTo(symbol.coord))))
    .map(number => number.value)
    .reduce((a, b) => a + b, 0)
);

// Part 2
// Any symbol with exactly two adjacent numbers => multiply => sum
console.info("Part 2: " + symbols
    .filter(symbol => symbol.char === "*")
    .map(symbol => symbol.coord)
    .map(symbolCoord => numbers.filter(number => number.coords.some(numberCoord => numberCoord.isAdjacentTo(symbolCoord))))
    .filter(adjacentNumbers => adjacentNumbers.length === 2)
    .map(adjacentNumbers => adjacentNumbers.map(number => number.value).reduce(Math.imul))
    .reduce((a, b) => a + b, 0)
);

console.timeEnd("Run time");