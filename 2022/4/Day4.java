import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Day 4: Camp Cleanup
 * https://adventofcode.com/2022/day/4
 */
public class Day4 {
    private static final Pattern ROW_PATTERN = Pattern.compile("(\\d+)-(\\d+),(\\d+)-(\\d+)");

    public static void main(final String[] args) throws IOException {
        final List<String> rows = Files.readAllLines(Path.of(args[0])).stream()
            .map(String::strip)
            .toList();

        System.out.println("Part 1: " + solve(rows, false));
        System.out.println("Part 2: " + solve(rows, true));
    }

    private static final long solve(final List<String> rows, final boolean part2Rules) {
        return rows.stream()
            .map(ROW_PATTERN::matcher)
            .filter(Matcher::matches)
            .map(matcher -> IntStream.rangeClosed(1, 4)
                .mapToObj(matcher::group)
                .map(Integer::parseInt)
                .toArray(Integer[]::new))
            .filter(ranges -> {
                final Set<Integer> first = IntStream.rangeClosed(ranges[0], ranges[1]).boxed().collect(Collectors.toSet());
                final Set<Integer> second = IntStream.rangeClosed(ranges[2], ranges[3]).boxed().collect(Collectors.toSet());

                if (part2Rules) {
                    return first.stream().anyMatch(second::contains) || second.stream().anyMatch(first::contains);
                }
                return first.stream().allMatch(second::contains) || second.stream().allMatch(first::contains);
            }).count();
    }
}