import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * <a href="https://adventofcode.com/2024/day/5">Day 5: Print Queue</a>
 */
public class Day05 {
    private static final Random random = new Random();

    public static void main(final String[] args) throws IOException {
        final long startTime = System.currentTimeMillis();

        final String input = Files.readString(Path.of("2024\\05\\input.txt"), StandardCharsets.UTF_8);
        final String[] inputSplit = input.split("[\r\n]{4,}");

        final List<PageOrderingRule> rules = Arrays.stream(inputSplit[0].split("[\r\n]+"))
            .map(row -> row.split("\\|"))
            .map(row -> new PageOrderingRule(Integer.parseInt(row[0]), Integer.parseInt(row[1])))
            .toList();

        final List<ArrayList<Integer>> updates = Arrays.stream(inputSplit[1].split("[\r\n]+"))
            .map(row -> row.split(","))
            .map(row -> Arrays.stream(row).map(Integer::parseInt).collect(Collectors.toCollection(ArrayList::new)))
            .toList();

        System.out.println("Part 1: " + updates.stream()
            .filter(update -> validate(update, rules).isEmpty())
            .mapToInt(update -> update.get(update.size() / 2))
            .sum()
        );

        System.out.println("Part 2: " + updates.stream()
            .filter(update -> !validate(update, rules).isEmpty())
            .map(update -> fixOrder(update, rules))
            .mapToInt(update -> update.get(update.size() / 2))
            .sum()
        );

        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }

    /**
     * @return Set of locations / indexes of invalid integers
     */
    private static Set<Integer> validate(final List<Integer> update, final List<PageOrderingRule> rules) {
        final Set<Integer> invalidIndexes = new HashSet<>();

        for (int i = 0; i < update.size(); i++) {
            final Integer integer = update.get(i);
            for (final PageOrderingRule rule : rules) {
                if (rule.x == integer && update.contains(rule.y) && i > update.indexOf(rule.y)) {
                    invalidIndexes.add(i);
                }
                else if (rule.y == integer && update.contains(rule.x) && i < update.indexOf(rule.x)) {
                    invalidIndexes.add(i);
                }
            }
        }

        return invalidIndexes;
    }

    private static List<Integer> fixOrder(final List<Integer> update, final List<PageOrderingRule> rules) {
        List<Integer> invalidIndexesList = new ArrayList<>(validate(update, rules));

        // Swap randomly and then validate again
        while (!invalidIndexesList.isEmpty()) {
            Collections.swap(update, random.nextInt(invalidIndexesList.size()), random.nextInt(invalidIndexesList.size()));
            invalidIndexesList = new ArrayList<>(validate(update, rules));
        }

        return update;
    }

    private static record PageOrderingRule(int x, int y) {}
}