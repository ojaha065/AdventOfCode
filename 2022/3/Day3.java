import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Day 3: Rucksack Reorganization
 * https://adventofcode.com/2022/day/3
 */
public class Day3 {
    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyz" + "abcdefghijklmnopqrstuvwxyz".toUpperCase();

    public static void main(final String[] args) throws IOException {
        final List<String> rows = Files.readAllLines(Path.of(args[0]));

        System.out.println("Part 1: " + rows.stream()
            .map(row -> new String[]{ row.substring(0, row.length() / 2), row.substring(row.length() / 2) })
            .map(pair -> {
                for (final char ch : pair[0].toCharArray()) {
                    if (pair[1].indexOf(ch) > -1) {
                        return ch;
                    }
                }

                throw new RuntimeException("No common char!");
            }).mapToInt(ALPHABET::indexOf).map(i -> i + 1).sum()
        );

        // Part 2
        int turtle = 0;
        int result = 0;
        while (turtle < rows.size()) {
            final String[] group = { rows.get(turtle), rows.get(turtle + 1), rows.get(turtle + 2) };
            for (final char ch : group[0].toCharArray()) {
                if (group[1].indexOf(ch) > -1 && group[2].indexOf(ch) > -1) {
                    result += ALPHABET.indexOf(ch) + 1;
                    break;
                }
            }
            turtle += 3;
        }
        System.out.println("Part 2: " + result);
    }
}