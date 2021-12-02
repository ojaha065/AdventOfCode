"use strict";

const fs = require("fs");

// Test
const test = solve("./testInput");
if (test[0] !== 150 || test[1] !== 900) {
	throw new Error(`Test failure! Part 1: ${test[0]}, Part 2: ${test[1]}`);
}

const result = solve("./input");
console.log(`Part 1: ${result[0]}, Part 2: ${result[1]}`);

function solve(filepath) {
	let horPoz = [0, 0];
	let depth = [0, 0];
	let aim = [0, 0];

	fs.readFileSync(filepath, "UTF-8").split("\n")
		.map(row => row.split(" "))
		.map(row => [row[0].trim(), parseInt(row[1].trim())])
		.forEach(row => {
			const direction = row[0];
			const units = row[1];

			switch(direction) {
				case "forward":
					horPoz[0] += units;
					horPoz[1] += units;
					depth[1] += aim[1] * units;
					break;
				case "down":
					depth[0] += units;
					aim[1] += units;
					break;
				case "up":
					depth[0] -= units;
					aim[1] -= units;
					break;
				default:
					throw new Error(`Unexpected direction ${direction}`);
			}
		});

	return [horPoz[0] * depth[0], horPoz[1] * depth[1]];
}