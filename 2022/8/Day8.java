import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Day 8: Treetop Tree House
 * https://adventofcode.com/2022/day/8
 */
public class Day8 {
    public static void main(final String[] args) throws IOException {
        final int[][] grid = Files.readAllLines(Path.of("2022\\8\\input")).stream()
            .map(String::strip)
            .map(String::chars)
            .map(stream -> stream
                .map(Character::getNumericValue)
                .toArray())
            .toArray(int[][]::new);

        int visibleCount = 0;
        int maxScore = -1;
        for (int row = 0; row < grid.length; row++) {
            for (int column = 0; column < grid[row].length; column++) {
                if (isVisible(grid, row, column)) {
                    visibleCount++;
                }

                final int score = getScenicScore(grid, row, column);
                if (score > maxScore) {
                    maxScore = score;
                }
            }
        }

        System.out.println("Part 1: " + visibleCount);
        System.out.println("Part 2: " + maxScore);
    }

    private static final boolean isVisible(final int[][] grid, final int row, final int column) {
        // Trees on on edge are always visible
        if (row == 0 || column == 0 || row == grid.length - 1 || column == grid[row].length - 1) {
            return true;
        }

        final int currentTree = grid[row][column];

        // up
        for (int turtle = row - 1; true; turtle--) {
            if (turtle < 0) {
                return true;
            }
            if (grid[turtle][column] >= currentTree) {
                break; // Not visible
            }
        }

        // down
        for (int turtle = row + 1; true; turtle++) {
            if (turtle >= grid.length) {
                return true;
            }
            if (grid[turtle][column] >= currentTree) {
                break; // Not visible
            }
        }

        // left
        for (int turtle = column - 1; true; turtle--) {
            if (turtle < 0) {
                return true;
            }
            if (grid[row][turtle] >= currentTree) {
                break; // Not visible
            }
        }

        // right
        for (int turtle = column + 1; true; turtle++) {
            if (turtle >= grid[row].length) {
                return true;
            }
            if (grid[row][turtle] >= currentTree) {
                break; // Not visible
            }
        }

        return false;
    }

    private static final int getScenicScore(final int[][] grid, final int row, final int column) {
        // Optimization: Trees on on edge always score zero
        if (row == 0 || column == 0 || row == grid.length - 1 || column == grid[row].length - 1) {
            return 0;
        }

        final int currentTree = grid[row][column];

        int result = 1;

        // up
        int distance = 0;
        for (int turtle = row - 1; true; turtle--) {
            if (turtle < 0) {
                break;
            }

            distance++;

            if (grid[turtle][column] >= currentTree) {
                break;
            }
        }
        result *= distance;

        // down
        distance = 0;
        for (int turtle = row + 1; true; turtle++) {
            if (turtle >= grid.length) {
                break;
            }

            distance++;

            if (grid[turtle][column] >= currentTree) {
                break;
            }
        }
        result *= distance;

        // left
        distance = 0;
        for (int turtle = column - 1; true; turtle--) {
            if (turtle < 0) {
                break;
            }

            distance++;

            if (grid[row][turtle] >= currentTree) {
                break;
            }
        }
        result *= distance;

        // right
        distance = 0;
        for (int turtle = column + 1; true; turtle++) {
            if (turtle >= grid[row].length) {
                break;
            }

            distance++;

            if (grid[row][turtle] >= currentTree) {
                break;
            }
        }
        result *= distance;

        return result;
    }
}