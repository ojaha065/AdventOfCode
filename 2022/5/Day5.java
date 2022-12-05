import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Day 5: Supply Stacks
 * https://adventofcode.com/2022/day/5
 */
public class Day5 {
    private static final Pattern INITIAL_STATE_PATTERN = Pattern.compile("(?:\\[([A-Z])]|\\s{3})\\s?");
    private static final Pattern PROCEDURE_PATTERN = Pattern.compile("move\\s(\\d+)\\sfrom\\s(\\d)\\sto\\s(\\d)");

    public static void main(final String[] args) throws IOException {
        final String[] rows = Files.readAllLines(Path.of("2022\\5\\input")).stream()
            .filter(row -> !row.isBlank())
            .toArray(String[]::new);

        System.out.println("Part 1: " + solve(rows, false));
        System.out.println("Part 2: " + solve(rows, true));
    }

    private static final String solve(final String[] rows, final boolean partTwoRules) {
        final var stacks = IntStream.range(0, 9)
            .mapToObj(i -> new ArrayDeque<Character>())
            .toList();

        for (final String row : rows) {
            final Matcher initialStateMatcher = INITIAL_STATE_PATTERN.matcher(row);
            final Matcher procedureMatcher = PROCEDURE_PATTERN.matcher(row);

            if (initialStateMatcher.find()) {
                final MatchResult[] results = initialStateMatcher.reset().results().toArray(MatchResult[]::new);
                for (int i = 0; i < results.length; i++) {
                    final String group = results[i].group(1);
                    if (group != null) { // Group is null when only whitespace is matched
                        stacks.get(i).add(group.charAt(0));
                    }
                }
            }

            else if (procedureMatcher.matches()) {
                // move {count} from {from} to {to}
                final int count = Integer.parseInt(procedureMatcher.group(1));
                final int from = Integer.parseInt(procedureMatcher.group(2)) - 1;
                final int to = Integer.parseInt(procedureMatcher.group(3)) - 1;

                if (partTwoRules) {
                    final Deque<Character> temp = new ArrayDeque<>();
                    for (int i = 0; i < count; i++) {
                        temp.push(stacks.get(from).pop());
                    }
                    for (final char ch : temp) {
                        stacks.get(to).push(ch);
                    }
                } else {
                    for (int i = 0; i < count; i++) {
                        stacks.get(to).push(stacks.get(from).pop());
                    }
                }
            }
        }

        return stacks.stream()
            .filter(stack -> !stack.isEmpty())
            .map(stack -> stack.getFirst())
            .map(Object::toString)
            .collect(Collectors.joining(""));
    }
}