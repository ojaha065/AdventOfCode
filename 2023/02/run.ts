console.time("Run time");

import fs from "fs";

class Game {
    readonly id: number;
    readonly sets: Record<Color, number>[];

    constructor(gameString: string) {
        const gameStringSplit = gameString.split(":");

        this.id = parseInt(gameStringSplit[0].split(/\s/)[1]);
        this.sets = gameStringSplit[1].split(";").map(group => {
            const split = group.split(",");
            const result: Record<Color, number> = {[Color.red]: 0, [Color.green]: 0, [Color.blue]: 0};

            split.forEach(cube => {
                const cubeSplit = cube.trim().split(/\s/);
                result[Color[cubeSplit[1] as keyof typeof Color]] = parseInt(cubeSplit[0]);
            });
            
            return result;
        });
    }

    isPossibleWith(bagContents: Record<Color, number>): boolean {
        return this.sets.every(set => [Color.red, Color.green, Color.blue].every(color => bagContents[color] >= set[color]));

    }

    get requiredPower(): number {
        return [Color.red, Color.green, Color.blue]
            .map(color => Math.max(...this.sets.map(set => set[color])))
            .reduce(Math.imul);
    }
}

enum Color {
    red = "red",
    green = "green",
    blue = "blue"
}

const games = fs.readFileSync("./02/input", "utf-8")
    .split("\r\n")
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => new Game(row));

// Part 1
console.info("Part 1: " + games.filter(game => game.isPossibleWith({ [Color.red]: 12, [Color.green]: 13, [Color.blue]: 14 }))
    .map(game => game.id)
    .reduce((a, b) => a + b, 0)
);

// Part 2
console.info("Part 2: " + games.map(game => game.requiredPower).reduce((a, b) => a + b, 0));

console.timeEnd("Run time"); // ~3ms