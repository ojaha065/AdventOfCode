import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Deque;
import java.util.List;
import java.util.stream.Stream;

/**
 * Day 13: Distress Signal
 * https://adventofcode.com/2022/day/13
 */
public class Day13 {
    public static void main(final String[] args) throws IOException {
        final var pairs = Arrays.stream(Files.readString(Path.of("2022\\13\\input")).split("\n\n")) // Split by empty line
            .map(pair -> pair.split("\n")) // Split by line break
            .map(Arrays::stream)
            .map(stream -> stream.map(String::strip))
            .map(stream -> stream.map(Day13::parseRow))
            .map(stream -> stream.toArray(List[]::new))
            .toList();

        final RowComparator comparator = new RowComparator();

        int part1Result = 0;
        for (int i = 0; i < pairs.size(); i++) {
            if (comparator.compare(pairs.get(i)[0], pairs.get(i)[1]) == 1) {
                part1Result += i + 1;
            }
        }
        System.out.println("Part 1: " + part1Result);

        // Part 2
        final List<List<Integer>> divider1 = Collections.singletonList(Collections.singletonList(2));
        final List<List<Integer>> divider2 = Collections.singletonList(Collections.singletonList(6));

        final var sortedList = Stream.concat(
            pairs.stream().flatMap(Arrays::stream),
            Stream.of(divider1, divider2)
        ).sorted(comparator.reversed()).toList();

        System.out.println("Part 2: " + (sortedList.indexOf(divider1) + 1) * (sortedList.indexOf(divider2) + 1));
    }

    private static final List<Object> parseRow(final String input) {
        final Deque<List<Object>> stack = new ArrayDeque<>();

        // Some integers might be longer than one character
        String integerStack = "";

        for (final char ch : input.toCharArray()) {
            if (ch == '[') {
                stack.add(new ArrayList<>());
            }
            else if (ch == ']') {
                final List<Object> completeList = stack.removeLast();

                if (!integerStack.isEmpty()) {
                    completeList.add(Integer.parseInt(integerStack));
                    integerStack = "";
                }

                if (stack.isEmpty()) {
                    // Reached the end
                    return completeList;
                }

                stack.getLast().add(completeList);
            }
            else if (ch == ',') {
                if (!integerStack.isEmpty()) {
                    stack.getLast().add(Integer.parseInt(integerStack));
                    integerStack = "";
                }
            }
            else {
                integerStack += ch;
            }
        }

        throw new RuntimeException("Something went wrong!");
    }

    private static final class RowComparator implements Comparator<Object> {
        public final int compare(final Object left, final Object right) {
            // Both values are lists
            if (left instanceof List listLeft && right instanceof List listRight) {
                final boolean areSameLength = listRight.size() == listLeft.size();
    
                for (int i = 0;;i++) {
                    if (i >= listLeft.size() && areSameLength) {
                        return 0;
                    }
                    if (i >= listLeft.size()) {
                        // If the left list runs out of items first, the inputs are in the right order.
                        return 1;
                    }
                    if (i >= listRight.size()) {
                        // If the right list runs out of items first, the inputs *are not* in the right order.
                        return -1;
                    }
    
                    final int result = compare(listLeft.get(i), listRight.get(i));
                    if (result != 0) {
                        return result;
                    }
                }
            }
    
            // Both values are integers
            else if (left instanceof Integer leftInteger && right instanceof Integer rightInteger) {
                if (leftInteger < rightInteger) {
                    return 1;
                }
                if (leftInteger > rightInteger) {
                    return -1;
                }
                return 0;
            }
    
            // Exactly one value is an integer
            else {
                if (left instanceof Integer lefInteger) {
                    return compare(Collections.singletonList(lefInteger), right);
                }
                if (right instanceof Integer rightInteger) {
                    return compare(left, Collections.singletonList(rightInteger));
                }
    
                throw new RuntimeException("Something went wrong!");
            }
        }
    }
}