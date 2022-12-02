import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * Day 2: Rock Paper Scissors
 * https://adventofcode.com/2022/day/2
 */
public class Day2 {
    public static void main(final String[] args) throws IOException {
        final List<String> rows = Files.readAllLines(Path.of(args[0]))
            .stream()
            .map(String::strip)
            .filter(s -> !s.isEmpty())
            .toList();

        // <shape + outcome>
        final Map<String, Integer> part1Rules = Map.ofEntries(
            Map.entry("A X", 1 + 3),
            Map.entry("A Y", 2 + 6),
            Map.entry("A Z", 3 + 0),

            Map.entry("B X", 1 + 0),
            Map.entry("B Y", 2 + 3),
            Map.entry("B Z", 3 + 6),

            Map.entry("C X", 1 + 6),
            Map.entry("C Y", 2 + 0),
            Map.entry("C Z", 3 + 3)
        );

        // <outcome + shape>
        final Map<String, Integer> part2Rules = Map.ofEntries(
            Map.entry("A X", 0 + 3),
            Map.entry("A Y", 3 + 1),
            Map.entry("A Z", 6 + 2),

            Map.entry("B X", 0 + 1),
            Map.entry("B Y", 3 + 2),
            Map.entry("B Z", 6 + 3),

            Map.entry("C X", 0 + 2),
            Map.entry("C Y", 3 + 3),
            Map.entry("C Z", 6 + 1)
        );

        System.out.println("Part 1: " + solve(rows, part1Rules));
        System.out.println("Part 2: " + solve(rows, part2Rules));
    }

    private static final int solve(final List<String> rows, final Map<String, Integer> lookupTable) {
        return rows.stream().mapToInt(lookupTable::get).sum();
    }
}