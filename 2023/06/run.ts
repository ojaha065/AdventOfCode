/**
 * Day 6: Wait For It
 * https://adventofcode.com/2023/day/6
 */

console.time("Run time");

/**
 * [Time, Distance]
 */
const data: number[][] = [
    [7, 9],
    [15, 40],
    [30, 200]
];

console.info("Part 1: " + data
    .map(arr => {
        const [time, distance] = arr;
        
        let result = 0;
        for (let t = 1; t < time; t++) {
            if (x(t, time) > distance) {
                result++;
            }
        }

        return result;
    }).reduce(Math.imul)
);

// Part 2
const combinedTime = parseInt(data.map(arr => arr[0].toString()).join(""));
const combinedDistance = parseInt(data.map(arr => arr[1].toString()).join(""));

let result = 0;
for (let t = 1; t < combinedTime; t++) {
    if (x(t, combinedTime) > combinedDistance) {
        result++;
    }
}
console.log("Part 2: " + result);

console.timeEnd("Run time");

/**
 * Calculates the distance traveled
 * @param t Duration the button is held down
 * @param d Duration of the race
 * @returns x, The distance traveled
 */
function x(t: number, d: number): number {
    return t * (d - t);
}