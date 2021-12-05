"use strict";

const fs = require("fs");

class Line {
    x1;
    y1;
    x2;
    y2;

    pointsCache;

    constructor(x1, y1, x2, y2) {
        this.x1 = Number(x1);
        this.y1 = Number(y1);
        this.x2 = Number(x2);
        this.y2 = Number(y2);
    }

    get isHorizontalOrVertical() {
        return this.x1 === this.x2 || this.y1 === this.y2;
    }

    get points() {
        if (this.pointsCache) {
            return this.pointsCache;
        }

        const points = [[this.x1, this.y1]];
        while (true) {
            const lastX = points[points.length - 1][0];
            const lastY = points[points.length - 1][1];
            if (lastX === this.x2 && lastY === this.y2) {
                break;
            }

            if (this.x1 === this.x2) { // Is vertical
                points.push([lastX, lastY + (this.y1 > this.y2 ? -1 : 1)]);
            } else if (this.y1 === this.y2) { // Is horizontal
                points.push([lastX + (this.x1 > this.x2 ? -1 : 1), lastY]);
            } else { // Is diagonal
                points.push([
                    lastX + (this.x1 > this.x2 ? -1 : 1),
                    lastY + (this.y1 > this.y2 ? -1 : 1)
                ]);
            }
        }
        
        this.pointsCache = points;
        return points;
    }
}

const result = solve("./input");
console.log(`Part 1: ${result[0]}, Part 2: ${result[1]}`);

function solve(filepath) {
    return fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean) // Removes empty lines
        .map(row => row.split("->").map(s => s.trim()).flatMap(s => s.split(",")))
        .map(arr => new Line(...arr))
        .reduce((buckets, line) => {
            buckets[0].push(line); // Bucket 0: All
            if (line.isHorizontalOrVertical) {
                buckets[1].push(line); // Bucket 1: Only horizontal and vertical lines
            }
            return buckets;
        }, [[], []])
        .map(bucket => bucket.flatMap(line => line.points))
        .map(bucket => bucket.map(point => point.toString())) // Stringify for comparing as [1, 1] !== [1, 1]
        .map(bucket => bucket.filter((e, i, a) => a.indexOf(e) !== i)) // All that occur more than once
        .map(bucket => bucket.filter((e, i, a) => a.indexOf(e) === i)) // Remove duplicates (as we have coords with 3+ lines)
        .map (bucket => bucket.length)
        .reverse();
}