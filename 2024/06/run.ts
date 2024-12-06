/**
 * Day 6: Guard Gallivant
 * https://adventofcode.com/2024/day/6
 */

console.time("Run time");

import fs from "fs";

enum GuardDirection {
    UP = "^",
    RIGHT = ">",
    DOWN = "v",
    LEFT = "<",
};

const originalGrid: string[][] = fs.readFileSync("./06/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .filter(Boolean)
    .map(row => row.split(""))
    .map(row => row.map(char => char === "." ? "" : char));

const gridWidth = originalGrid[0].length;
const startingPosition = getStartPosition(originalGrid);
const startingDirection = originalGrid[startingPosition.y][startingPosition.x] as GuardDirection;

originalGrid[startingPosition.y][startingPosition.x] = "";

// Part 1
const grid = getGridCopy(originalGrid);
doGuardMovement(grid);
console.info("Part 1: " + grid.flatMap(row => row).filter(cell => cell.startsWith("X")).length);

// Part 2
let part2Result = 0;
for (let y = 0; y < originalGrid.length; y++) {
    for (let x = 0; x < originalGrid.length; x++) {
        if (!originalGrid[y][x].length && grid[y][x].startsWith("X")) {
            // Cell is empty AND was visited during part 1 => Should place an obstacle here
            const gridCopy = getGridCopy(originalGrid);
            gridCopy[y][x] = "#";
            if (!doGuardMovement(gridCopy)) { part2Result++; }
        }
    }
}
console.info("Part 2: " + part2Result);
console.timeEnd("Run time");

function doGuardMovement(grid: string[][]): boolean {
    let [x, y, guard] = [startingPosition.x, startingPosition.y, startingDirection];

    while (y >= 0 && y < grid.length && x >= 0 && x < gridWidth) {
        // Check for loop
        if (grid[y][x].length > 3) { return false; }
        grid[y][x] += "X"; // Mark each visitation with X
        
        // If there is something directly in front of you, turn right 90 degrees
        if (guard === GuardDirection.UP && y > 0 && grid[y - 1][x] === "#") { guard = GuardDirection.RIGHT; }
        else if (guard === GuardDirection.RIGHT && x < gridWidth - 1 && grid[y][x + 1] === "#") { guard = GuardDirection.DOWN; }
        else if (guard === GuardDirection.DOWN && y < grid.length - 1 && grid[y + 1][x] === "#") { guard = GuardDirection.LEFT; }
        else if (guard === GuardDirection.LEFT && x > 0 && grid[y][x - 1] === "#") { guard = GuardDirection.UP; }
    
        // Otherwise, take a step forward
        else if (guard === GuardDirection.UP) { y--; }
        else if (guard === GuardDirection.RIGHT) { x++; }
        else if (guard === GuardDirection.DOWN) { y++; }
        else if (guard === GuardDirection.LEFT) { x--; }
        
        else { throw new Error("Something went wrong"); }
    }

    return true; // Exited
}

function getGridCopy(grid: string[][]): string[][] {
    return grid.map(row => [...row]);
}

function getStartPosition(grid: string[][]): {x: number, y: number} {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            if (Object.values(GuardDirection).some(char => grid[y][x] === char)) {
                return {x, y};
            }
        }
    }

    throw new Error("Could not find starting position");
}