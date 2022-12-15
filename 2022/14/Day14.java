import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Day 14: Regolith Reservoir
 * https://adventofcode.com/2022/day/14
 */
public class Day14 {
    public static void main(final String[] args) throws IOException {
        final String[] rows = Files.readAllLines(Path.of("2022\\14\\input")).stream()
            .map(String::strip)
            .filter(row -> !row.isBlank())
            .toArray(String[]::new);

        System.out.println("Part 1: " + sandFall(getGrid(rows, false)));
        System.out.println("Part 2: " + sandFall(getGrid(rows, true)));

    }

    private static final List<List<Character>> getGrid(final String[] rows, final boolean part2Rules) {
        final List<List<Character>> grid = IntStream.range(0, 200) // 200 high
            .mapToObj(_i -> new ArrayList<>(Collections.nCopies(1000, '.'))) // 1000 wide
            .collect(Collectors.toCollection(ArrayList::new));

            int floorLevel = -1; // For part 2
            for (final String row : rows) {
                final String[] coords = Arrays.stream(row.split("->")).map(String::strip).toArray(String[]::new);
    
                Integer[] currentXY = null;
                for (final String coord : coords) {
                    final Integer[] xy = Arrays.stream(coord.split(",")).map(Integer::parseInt).toArray(Integer[]::new);
    
                    if (currentXY != null) {
                        if (xy[0].equals(currentXY[0])) {
                            // Y is different
                            IntStream.rangeClosed(Math.min(currentXY[1], xy[1]), Math.max(currentXY[1], xy[1]))
                                .forEach(i -> grid.get(i).set(xy[0], '#'));
                        } else {
                            // X is different
                            IntStream.rangeClosed(Math.min(currentXY[0], xy[0]), Math.max(currentXY[0], xy[0]))
                                .forEach(i -> grid.get(xy[1]).set(i, '#'));
                        }
                    }
    
                    currentXY = xy;
    
                    if (xy[1] > floorLevel) {
                        floorLevel = xy[1];
                    }
                }
            }

            // Add new floor for part 2
            if (part2Rules) {
                grid.set(floorLevel + 2, new ArrayList<>(Collections.nCopies(grid.get(floorLevel + 2).size(), '#')));
            }

            return grid;
    }

    private static final int sandFall(final List<List<Character>> grid) {
        int result = 0;
        while (true) {
            // The sand is pouring into the cave from point 500,0.
            int currentX = 500;
            int currentY = 0;
            while (true) {
                // Part 1 end
                if (currentY >= grid.size() - 2) {
                    return result;
                }

                // First, tries to move down
                if (grid.get(currentY + 1).get(currentX) == '.') {
                    currentY++;
                }

                // If not possible, tries to move down and left
                else if (grid.get(currentY + 1).get(currentX - 1) == '.') {
                    currentY++;
                    currentX--;
                }

                // If not possible, tries to move down and right
                else if (grid.get(currentY + 1).get(currentX + 1) == '.') {
                    currentY++;
                    currentX++;
                }

                // Otherwise comes to rest
                else {
                    grid.get(currentY).set(currentX, '+');
                    result++;

                    // Part 2 end
                    if (currentX == 500 && currentY == 0) {
                        return result;
                    }

                    break;
                }
            }
        }
    }
}