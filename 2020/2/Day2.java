import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class Day2 {
    private static final Pattern SPLIT_PATTERN = Pattern.compile("\\s|:");

    public static void main(final String[] args) throws IOException {
        final List<String[]> splits = Files.readAllLines(Paths.get(args[0])).stream()
            .map(line -> SPLIT_PATTERN.split(line))
            .toList();

        System.out.println("Part 1: " + splits.stream()
            .filter(split -> {
                final char ch = split[1].charAt(0);
                final long count = split[3].chars().filter(c -> c == ch).count();
                
                final Integer[] limits = Arrays.stream(split[0].split("-"))
                    .map(s -> Integer.parseInt(s))
                    .toArray(Integer[]::new);
                
                return count >= limits[0] && count <= limits[1];
            }).count());

        System.out.println("Part 2: " + splits.stream()
            .filter(split -> {
                final Integer[] positions = Arrays.stream(split[0].split("-"))
                    .map(s -> Integer.parseInt(s))
                    .toArray(Integer[]::new);

                final char ch = split[1].charAt(0);

                // XOR
                return (split[3].length() >= positions[0] && split[3].charAt(positions[0] - 1) == ch) // Remember: -1 as positions are 1-indexed instead of zero indexed
                    ^ (split[3].length() >= positions[1] && split[3].charAt(positions[1] - 1) == ch);
            }).count());
    }
}