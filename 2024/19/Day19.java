import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

/**
 * <a href="https://adventofcode.com/2024/day/19">Day 19: Linen Layout</a>
 */
public class Day19 {
    public static void main(final String[] _args) throws IOException {
        final long startTime = System.currentTimeMillis();

        final List<String> input = Files.readAllLines(Path.of("2024\\19\\input.txt"), StandardCharsets.UTF_8);
        final Set<String> patterns = new HashSet<>(Arrays.asList(input.get(0).split(",\\s")));
        final List<String> designs = input.subList(2, input.size());

        final List<String> canBeMade = designs.parallelStream()
            .filter(design -> canMakeDesign(design, patterns))
            .toList();
        System.out.println("Part 1: " + canBeMade.size());

        System.out.println("Part 2: " + canBeMade.parallelStream()
            .mapToLong(design -> countWays(design, patterns))
            .sum()
        );

        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }

    private static boolean canMakeDesign(final String design, final Set<String> patterns) {
        final int designLength = design.length();
        final boolean[] canMake = new boolean[designLength + 1];
        canMake[0] = true; // Design is never empty, so this is just for initialization

        for (int i = 1; i <= designLength; i++) {
            for (final String pattern : patterns) {
                final int patternLength = pattern.length();
                if (i >= patternLength && canMake[i - patternLength] && design.substring(i - patternLength, i).equals(pattern)) {
                    canMake[i] = true;
                    break; // Skip the rest of the patterns
                }
            }
        }

        return canMake[designLength];
    }

    public static long countWays(final String design, final Set<String> patterns) {
        final int designLength = design.length();
        final long[] ways = new long[designLength + 1];
        ways[0] = 1; // Design is never empty, so this is just for initialization

        for (int i = 1; i <= designLength; i++) {
            for (final String pattern : patterns) {
                final int patternLength = pattern.length();
                if (i >= patternLength && design.substring(i - patternLength, i).equals(pattern)) {
                    ways[i] += ways[i - patternLength];
                }
            }
        }

        return ways[designLength];
    }
}
