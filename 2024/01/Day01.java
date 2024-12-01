import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;

/**
 * <a href="https://adventofcode.com/2024/day/1">Day 1: Historian Hysteria</a>
 */
public class Day01 {
    public static void main(String[] args) throws IOException {
        final long startTime = System.currentTimeMillis();

        final List<Integer> list0 = new ArrayList<>();
        final List<Integer> list1 = new ArrayList<>();

        final Pattern splitPattern = Pattern.compile("\\s+");
        for (final String line : Files.readAllLines(Path.of("2024\\01\\input.txt"), StandardCharsets.UTF_8)) {
            final String[] split = splitPattern.split(line, 2);
            list0.add(Integer.parseInt(split[0]));
            list1.add(Integer.parseInt(split[1]));
        }

        list0.sort(Comparator.naturalOrder());
        list1.sort(Comparator.naturalOrder());

        int part1Result = 0;
        int part2Result = 0;

        for (int i = 0; i < list0.size(); i++) {
            final int that = list0.get(i);
            part1Result += Math.abs(that - list1.get(i));
            part2Result += that * list1.stream().filter(integer -> integer.equals(that)).count();
        }

        System.out.println("Part 1: " + part1Result);
        System.out.println("Part 2: " + part2Result);

        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }
}