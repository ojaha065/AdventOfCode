import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Day 6: Custom Customs
 * https://adventofcode.com/2020/day/6
 */
public class Day6 {
    public static void main(final String[] args) throws IOException {
        // Split by empty line
        final String[] groups = Files.readString(Path.of(args[0]))
            .split("\n\n");

        // Part 1: Sum of numbers of unique chars per group
        System.out.println("Part 1: " + Arrays.stream(groups)
            .map(group -> group.replace("\n", "")) // Remove linebreaks
            .map(group -> group.chars().mapToObj(ch -> (char) ch))
            .mapToLong(stream -> stream.distinct().count())
            .reduce(Long::sum)
            .getAsLong()
        );

        // Part 2: Sum of numbers of chars per group that are in every row (of the group)
        System.out.println("Part 2: " + Arrays.stream(groups)
            .map(group -> group.split("\n")) // Split each group to individual persons. We'll need to length of the group later
            .mapToLong(persons -> Arrays.stream(persons)
                .flatMap(person -> person.chars().mapToObj(ch -> (char) ch))
                .collect(Collectors.collectingAndThen(
                    Collectors.groupingBy(Function.identity(), Collectors.counting()), // Get counts per char
                    map -> map.values().stream().filter(value -> value >= persons.length).count()) // Count only if the char is present as many times as the group is long
                )).reduce(Long::sum).getAsLong());
    }
}