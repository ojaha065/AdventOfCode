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
 * Day 7: No Space Left On Device
 * https://adventofcode.com/2022/day/7
 */
public class Day7 {
    private static final Pattern COMMAND_PATTERN = Pattern.compile("\\$\\s([a-z]+)(?:\\s(.*))?");
    private static final Pattern DIR_PATTERN = Pattern.compile("dir\\s([a-z]+)");
    private static final Pattern FILE_PATTERN = Pattern.compile("(\\d+)\\s.+");

    private static final long TOTAL_SPACE = 70_000_000L;
    private static final long FREE_SPACE_NEEDED = 30_000_000L;

    public static void main(final String[] args) throws IOException {
        final String[] rows = Files.readAllLines(Path.of("2022\\7\\input")).stream()
            .map(String::strip)
            .filter(s -> !s.isEmpty())
            .toArray(String[]::new);

        final Directory rootDirectory = new Directory(null);
        Directory currentDirectory = null;

        for (final String row : rows) {
            final Matcher commandMatcher = COMMAND_PATTERN.matcher(row);
            final Matcher dirMatcher = DIR_PATTERN.matcher(row);
            final Matcher fileMatcher = FILE_PATTERN.matcher(row);

            if (commandMatcher.matches()) {
                switch (commandMatcher.group(1)) {
                    case "cd":
                        final String argument = commandMatcher.group(2);
                        currentDirectory = switch (argument) {
                           case "/" -> rootDirectory;
                           case ".." -> currentDirectory.parentDirectory;
                           default -> currentDirectory.subDirectories.get(argument);
                        };
                        break;
                    case "ls":
                        break;
                    default:
                        throw new RuntimeException("Unknown command " + commandMatcher.group(1));
                }
            }

            else if (dirMatcher.matches()) {
                final String directoryName = dirMatcher.group(1);
                currentDirectory.subDirectories.put(directoryName, new Directory(currentDirectory));
            }

            else if (fileMatcher.matches()) {
                currentDirectory.sizeOfFiles += Long.parseLong(fileMatcher.group(1));
            }

            else {
                throw new RuntimeException("Unknown input " + row);
            }
        }

        final long rootDirectorySize = rootDirectory.getActualSize();
        final List<Long> allDirectorySizes = rootDirectory.getAllDirectories().stream()
            .map(Directory::getActualSize)
            .toList();

        System.out.println("Outermost directory size: " + rootDirectorySize);
        System.out.println("Part 1: " + allDirectorySizes.stream()
            .mapToLong(l -> l)
            .filter(l -> l < 100_000)
            .sum()
        );

        // Part 2
        final long needToFree = FREE_SPACE_NEEDED - (TOTAL_SPACE - rootDirectorySize);
        System.out.println("Part 2: " + allDirectorySizes.stream()
            .mapToLong(l -> l)
            .filter(l -> l >= needToFree)
            .min()
            .getAsLong()
        );
    }

    private static class Directory {
        public long sizeOfFiles = 0L;
        public Directory parentDirectory;
        public Map<String, Directory> subDirectories = new HashMap<>();

        public Directory(final Directory parentDirectory) {
            this.parentDirectory = parentDirectory;
        }

        public long getActualSize() {
            return sizeOfFiles + subDirectories.values().stream().mapToLong(subDir -> subDir.getActualSize()).sum();
        }

        public List<Directory> getAllDirectories() {
            return getAllDirectories(this, new ArrayList<>());
        }

        private List<Directory> getAllDirectories(final Directory directory, final List<Directory> result) {
            result.add(directory);
            directory.subDirectories.values().forEach(subDir -> getAllDirectories(subDir, result));
            return result;
        }
    }
}