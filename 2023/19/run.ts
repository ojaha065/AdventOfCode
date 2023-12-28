/**
 * Day 19: Aplenty
 * https://adventofcode.com/2023/day/19
 * Part 1
 */

console.time("Run time");

import fs from "fs";

class Workflow {
    public name: string;
    public rules: ((part: Part) => boolean | string | undefined)[];
    public fallback: string;

    private static WORKFLOW_PATTERN = /^(\w+){((?:[xmas][<>]\d+:\w+,?)+)(\w+)}$/;
    private static RULE_PATTERN = /([xmas])([<>])(\d+):(\w+)/g;

    constructor (input: string) {
        const matcher = Workflow.WORKFLOW_PATTERN.exec(input);
        if (!matcher) {
            throw new Error(`Could not parse input "${input}"`);
        }

        this.name = matcher[1];
        this.rules = Array.from(matcher[2].matchAll(Workflow.RULE_PATTERN)).map(groups => ((part: Part) => {
            const ruleValue = parseInt(groups[3]);

            if (groups[2] === "<" && part[groups[1] as keyof Part] < ruleValue) {
                if (groups[4] === "A" || groups[4] === "R") {
                    return groups[4] === "A";
                }
                return groups[4];
            }

            if (groups[2] === ">" && part[groups[1] as keyof Part] > ruleValue) {
                if (groups[4] === "A" || groups[4] === "R") {
                    return groups[4] === "A";
                }
                return groups[4];
            }

            return undefined;
        }));
        this.fallback = matcher[3];
    }
}

class Part {
    public x: number;
    public m: number;
    public a: number;
    public s: number;

    private static PART_PATTERN = /^{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}$/;

    constructor (input: string) {
        const matcher = Part.PART_PATTERN.exec(input);
        if (!matcher) {
            throw new Error(`Could not parse input "${input}"`);
        }

        this.x = parseInt(matcher[1]);
        this.m = parseInt(matcher[2]);
        this.a = parseInt(matcher[3]);
        this.s = parseInt(matcher[4]);
    }
}

const inputSplit = fs.readFileSync("./19/input.txt", "utf-8")
    .split(/[\r\n]{4,}/)
    .map(arr => arr
        .split(/[\r\n]+/)
        .map(row => row.trim())
        .filter(Boolean)
    );

const workflows = inputSplit[0].map(row => new Workflow(row));
const parts = inputSplit[1].map(row => new Part(row));

const inWorkflow = workflows.find(wf => wf.name === "in");
if (!inWorkflow) {
    throw new Error("Workflow with name \"in\" must exist! Parsing error?");
}

// Part 1
console.info("Part 1: " + parts.filter(part => {
    let currentWorkflow: Workflow = inWorkflow;
    while (true) {
        let ruleMatched = false;
        for (const rule of currentWorkflow.rules) {
            const result = rule.call(null, part);
            switch (typeof result) {
                case "string": currentWorkflow = workflows.find(wf => wf.name === result) || new Workflow(`Workflow not found: ${result}`); break;
                case "boolean": return result;
                case "undefined": continue; // Continue to the next rule
                default: throw new Error(`Unexpected value "${result}"`);
            }

            ruleMatched = true;
            break; // Stop looping rules as we wound a match
        }

        // Use the last rule
        if (!ruleMatched) {
            if (currentWorkflow.fallback === "A" || currentWorkflow.fallback === "R") {
                return currentWorkflow.fallback === "A";
            }
            currentWorkflow = workflows.find(wf => wf.name === currentWorkflow.fallback) || new Workflow(`Workflow not found: ${currentWorkflow.fallback}`);
        }
    }
    }).flatMap(part => [part.x, part.m, part.a, part.s]).reduce((a, b) => a + b, 0));

console.timeEnd("Run time");