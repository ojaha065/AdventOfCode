import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.regex.MatchResult;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * <a href="https://adventofcode.com/2024/day/3">Day 3: Mull It Over</a>
 */
public class Day03 {
    private static final Pattern MUL_PATTERN = Pattern.compile("mul\\((\\d{1,3}),(\\d{1,3})\\)");
    private static final Pattern INSTRUCTION_PATTERN = Pattern.compile("do(?:n't)?\\(\\)");
    
    public static void main(final String[] args) throws IOException {
        final long startTime = System.currentTimeMillis();

        final String input = Files.readString(Path.of("2024\\03\\input.txt"), StandardCharsets.UTF_8);

        System.out.println("Part 1: " + solve(input));

        // Get all instructions to a queue
        final Queue<String> instructions = INSTRUCTION_PATTERN.matcher(input).results()
            .map(MatchResult::group)
            .collect(Collectors.toCollection(ArrayDeque::new));
        
        long part2Result = 0L;
        boolean enabled = true;
        for (final String part : INSTRUCTION_PATTERN.split(input)) {
            if (enabled) {
                part2Result += solve(part);
            }
            enabled = "do()".equals(instructions.poll());
        }
        System.out.println("Part 2: " + part2Result);

        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }

    private static long solve(final String input) {
        return MUL_PATTERN.matcher(input).results()
            .reduce(
                0L,
                (sum, result) -> sum + Math.multiplyFull(Integer.parseInt(result.group(1)), Integer.parseInt(result.group(2))),
                Long::sum
            );
    }
}