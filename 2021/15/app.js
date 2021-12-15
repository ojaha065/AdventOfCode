"use strict";

const fs = require("fs");

class Node {
    x;
    y;
    riskLevel;
    distance = Number.MAX_SAFE_INTEGER; // from start

    constructor (x, y, riskLevel) {
        this.x = parseInt(x);
        this.y = parseInt(y);

        const rawRiskLevel = parseInt(riskLevel);
        this.riskLevel = rawRiskLevel > 9 ? (rawRiskLevel + 9) % 9 : rawRiskLevel;
    }
}

function solve(filepath = "./input", part2 = true) {
    // Dijkstra's algorithm
    // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

    // Mark all nodes unvisited
    const unvisitedNodes = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("r", ""))
        .filter(Boolean) // Removes empty rows
        .map(row => row.split(""))
        .reduce((resultArr, arr, rowI) => {
            arr.forEach((riskLevel, columnI) => resultArr.push(new Node(columnI, rowI, riskLevel)));
            return resultArr;
        }, []);
    //console.debug(unvisitedNodes);

    let endX = unvisitedNodes.map(node => node.x).sort((a, b) => b - a)[0];
    let endY = unvisitedNodes.map(node => node.y).sort((a, b) => b - a)[0];

    // For part 2 we expand the grid by 5x
    if (part2) {
        unvisitedNodes.splice(0, unvisitedNodes.length).forEach(node => {
            for (let expandRowI = 0; expandRowI < 5; expandRowI++) {
                for (let expandColumnI = 0; expandColumnI < 5; expandColumnI++) {
                    unvisitedNodes.push(new Node(
                        node.x + ((endX + 1) * expandColumnI),
                        node.y + ((endY + 1) * expandRowI),
                        node.riskLevel + expandRowI + expandColumnI
                    ));
                }
            }
        });

        // Recalculate grid size
        endX = unvisitedNodes.map(node => node.x).sort((a, b) => b - a)[0];
        endY = unvisitedNodes.map(node => node.y).sort((a, b) => b - a)[0];
        //console.debug(endX, endY);
    }
    //console.debug(unvisitedNodes);

    // Starting node has a distance of 0
    unvisitedNodes[unvisitedNodes.findIndex(node => node.x === 0 && node.y === 0)].distance = 0;

    let progressCounter = 0;

    for (;;) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const currentNode = unvisitedNodes.shift();
        if (currentNode.x === endX && currentNode.y === endY) {
            return currentNode;
        }
        
        [
            [currentNode.x, currentNode.y - 1], // Top neighbor
            [currentNode.x, currentNode.y + 1], // Bottom neighbor
            [currentNode.x - 1, currentNode.y], // Left neighbor
            [currentNode.x + 1, currentNode.y] // Right neighbor
        ].forEach(neighborCoords => {
            const neighborIndex = unvisitedNodes.findIndex(node => node.x === neighborCoords[0] && node.y === neighborCoords[1]);
            if (neighborIndex >= 0) {
                const newDistance = currentNode.distance + unvisitedNodes[neighborIndex].riskLevel;
                unvisitedNodes[neighborIndex].distance = newDistance > unvisitedNodes[neighborIndex].distance ? unvisitedNodes[neighborIndex].distance : newDistance;
            }
        });

        console.log(++progressCounter);
    }
}