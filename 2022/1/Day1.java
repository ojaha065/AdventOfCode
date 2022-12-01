import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Day 1: Calorie Counting
 * https://adventofcode.com/2022/day/1
 */
public class Day1 {
    public static void main(final String[] args) throws IOException {
        final String[] rows = Files.readAllLines(Path.of(args[0])).stream()
            .map(String::strip)
            .toArray(String[]::new);

        final List<Integer> results = new ArrayList<>();

        int currentTotal = 0;
        for (final String row : rows) {
            if (row.isEmpty()) {
                results.add(currentTotal);
                currentTotal = 0;
                continue;
            }

            currentTotal += Integer.parseInt(row);
        }

        results.sort(Comparator.reverseOrder());

        System.out.println("Part 1: " + results.get(0));
        System.out.println("Part 2: " + (results.get(0) + results.get(1) + results.get(2)));
    }
}