"use strict";

const fs = require("fs");

const result = solve("./input");
console.log(`Part 1 (score of the first win): ${result[0]}, Part 2 (score of the last win): ${result[result.length - 1]}`);

function solve(filepath) {
    const rows = fs.readFileSync(filepath, "UTF-8")
        .trim()
        .split("\n")
        .map(row => row.trim().replace("\r", ""))
        .filter(Boolean); // Removes empty rows

    const numbers = rows[0].split(",").map(s => parseInt(s));
    rows.splice(0, 1); // Removing the first row before parsing the boards

    const scores = [];

    // 1. Parse the boards
    let boards = [];

    let currentBoard = [];
    rows.forEach(row => {
        currentBoard.push(row.split(/\s+/).map(s => s.trim()).map(s => parseInt(s)));
        if (currentBoard.length === 5) {
            boards.push(currentBoard);
            currentBoard = [];
        }
    });
    //console.debug(boards);

    // 2. Play the game
    for (let i = 5; i < numbers.length; i++) { // We start at 5 as no board can win before that
        const currentNumbers = numbers.slice(0, i);

        boards = boards.filter(board => {
            const winning = getWinningRow(board, currentNumbers);
            if (winning) {
                const sum = board.flat().filter(number => !currentNumbers.includes(number)).reduce((a, b) => a + b, 0);
                const winningNumber = currentNumbers[currentNumbers.length - 1];
                scores.push(sum * winningNumber);
                return false; // We're in filter() so false removes the board
            }
            return true;
        });
    }

    // 3. Profit!
    return scores;
}

/**
 * 
 * @param {Number[][]} board 
 * @param {Number[]} currentNumbers 
 * @returns null if the board is not winning
 */
function getWinningRow(board, currentNumbers) {
    const horizontalWin = board.find(arr => arr.every(number => currentNumbers.includes(number)));
    if (horizontalWin) {
        return horizontalWin;
    }

    // Vertical win
    for (let i = 0; i < 5; i++) { // 5 loops
        const verticalRow = board.map(arr => arr[i]);
        if (verticalRow.every(number => currentNumbers.includes(number))) {
            return verticalRow;
        }
    }

    return null;
}