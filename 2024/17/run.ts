/**
 * Day 17: Chronospatial Computer
 * https://adventofcode.com/2024/day/17
 */

console.time("Run time");

import fs from "fs";

const input = /^Register\sA:\s(\d+)[\r\n]+Register\sB:\s(\d+)[\r\n]+Register\sC:\s(\d+)[\r\n]+Program:\s([\d,]+)[\r\n]*$/
    .exec(fs.readFileSync("./17/input.txt", "utf-8"));
if (!input) { throw new Error("Failed to read input!"); }

const inputA: number = parseInt(input[1]);
const inputB: number = parseInt(input[2]);
const inputC: number = parseInt(input[3]);
const inputProgram: number[] = input[4].split(",").map(s => parseInt(s));

// For part 2 we need to use BigInt
const bigB = BigInt(inputB);
const bigC = BigInt(inputC);

console.info("Part 1: " + run(BigInt(inputA), bigB, bigC, inputProgram));

// Part 2
const expected = inputProgram.join(",");
let newA: bigint = 8n;
while (true) {
    const result = run(newA, bigB, bigC, inputProgram);

    if (result === expected) {
        console.info("Part 2: " + newA);
        break;
    }

    if (expected.endsWith(result)) {
        newA *= 8n;
    } else {
        newA++;
    }
}

console.timeEnd("Run time");

function run(A: bigint, B: bigint, C: bigint, program: number[]): string {
    let output: string[] = [];
    let pointer: number = 0;

    while (pointer < program.length) {
        const operand = program[pointer + 1];

        switch (program[pointer]) {
            case 0: // adv
                A /= 2n ** toComboOperand(operand);
                break;
            case 1: // bxl
                B ^= BigInt(operand);
                break;
            case 2: // bst
                B = toComboOperand(operand) % 8n;
                break;
            case 3: // jnz
                if (A !== 0n) {
                    pointer = operand;
                    continue; // while
                }
                break;
            case 4: // bxc
                B ^= C;
                break;
            case 5: // out
                output.push((toComboOperand(operand) % 8n).toString());
                break;
            case 6: // bdv
                B = A / (2n ** toComboOperand(operand));
                break;
            case 7: // cdv
                C = A / (2n ** toComboOperand(operand));
                break;
            default: throw new Error("Something went wrong!");
        }

        pointer += 2;
    }

    return output.join(",");

    function toComboOperand(operand: number): bigint {
        switch (operand) {
            case 0:
            case 1:
            case 2:
            case 3: return BigInt(operand);
            case 4: return A;
            case 5: return B;
            case 6: return C;
            default: throw new Error("Invalid combo operand " + operand);
        }
    }
}