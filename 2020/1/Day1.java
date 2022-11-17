import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class Day1 {
    public static void main(final String[] args) throws IOException {
        final List<Integer> input = Files.readAllLines(Paths.get(args[0])).stream()
            .map(s -> Integer.parseInt(s))
            .toList();

        for (final Integer integer1 : input) {
            for (final Integer integer2 : input) {
                if (integer1 + integer2 == 2020) {
                    System.out.println("Part 1: " + integer1 * integer2);
                }

                for (final Integer integer3 : input) {
                    if (integer1 + integer2 + integer3 == 2020) {
                        System.out.println("Part 2: " + integer1 * integer2 * integer3);
                    }
                }
            }
        }
    }
}