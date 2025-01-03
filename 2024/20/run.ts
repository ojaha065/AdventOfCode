/**
 * Day 20: Race Condition
 * https://adventofcode.com/2024/day/20
 */

console.time("Run time");

import fs from "fs";

type Point = {x: number, y: number};
type Cell = {char: string, stepsToEnd: number | null};

const DIRECTIONS: Point[] = [
    {x: 0, y: -1}, // Up
    {x: 0, y: 1}, // Down
    {x: -1, y: 0}, // Left
    {x: 1, y: 0} // Right
];

const grid: Cell[][] = fs.readFileSync("./20/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.split(""))
    .map(row => row.map(char => { return {char, stepsToEnd: null} }));

const startPos = findChar('S', grid);
const endPos = findChar('E', grid);
const path = pathfinder(startPos, endPos, grid);
[...path].reverse().forEach((point, index) => grid[point.y][point.x].stepsToEnd = index);


console.info("Part 1: " + solve(path, grid, getPointsWithinDelta(2)));
console.info("Part 2: " + solve(path, grid, getPointsWithinDelta(20)));
console.timeEnd("Run time");

function solve(path: Point[], grid: Cell[][], cheats: Point[]): number {
    let result: number = 0;
    for (const point of path) {
        const normalStepsToEnd = grid[point.y][point.x].stepsToEnd;
    
        for (const cheat of cheats) {
            const cheatPoint: Point = {x: point.x + cheat.x, y: point.y + cheat.y};
            if (cheatPoint.y >= 0 && cheatPoint.y < grid.length && cheatPoint.x >= 0 && cheatPoint.x < grid[cheatPoint.y].length) {
                const cell = grid[cheatPoint.y][cheatPoint.x];
                if (cell.char !== '#') {
                   if (normalStepsToEnd! - cell.stepsToEnd! - (Math.abs(cheat.x) + Math.abs(cheat.y)) >= 100) { result++; }
                }
            }
        }
    }

    return result;
}

function pathfinder(start: Point, end: Point, grid: Cell[][]): Point[] {
    const queue: {pos: Point, path: Point[]}[] = [{pos: start, path: [start]}];
    const visited: Set<string> = new Set();

    while (queue.length) {
        const {pos, path} = queue.shift()!;

        if (pos.x === end.x && pos.y === end.y) {
            return path;
        }

        const key = `${pos.x},${pos.y}`;
        if (visited.has(key)) { continue; }
        visited.add(key);

        for (const dir of DIRECTIONS) {
            const nextPoint: Point = {x: pos.x + dir.x, y: pos.y + dir.y};
            if (grid[nextPoint.y][nextPoint.x].char !== '#') {
                queue.push({pos: nextPoint, path: [...path, nextPoint]});
            }
        }
    }

    throw new Error("Path not found!");
}

function findChar(char: string, grid: Cell[][]): Point {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x].char === char) {
                return {x,y};
            }
        }
    }

    throw new Error(`Char '${char}' not found!`);
}

function getPointsWithinDelta(delta: number): Point[] {
    const points: Point[] = [];

    for (let x = -delta; x <= delta; x++) {
        for (let y = -delta; y <= delta; y++) {
            if (!(x === 0 && y === 0) && Math.abs(x) + Math.abs(y) <= delta) {
                points.push({x,y});
            }
        }
    }

    return points;
}