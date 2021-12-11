# Day eleven: Dumbo Octopus

Another day, another 2D array. Initially, I increased the value by one **and** calculated the possible flashes in a single for-loop. That did not yield proper results as the puzzle instructions specially say that the each value increases first and flashes are calculated only after every value has been increased. Also came up with a much cleaner one-liner for checking if coordinates are out of the grid than the one I used in the flood fill algorithm of [day nine](../9/app.js).

## The puzzle

There are 100 octopuses arranged neatly in a 10 by 10 grid. Each octopus slowly gains energy over time and flashes brightly for a moment when its energy is full. The energy level of each octopus is a value between 0 and 9.

You can model the energy levels and flashes of light in steps. During a single step, the following occurs:

1. First, the energy level of each octopus increases by 1.
2. Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, it also flashes. This process continues as long as new octopuses keep having their energy level increased beyond 9. (An octopus can only flash at most once per step.)
3. Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.

Part 1: How many total flashes are there after 100 steps?

Part 2: What is the first step during which all octopuses flash?