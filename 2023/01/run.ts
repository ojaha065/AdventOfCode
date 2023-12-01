console.time("Run time");

import fs from "fs";

const rows = fs.readFileSync("./01/input", "utf-8")
    .split("\r\n")
    .filter(Boolean);

// Part 1
const firstDigit = /\d/;
const lastDigit = /.*(\d)(?!.*\d)/;
console.info("Part 1: " + rows
    .map(row => (firstDigit.exec(row) ?? ["error"])[0] + (lastDigit.exec(row) ?? ["error"])[1])
    .map(Number)
    .reduce((a, b) => a + b, 0)
);

// Part 2
const firstDigitSpelled = /\d|one|two|three|four|five|six|seven|eight|nine/;
const lastDigitSpelled = /.*(\d|one|two|three|four|five|six|seven|eight|nine)(?!.*(?:\d|one|two|three|four|five|six|seven|eight|nine))/;
const replaceMap: Record<string, string> = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9"
};
console.info("Part 2: " + rows
    .map(row => [(row.match(firstDigitSpelled) ?? ["error"])[0], (row.match(lastDigitSpelled) ?? ["error"])[1]])
    .map(arr => arr.map(s => replaceMap[s] ?? s).join(""))
    .map(Number)
    .reduce((a, b) => a + b, 0)
);

console.timeEnd("Run time"); // ~3ms