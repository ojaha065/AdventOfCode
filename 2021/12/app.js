"use strict";

const fs = require("fs");

console.log(`Part 1: ${solve("./input", false)}, Part 2: ${solve("./input", true)}`);

function solve(filepath = "./input", part2Rules = true) {
    // { A: [...], B: [...] }
    // key = location; value = array of locations to where can go from there
    const connections = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean) // Removes empty rows
        .map(row => row.split("-"))
        .reduce((o, arr) => {
            o[arr[0]] = [...(o[arr[0]] ?? []), arr[1]];
            o[arr[1]] = [...(o[arr[1]] ?? []), arr[0]]; // It's possible to backtrack; If A --> B, we can also go back B --> A
            return o;
        }, {});
    //console.debug(connections);

    let foundPaths = 0;

    // First time for me using IIFE for recursion like this, so cool!
    (function pathFind(nextLocation = "start", currentPath = []) {
        currentPath.push(nextLocation);

        connections[nextLocation]?.forEach(possibleLocation => {
            if (possibleLocation === "end") {
                foundPaths++;
                return;
            }

            if (isLowercase(possibleLocation) && currentPath.includes(possibleLocation)) {
                if (possibleLocation === "start" // Start can be visited only once
                    || !part2Rules // In part 1 small caves can only be visited once
                    || !currentPath.filter(isLowercase).every((e, i, a) => a.indexOf(e) === i) // In part 2 one small cave can be visited twice
                    ) {return;}
            }

            pathFind(possibleLocation, [...currentPath]); // Need to clone the array so different branches don't combine
        });
    })();

    return foundPaths;
}

/**
 * Checks if a string is lowercase
 * @param {string} string 
 * @returns true if the string only contains lowercase characters, false otherwise
 */
function isLowercase(string) {
    return string === string.toLowerCase();
}