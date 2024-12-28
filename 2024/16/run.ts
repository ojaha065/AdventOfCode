/**
 * Day 16: Reindeer Maze
 * https://adventofcode.com/2024/day/16
 */

console.time("Run time");

import fs from "fs";

type Point = {x: number, y: number};

const DIRECTIONS: Point[] = [
    {x: 0, y: -1}, // 0 = North
    {x: 1, y: 0}, // 1 = East
    {x: 0, y: 1}, // 2 = South
    {x: -1, y: 0} // 3 = West
];

const grid: string[][] = fs.readFileSync("./16/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.split(""));

const start = findLocation('S', grid);
const end = findLocation('E', grid);

const result = solve(start, end, grid);
console.info(`Part 1: ${result.lowestScore}\nPart 2: ${result.visitedCount}`);
console.timeEnd("Run time");

function solve(start: Point, end: Point, grid: string[][]): {lowestScore: number, visitedCount: number} {
    const queue: {pos: Point, dir: number, score: number, route: Point[]}[] = [{pos: start, dir: 1, score: 0, route: [start]}];

    const visited: Map<string, number> = new Map();
    const visitedBest: Set<String> = new Set();
    
    let lowestScore: number = Infinity;

    while (queue.length) {
        queue.sort((a, b) => a.score - b.score);
        const {pos, dir, score, route} = queue.shift()!;

        if (score > lowestScore) { continue; }

        if (pos.x === end.x && pos.y === end.y) {
            if (score < lowestScore) {
                visitedBest.clear();
                lowestScore = score;
            }

            if (score === lowestScore) {
                route.forEach(point => visitedBest.add(`${point.x},${point.y}`));
            }

            continue;
        }
        
        const key = `${pos.x},${pos.y};${dir}`;
        if (visited.has(key) && visited.get(key)! < score) { continue; }
        visited.set(key, score);

        // Try to move forward in the current direction
        const forward: Point = {x: pos.x + DIRECTIONS[dir].x, y: pos.y + DIRECTIONS[dir].y};
        if (grid[forward.y][forward.x] !== '#') {
            queue.push({pos: forward, dir, score: score + 1, route: [...route, forward]});
        }

        // Rotate clockwise and counterclockwise
        queue.push({pos, dir: (dir + 1) % 4, score: score + 1000, route: route}); // Clockwise
        queue.push({pos, dir: (dir + 3) % 4, score: score + 1000, route: route}); // Counterclockwise
    }

    return {lowestScore, visitedCount: visitedBest.size};
}

function findLocation(char: string, grid: string[][]): Point {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === char) {
                return {x,y};
            }
        }
    }

    throw new Error(`Could not find location with ${char}`);
}