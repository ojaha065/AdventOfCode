import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Day 6: Tuning Trouble
 * https://adventofcode.com/2022/day/6
 */
public class Day6{
    public static void main(final String[] args) throws IOException {
        final char[] input = Files.readString(Path.of("2022\\6\\input")).toCharArray();

        System.out.println("Part 1: " + solve(input, 4));
        System.out.println("Part 2: " + solve(input, 14));
    }

    final static int solve(final char[] input, final int requiredDistinct) {
        for (int i = requiredDistinct; i < input.length; i++) {
            final var distinct = IntStream.range(i - requiredDistinct, i) // When i == 4 and requiredDistinct == 4 -> 0,1,2,3
                .map(j -> input[j])
                .boxed()
                .collect(Collectors.toCollection(HashSet::new));

            if (distinct.size() >= requiredDistinct) {
                return i;
            }
        }

        throw new RuntimeException("Could not find solution!");
    }
}