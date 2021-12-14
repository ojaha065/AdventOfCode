"use strict";

const fs = require("fs");

class PairInsertionRule {
    rule;
    elementToInsert;

    constructor(rule, elementToInsert) {
        this.rule = rule;
        this.elementToInsert = elementToInsert;
    }
}

const rows = fs.readFileSync("./inputTest", "UTF-8")
    .trim()
    .split("\n")
    .map(row => row.trim().replace("\r", ""))
    .filter(Boolean); // Removes empty rows

const template = rows.shift();
const rules = rows.map(row => row.split("->").map(s => s.trim()))
    .map(arr => new PairInsertionRule(...arr));
//console.debug(template, rules);

// The template string gets way too long to keep track of,
// so we keep track of different pairs instead
const pairs = {};

// Also need to keep track of individual letters as that's used for calculating the actual puzzle answer
const characterCounts = {};

const templateChars = template.split("");
for (let i = 0; i < templateChars.length; i++) {
    characterCounts[templateChars[i]] = characterCounts[templateChars[i]] + 1 || 1;

    if (templateChars[i + 1]) {
        const pair = `${templateChars[i]}${templateChars[i + 1]}`;
        pairs[pair] = pairs[pair] + 1 || 1;
    }
}
//console.debug(pairs, characterCounts);

// Then we just start looping
for (let loop = 0; loop < 40; loop++) {
    // We don't want to take pairs added this step into account...
    const newPairs = {};

    rules.forEach(rule => {
        if (pairs[rule.rule]) { // If this pair is currently present
            const letters = rule.rule.split("");
            const firstNewPair = `${letters[0]}${rule.elementToInsert}`;
            const secondNewPair = `${rule.elementToInsert}${letters[1]}`;

            newPairs[firstNewPair] = newPairs[firstNewPair] + pairs[rule.rule] || pairs[rule.rule];
            newPairs[secondNewPair] = newPairs[secondNewPair] + pairs[rule.rule] || pairs[rule.rule];

            characterCounts[rule.elementToInsert] = characterCounts[rule.elementToInsert] + pairs[rule.rule] || pairs[rule.rule];
            pairs[rule.rule] = 0; // All current instances of this pair are replaced
        }
    });

    // ...so we copy them over only after every rule has been handled
    Object.entries(newPairs).forEach(entry => pairs[entry[0]] = pairs[entry[0]] + entry[1] || entry[1]);

    if (loop === 9) {
        const letterCounts = Object.values(characterCounts).sort((a,b) => a - b);
        console.log(`Part 1 (10 steps): ${letterCounts.pop() - letterCounts.shift()}`);
    }
}

const letterCounts = Object.values(characterCounts).sort((a,b) => a - b);
console.log(`Part 2 (40 steps): ${letterCounts.pop() - letterCounts.shift()}`);