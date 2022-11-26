import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Day 7: Handy Haversacks
 * https://adventofcode.com/2020/day/7
 */
public class Day7 {
    private static final Pattern BAG_COLOR_PATTERN = Pattern.compile("^((?:\\w|\\s)+)\\sbags\\scontain");
    private static final Pattern BAG_CONTENTS_PATTERN = Pattern.compile("(\\d+)\\s((?:\\w|\\s)+)\\sbags?(?:,|\\.)");

    public static void main(final String[] args) throws IOException {
        final List<String> rows = Files.readAllLines(Path.of(args[0]));
        final Map<String, Bag> bagsByColor = new HashMap<>();

        for (final String row : rows) {
            // Color
            final Matcher colorMatcher = BAG_COLOR_PATTERN.matcher(row);
            if (!colorMatcher.find()) {
                throw new RuntimeException("Invalid row");
            }
            final String color = colorMatcher.group(1);

            final Bag bag = bagsByColor.getOrDefault(color, new Bag(color));

            // Contents
            BAG_CONTENTS_PATTERN.matcher(row).results().forEach(result -> {
                final int count = Integer.parseInt(result.group(1));
                final String innerColor = result.group(2);

                for (int i = 0; i < count; i++) {
                    bag.addContent(bagsByColor.computeIfAbsent(innerColor, Bag::new));
                }
            });

            bagsByColor.put(color, bag);
            //System.out.println(bag.toString());
        }

        System.out.println("Part 1: " + bagsByColor.values().stream().filter(bag -> bag.canContain("shiny gold")).count());
        System.out.println("Part 2: " + (bagsByColor.get("shiny gold").getNestedBagCount() - 1L)); // -1 because we do not want to count the shiny gold bag itself. This threw me off for way too long.
    }

    private static class Bag {
        private String color;
        private List<Bag> contents = new ArrayList<>();

        public Bag(final String color) {
            this.color = color;
        }

        public void addContent(final Bag bag) {
            this.contents.add(bag);
        }

        public boolean canContain(final String color) {
            return canContain(color, new HashMap<>());
        }

        public long getNestedBagCount() {
            return this.contents.stream().reduce(1L, (acc, bag) -> acc + bag.getNestedBagCount(), Long::sum);
        }

        private boolean canContain(final String searchColor, final Map<String, Boolean> recursiveMap) {
            for (final Bag innerBag : this.contents) {
                // If the current innerBag is right color, we can return right away. No need to check the rest
                if (innerBag.color.equals(searchColor)) {
                    recursiveMap.put(this.color, true);
                    return true;
                }

                // If the current innerBag is already checked we can stop the recursion right here
                if (recursiveMap.containsKey(innerBag.color)) {
                    if (recursiveMap.get(innerBag.color)) {
                        return true;
                    }

                    continue;
                }

                final boolean result = innerBag.canContain(searchColor, recursiveMap);
                recursiveMap.put(innerBag.color, result);
                if (result) {
                    // If the current innerBag can contain the color, we can return right away. No need to check to rest
                    return true;
                }
            }

            return false;
        }

        @Override
        public String toString() {
            return String.format("Color: %s, Contents: %s other bags", this.color, this.contents.size());
        }
    }
}