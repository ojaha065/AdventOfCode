/**
 * Day 18: RAM Run
 * https://adventofcode.com/2024/day/18
 */

console.time("Run time");

import fs from "fs";

type Point = {x: number, y: number};

const DIRECTIONS: Point[] = [
    {x: 0, y: -1}, // 0 = Up
    {x: 1, y: 0}, // 1 = Right
    {x: 0, y: 1}, // 2 = Down
    {x: -1, y: 0} // 3 = Left
];

const GRID_SIZE: number = 70;
const grid: string[][] = [...Array(GRID_SIZE + 1)].map(() => Array(GRID_SIZE + 1).fill('.'));

const input: Point[] = fs.readFileSync("./18/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(s => s.split(','))
    .map(arr => arr.map(s => parseInt(s)))
    .map(([x,y]) => { return {x,y}; })
    .reverse();

const startPoint: Point = {x: 0, y: 0};
const endPoint: Point = {x: GRID_SIZE, y: GRID_SIZE};

// Part 1
for (let i = 0; i < 1024; i++) {
    const point = input.pop()!;
    grid[point.y][point.x] = '#';
}
console.info("Part 1: " + pathfinder(startPoint, endPoint, grid));

// Part 2
while (input.length) {
    const point = input.pop()!;
    grid[point.y][point.x] = '#';
    if (pathfinder(startPoint, endPoint, grid) === -1) {
        console.info(`Part 2: ${point.x},${point.y}`);
        break;
    }
}

console.timeEnd("Run time");

function pathfinder(start: Point, end: Point, grid: string[][]): number {
    const queue: {pos: Point, steps: number}[] = [{pos: start, steps: 0}];
    const visited: Set<string> = new Set();

    while (queue.length) {
        const {pos, steps} = queue.shift()!;

        if (pos.x === end.x && pos.y === end.y) {
            return steps;
        }

        const key = `${pos.x},${pos.y}`;
        if (visited.has(key)) { continue; }
        visited.add(key);

        for (const dir of DIRECTIONS) {
            const nextPoint: Point = {x: pos.x + dir.x, y: pos.y + dir.y};
            if (nextPoint.y >= 0 && nextPoint.y < grid.length && nextPoint.x >= 0 && nextPoint.x < grid[nextPoint.y].length && grid[nextPoint.y][nextPoint.x] === '.') {
                queue.push({pos: nextPoint, steps: steps + 1});
            }
        }
    }

    return -1; // Path not found
}