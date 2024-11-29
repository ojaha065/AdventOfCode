/**
 * Just a test file for testing the TypeScript env
 */

console.time("Run time");

import fs from "fs";

const input = fs.readFileSync("./00/input.txt", "utf-8");
console.info(input);

console.timeEnd("Run time");