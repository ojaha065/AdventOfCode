import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

/**
 * <a href="https://adventofcode.com/2024/day/7">Day 7: Bridge Repair</a>
 */
public class Day7 {
    public static void main(final String[] args) throws IOException {
        final long startTime = System.currentTimeMillis();

        final List<Equation> equations = Files.readAllLines(Path.of("2024\\07\\input.txt"), StandardCharsets.UTF_8).stream()
            .map(line -> line.split(":\\s"))
            .map(line -> new Equation(
                    Long.parseLong(line[0]),
                    Arrays.stream(line[1].split("\\s"))
                        .map(Integer::parseInt)
                        .toArray(Integer[]::new)
                )
            ).toList();

        final char[] part1Operators = {'+', '*'};
        System.out.println("Part 1: " + equations.parallelStream()
            .mapToLong(equation -> getResultIfPossible(equation, part1Operators))
            .sum()
        );

        final char[] part2Operators = {'+', '*', '|'};
        System.out.println("Part 2: " + equations.parallelStream()
            .mapToLong(equation -> getResultIfPossible(equation, part2Operators))
            .sum()
        );

        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }

    private static Long getResultIfPossible(final Equation equation, final char[] operators) {
        final double permutations = Math.pow(operators.length, equation.values.length - 1);
        for (int i = 0; i < permutations; i++) {
            long result = equation.values[0];
            int count = i;

            for (int j = 0; j < equation.values.length - 1; j++) {
                // If the result is already larger than the expected one, we can short circuit here to save some time
                if (result > equation.result) {
                    break;
                }

                char operator = operators[count % operators.length];
                count /= operators.length;

                if (operator == '+') { result += equation.values[j + 1]; }
                else if (operator == '*') { result *= equation.values[j + 1]; }
                else if (operator == '|') { result = Long.parseLong(String.valueOf(result) + String.valueOf(equation.values[j + 1])); }
                else {
                    throw new RuntimeException("Unsupported operator " + operator);
                }
            }

            if (result == equation.result) {
                return result;
            }
        }

        return 0L;
    }

    private static record Equation(long result, Integer[] values) {}
}