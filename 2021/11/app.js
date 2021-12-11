"use strict";

const fs = require("fs");

console.log(solve());

function solve(filepath = "./inputTest") {
    const grid = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean) // Removes empty rows
        .map(row => row.split("").map(s => parseInt(s)));
    //console.debug(grid);

    let part1FlashCount = 0;
    let part2StepIndex;

    for (let loopI = 0; !part2StepIndex; loopI++) {
        // "First, the energy level of each octopus increases by 1."
        for (let rowI = 0; rowI < grid.length; rowI++) {
            for (let columnI = 0; columnI < grid[rowI].length; columnI++) {
                grid[rowI][columnI]++;
            }
        }

        // "Then, any octopus with an energy level greater than 9 flashes."
        const flashedThisStep = [];
        for (let rowI = 0; rowI < grid.length; rowI++) {
            for (let columnI = 0; columnI < grid[rowI].length; columnI++) {
                if (grid[rowI][columnI] > 9) {
                    flash(grid, rowI, columnI, false, flashedThisStep);
                }
            }
        }

        // "Finally, any octopus that flashed during this step has its energy level set to 0"
        flashedThisStep.forEach(xy => {
            const [rowI, columnI] = xy.split(",");
            grid[rowI][columnI] = 0;
        });

        // "How many total flashes are there after 100 steps?"
        if (loopI <= 99) {
            part1FlashCount += flashedThisStep.length;
        }

        // "What is the first step during which all octopuses flash?"
        if (flashedThisStep.length === 100) {
            part2StepIndex = loopI + 1;
            break;
        }
    }

    return `Part 1: ${part1FlashCount}, Part 2: ${part2StepIndex}`;
}

/**
 * Flash at position
 * @param {number[][]} grid 
 * @param {number} rowI 
 * @param {number} columnI 
 * @param {boolean} increase 
 * @param {string[]} flashedThisStep 
 * @returns Array with all coords that flashed
 */
function flash(grid, rowI, columnI, increase, flashedThisStep) {
    if (rowI < 0 || rowI > grid.length - 1 || columnI < 0 || columnI > grid[rowI].length - 1) {
        // Outside grid, do nothing
        return;
    }

    // "This increases the energy level of all adjacent octopuses by 1"
    if (increase) {
        grid[rowI][columnI]++;
    }

    // "If this causes an octopus to have an energy level greater than 9, it also flashes."
    // "An octopus can only flash at most once per step"
    if (grid[rowI][columnI] > 9 && !flashedThisStep.includes(`${rowI},${columnI}`)) {
        flashedThisStep.push(`${rowI},${columnI}`);

        flash(grid, rowI - 1, columnI - 1, true, flashedThisStep);
        flash(grid, rowI - 1, columnI, true, flashedThisStep);
        flash(grid, rowI - 1, columnI + 1, true, flashedThisStep);
        flash(grid, rowI, columnI - 1, true, flashedThisStep);
        flash(grid, rowI, columnI + 1, true, flashedThisStep);
        flash(grid, rowI + 1, columnI - 1, true, flashedThisStep);
        flash(grid, rowI + 1, columnI, true, flashedThisStep);
        flash(grid, rowI + 1, columnI + 1, true, flashedThisStep);
    }

    return flashedThisStep;
}