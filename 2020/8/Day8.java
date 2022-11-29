import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Set;

/**
 * Day 8: Handheld Halting
 * https://adventofcode.com/2020/day/8
 */
public class Day8 {
    public static void main(final String[] args) throws IOException {
        final String[] instructions = Files.readAllLines(Path.of("C:\\Users\\Jani\\Desktop\\AdventOfCode\\2020\\8\\input"))
            .toArray(new String[0]);

        System.out.println("Part 1: " + getResult(instructions).accumulatorResult);

        for (int i = 0; i < instructions.length; i++) {
            final String originalValue = instructions[i];

            if (originalValue.contains("jmp")) {
                instructions[i] = originalValue.replace("jmp", "nop");
            } else if (originalValue.contains("nop")) {
                instructions[i] = originalValue.replace("nop", "jmp");
            } else {
                continue;
            }

            final Result result = getResult(instructions);
            if (!result.isLoop) {
                System.out.println("Part 2: " + result.accumulatorResult);
                break;
            }

            instructions[i] = originalValue;
        }
    }

    private static final Result getResult(final String[] instructions) {
        int cursor = 0;
        int accumulator = 0;
        final Set<Integer> visited = new HashSet<>();

        while (true) {
            if (cursor >= instructions.length) {
                return new Result(false, accumulator);
            }

            final String[] split = instructions[cursor].split(" ");
            final String operation = split[0];
            final int argument = Integer.parseInt(split[1]);

            if (visited.contains(cursor)) {
                return new Result(true, accumulator);
            }

            visited.add(cursor);

            // acc
            if (operation.equals("acc")) {
                accumulator += argument;
                cursor++;
            }

            // jmp
            else if (operation.equals("jmp")) {
                cursor += argument;
            }

            // nop
            else if (operation.equals("nop")) {
                cursor++;
            }

            else {
                throw new RuntimeException("Invalid operation " + operation);
            }
        }
    }

    private static class Result {
        public boolean isLoop;
        public int accumulatorResult;

        public Result(final boolean isLoop, final int accumulatorResult) {
            this.isLoop = isLoop;
            this.accumulatorResult = accumulatorResult;
        }
    }
}