/**
 * Day 15: Warehouse Woes
 * https://adventofcode.com/2024/day/15
 */

console.time("Run time");

import fs from "fs";

type Point = {x: number, y: number};

enum Direction {
    UP = '^',
    DOWN = 'v',
    LEFT = '<',
    RIGHT = '>'
}

const input = fs.readFileSync("./15/input.txt", "utf-8").split(/[\r\n]{4,}/);
const warehouse: string[][] = input[0]
    .split(/[\r\n]+/)
    .map(row => row.split(""));
const movements: Direction[] = input[1]
    .split("")
    .map(char => char.trim())
    .filter(Boolean)
    .map(char => char as Direction);

// Part 1
console.info("Part 1: " + solve(warehouse, movements));

// Part 2
const secondWarehouse = warehouse.map(row => {
    const newRow: string[] = [];
    for (const char of row) {
        if (char === '#') { newRow.push('#', '#'); }
        else if (char === 'O') { newRow.push('[', ']'); }
        else if (char === '.') { newRow.push('.', '.'); }
        else { newRow.push('@', '.'); }
    }
    return newRow;
});
console.info("Part 2: " + solve(secondWarehouse, movements));
console.timeEnd("Run time");

function solve(warehouse: string[][], movements: Direction[]): number {
    let _warehouse = warehouse.map(row => [...row]); // Take a copy to avoid modifying the original
    const robotLocation: Point = findStartLocation(_warehouse);

    for (const move of movements) {
        // Under some very specific circumstances in part 2, tryMove returns false, but the grid has already been modified
        // "Fix" the issue ba taking a copy so we can easily revert all changes made
        // Slow AF of course but rest of this code isn't optimized either, so...
        const copy = _warehouse.map(row => [...row]);
    
        if (tryMove(robotLocation, move, _warehouse)) {
            if (move === Direction.UP) { robotLocation.y--; }
            else if (move === Direction.DOWN) { robotLocation.y++; }
            else if (move === Direction.LEFT) { robotLocation.x--; }
            else { robotLocation.x++; }
        } else {
            _warehouse = copy; // Revert changes
        }
    }

    // GPS
    let result = 0;
    for (let y = 0; y < _warehouse.length; y++) {
        for (let x = 0; x < _warehouse[y].length; x++) {
            if (_warehouse[y][x] === "O" || _warehouse[y][x] === "[") {
                result += 100 * y + x;
            }
        }
    }
    return result;
}

function tryMove(from: Point, direction: Direction, warehouse: string[][], movingPair = false): boolean {
    const moveWhat = warehouse[from.y][from.x];
    if (moveWhat === "#") {
        return false;
    }

    let to: Point;
    switch (direction) {
        case Direction.UP: to = {x: from.x, y: from.y - 1}; break;
        case Direction.DOWN: to = {x: from.x, y: from.y + 1}; break;
        case Direction.LEFT: to = {x: from.x - 1, y: from.y}; break;
        case Direction.RIGHT: to = {x: from.x + 1, y: from.y}; break;
    }

    const allowMove = warehouse[to.y][to.x] === "."
        || (direction === Direction.UP && tryMove({x: from.x, y: from.y - 1}, direction, warehouse))
        || (direction === Direction.DOWN && tryMove({x: from.x, y: from.y + 1}, direction, warehouse))
        || (direction === Direction.LEFT && tryMove({x: from.x - 1, y: from.y}, direction, warehouse))
        || (direction === Direction.RIGHT && tryMove({x: from.x + 1, y: from.y}, direction, warehouse));

    if (allowMove) {
        // Part 1 logic handles horizontal movement of larger boxes just fine. Needs special handling for vertical movement
        if (!movingPair && (direction === Direction.UP || direction === Direction.DOWN)) {
            if (moveWhat === "[" && !tryMove({x: from.x + 1, y: from.y}, direction, warehouse, true)) {
                return false;
            }
            if (moveWhat === "]" && !tryMove({x: from.x - 1, y: from.y}, direction, warehouse, true)) {
                return false;
            }
        }

        // Make the move
        warehouse[to.y][to.x] = moveWhat;
        warehouse[from.y][from.x] = ".";
        return true;
    }
    return false;
}

function findStartLocation(warehouse: string[][]): Point {
    for (let y = 0; y < warehouse.length; y++) {
        for (let x = 0; x < warehouse[y].length; x++) {
            if (warehouse[y][x] === "@") {
                return {x,y};
            }
        }
    }

    throw new Error("Could not find start location!");
}