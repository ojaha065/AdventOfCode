import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.IntStream;

/**
 * Day 10: Cathode-Ray Tube
 * https://adventofcode.com/2022/day/10
 */
public class Day10 {
    private static int cycle = 0;
    private static int row = 0;
    private static int x = 1;

    private static int part1Result = 0;
    private static StringBuilder part2Result = new StringBuilder();

    public static void main(final String[] args) throws IOException {
        final String[] rows = Files.readAllLines(Path.of("2022\\10\\input")).stream()
            .map(String::strip)
            .toArray(String[]::new);

        for (final String row : rows) {
            if (doCycle()) {break;}

            if (row.startsWith("addx")) {
                if (doCycle()) {break;}
                x += Integer.parseInt(row.split("\s")[1]);
            }
        }

        System.out.println("Part 1: " + part1Result);
        System.out.println(part2Result.toString());
    }

    private static final boolean doCycle() {
        cycle++;

        if (IntStream.of(20, 60, 100, 140, 180, 220).anyMatch(i -> i == cycle)) {
            part1Result += cycle * x;
        }

        final int pos = cycle - (row * 40) - 1; // Minus 1 as cycles are 1-indexed, while x is zero indexed
        part2Result.append(pos >= x - 1 && pos <= x + 1 ? "#" : " ");

        if (IntStream.of(40, 80, 120, 160, 200, 240).anyMatch(i -> i == cycle)) {
            part2Result.append("\n\r");
            row++;
        }

        return cycle == 240;
    }
}