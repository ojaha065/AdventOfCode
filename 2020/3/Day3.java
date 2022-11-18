import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

public class Day3 {
    public static void main(final String[] args) throws IOException {
        final Boolean[][] grid = Files.readAllLines(Paths.get(args[0])).stream()
            .map(row -> row.split(""))
            .map(arr -> Arrays.stream(arr).map(ch -> ch.equals("#")).toArray(Boolean[]::new))
            .toArray(Boolean[][]::new);
        
        System.out.println("Part 1: " + solve(3, 1, grid));

        final long part2 = solve(1, 1, grid)
            * solve(3, 1, grid)
            * solve(5, 1, grid)
            * solve(7, 1, grid)
            * solve(1, 2, grid);
        System.out.println("Part 2: " + part2);
    }

    private static long solve(final int right, final int down, final Boolean[][] grid) {
        final int height = grid.length;
        final int width = grid[0].length;

        int x = 0;
        int y = 0;
        long treeCounter = 0;

        while (true) {
            // Move
            x += right;
            y += down;

            // End after reaching the bottom
            if (y >= height) {
                break;
            }

            // Wrap around
            final int actualX = x < width ? x : x % width;

            // Check for tree
            if (grid[y][actualX]) {
                treeCounter++;
            }
        }

        return treeCounter;
    }
}