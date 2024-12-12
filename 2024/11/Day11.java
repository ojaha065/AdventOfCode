import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * <a href="https://adventofcode.com/2024/day/11">Day 11: Plutonian Pebbles</a>
 */
public class Day11 {
    private static final Map<Long, List<Long>> MEMORY = new HashMap<>();

    public static void main(final String[] _args) throws IOException {
        final long startTime = System.currentTimeMillis();

        Map<Long, Long> stones = Arrays.stream(Files.readString(Path.of("2024\\11\\input.txt"), StandardCharsets.UTF_8).split("\\s+"))
            .map(Long::parseLong)
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        for (int i = 0; i < 75; i++) {
            if (i == 25) {
                System.out.println("Part 1: " + stones.values().stream().mapToLong(l -> l).sum());
            }

            final Map<Long, Long> newState = new HashMap<>();
            for (final var stone : stones.entrySet()) {
                handleStone(stone.getKey()).forEach(newStone -> newState.compute(newStone, (_k, v) -> v == null ? stone.getValue() : v + stone.getValue()));
            }
            stones = newState;
        }
        System.out.println("Part 2: " + stones.values().stream().mapToLong(l -> l).sum());
        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }

    private static List<Long> handleStone(final Long stone) {
        return MEMORY.computeIfAbsent(stone, s -> {
            if (s == 0) {
                return List.of(1L);
            }
    
            final String string = s.toString();
            if (string.length() % 2 == 0) {
                final int mid = string.length() / 2;
                return List.of(Long.parseLong(string.substring(0, mid)), Long.parseLong(string.substring(mid)));
            }
    
            return List.of(s * 2024L);
        });
    }
}
