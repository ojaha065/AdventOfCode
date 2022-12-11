import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Deque;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Day 11: Monkey in the Middle
 * https://adventofcode.com/2022/day/11
 */
public class Day11 {
    private static final Pattern MONKEY_PATTERN = Pattern.compile(
        "Monkey\\s\\d+:\\s*Starting items:\\s((?:\\d+,?\\s)+)\\s*Operation:\\snew\\s=\\sold\\s([*+])\\s(\\d+|old)\\s*Test:\\sdivisible\\sby\\s(\\d+)\\s*If\\strue:\\sthrow\\sto\\smonkey\\s(\\d+)\\s*If\\sfalse:\\sthrow\\sto\\smonkey\\s(\\d+)"
    );

    public static void main(final String[] args) throws IOException {
        System.out.println("Part 1: " + solve(false));
        System.out.println("Part 2: " + solve(true));
    }

    private static final long solve(final boolean partTwoRules) throws IOException {
        final Monkey[] monkeys = Arrays.stream(Files.readString(Path.of("2022\\11\\input")).split("\\n\\n")) // Split by empty line
            .map(String::strip)
            .map(Monkey::new)
            .toArray(Monkey[]::new);

        final long LCM = Arrays.stream(monkeys).mapToInt(monkey -> monkey.divisibleBy).reduce((a, b) -> a * b).orElseThrow();
        final int rounds = partTwoRules ? 10000 : 20;

        for (int round = 0; round < rounds; round++) {
            for (final Monkey monkey: monkeys) {
                while (!monkey.items.isEmpty()) {
                    long worry = monkey.items.pop();

                    // Operation
                    final long argument = monkey.operationArgument == -1 ? worry : monkey.operationArgument;
                    switch (monkey.operation) {
                        case '*' -> worry = worry * argument;
                        case '+' -> worry = worry + argument;
                        default -> throw new RuntimeException("Invalid operation " + monkey.operation);
                    }

                    // In part 1 divide by three as instructed
                    // In part 2 do some Modular arithmetic trickery to reduce the large number while still keeping the same divisibility
                    worry = partTwoRules ? (worry % LCM) : (worry / 3);

                    monkey.timesInspected++;

                    // Test and action
                    final int throwTo = (worry % monkey.divisibleBy == 0) ? monkey.ifTrueThrow : monkey.ifFalseThrow;
                    monkeys[throwTo].items.add(worry);
                }
            }
        }

        return Arrays.stream(monkeys)
            .mapToLong(monkey -> monkey.timesInspected)
            .boxed()
            .sorted(Comparator.reverseOrder())
            .limit(2)
            .reduce((a, b) -> a * b)
            .orElseThrow();
    }

    private static final class Monkey {
        public final Deque<Long> items;

        public final char operation;
        public final int operationArgument;

        public final int divisibleBy;

        public final int ifTrueThrow;
        public final int ifFalseThrow;

        public long timesInspected = 0;

        public Monkey(final String input) {
            final Matcher matcher = MONKEY_PATTERN.matcher(input);

            if (!matcher.matches()) {
                throw new RuntimeException("Invalid input " + input);
            }

            this.items = Arrays.stream(matcher.group(1).split(","))
                .map(String::strip)
                .map(Long::parseLong)
                .collect(Collectors.toCollection(ArrayDeque::new));

            this.operation = matcher.group(2).charAt(0);
            this.divisibleBy = Integer.parseInt(matcher.group(4));
            this.ifTrueThrow = Integer.parseInt(matcher.group(5));
            this.ifFalseThrow = Integer.parseInt(matcher.group(6));

            final String operationArgumentValue = matcher.group(3);
            this.operationArgument = operationArgumentValue.equals("old") ? -1 : Integer.parseInt(matcher.group(3));
        }
    }
}