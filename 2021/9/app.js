"use strict";

const fs = require("fs");

console.log(solve("./input"));

function solve(filepath) {
    const grid = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean) // Removes empty rows
        .map(row => row.split("").map(s => parseInt(s)));

    /*
        [
            [X, X, X, X, X...]
            [X, X, X, X, X...]
            [X, X, X, X, X...]
            ...
        ]
    */
    //console.debug(grid);

    let riskLevels = 0;
    const largestBasinSizes = new Array(3).fill(-1);

    for (let rowI = 0; rowI < grid.length; rowI++) {
        for (let columnI = 0; columnI < grid[rowI].length; columnI++) {
            const thisValue = grid[rowI][columnI];
            if (thisValue < 9) { // "Locations of height 9 do not count as being in any basin"
                const upValue = grid[rowI - 1] ? grid[rowI - 1][columnI] : Number.MAX_SAFE_INTEGER;
                const downValue = grid[rowI + 1] ? grid[rowI + 1][columnI] : Number.MAX_SAFE_INTEGER;
                const leftValue = grid[rowI][columnI - 1] !== undefined ? grid[rowI][columnI - 1] : Number.MAX_SAFE_INTEGER;
                const rightValue = grid[rowI][columnI + 1] !== undefined ? grid[rowI][columnI + 1] : Number.MAX_SAFE_INTEGER;

                if ([upValue, downValue, leftValue, rightValue].every(value => thisValue < value)) {
                    // Is a low point
                    riskLevels += thisValue + 1;

                    const basinSize = floodFill(grid, rowI, columnI);
                    const index = largestBasinSizes.sort((a, b) => a - b).findIndex(size => basinSize > size);
                    if (index >= 0) {
                        largestBasinSizes[index] = basinSize;
                    }
                }
            }
        }
    }

    return `Part 1: ${riskLevels}, Part 2: ${largestBasinSizes.reduce((a, b) => a * b)}`;
}

/**
 * Basic Flood fill implementation
 * @param {number[][]} grid 
 * @param {number} rowI 
 * @param {number} columnI 
 * @param {string[]} currentBasinCoords 
 * @returns The size of the filled area
 */
function floodFill(grid, rowI, columnI, currentBasinCoords = []) {
    if (!currentBasinCoords.includes(`${rowI}${columnI}`)) {
        currentBasinCoords.push(`${rowI}${columnI}`);

        const thisValue = grid[rowI][columnI];
    
        if (grid[rowI - 1] && grid[rowI - 1][columnI] < 9 && grid[rowI - 1][columnI] > thisValue) {
            floodFill(grid, rowI - 1, columnI, currentBasinCoords);
        }

        if (grid[rowI + 1] && grid[rowI + 1][columnI] < 9 && grid[rowI + 1][columnI] > thisValue) {
            floodFill(grid, rowI + 1, columnI, currentBasinCoords);
        }

        if (grid[rowI][columnI - 1] !== undefined && grid[rowI][columnI - 1] < 9 && grid[rowI][columnI - 1] > thisValue) {
            floodFill(grid, rowI, columnI - 1, currentBasinCoords);
        }

        if (grid[rowI][columnI + 1] !== undefined && grid[rowI][columnI + 1] < 9 && grid[rowI][columnI + 1] > thisValue) {
            floodFill(grid, rowI, columnI + 1, currentBasinCoords);
        }
    }

    return currentBasinCoords.length;
}