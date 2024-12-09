import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

/**
 * <a href="https://adventofcode.com/2024/day/9">Day 9: Disk Fragmenter</a>
 */
public class Day9 {
    public static void main(final String[] _args) throws IOException {
        final long startTime = System.currentTimeMillis();

        final String[] input = Files.readString(Path.of("2024\\09\\input.txt"), StandardCharsets.UTF_8)
            .strip()
            .split("");

        final List<DiskEntry> originalDiskMap = new ArrayList<>();

        int fileCount = 0;
        for (int i = 0; i < input.length; i++) {
            originalDiskMap.add(new DiskEntry(
                Integer.parseInt(input[i]),
                i % 2 == 0 ? DiskEntryType.file : DiskEntryType.freeSpace,
                i % 2 == 0 ? fileCount++ : null
            ));
        }

        // Part 1
        final List<DiskEntry> diskMap0 = deepClone(originalDiskMap);
        while (hasGaps(diskMap0)) {
            for (final DiskEntry diskEntry : diskMap0.reversed()) {
                if (DiskEntryType.file.equals(diskEntry.type)) {
                    final int currentIndex = diskMap0.indexOf(diskEntry);
                    while (diskEntry.size > 0) {
                        // Find first free space or quit
                        final int freeSpaceIndex = findIndex(diskMap0, de -> DiskEntryType.freeSpace.equals(de.type));
                        if (freeSpaceIndex == -1 || freeSpaceIndex >= currentIndex) { break; }
    
                        final DiskEntry freeSpace = diskMap0.get(freeSpaceIndex);
                        final int sizeToMove = Math.min(diskEntry.size, freeSpace.size);
    
                        diskMap0.add(freeSpaceIndex, new DiskEntry(sizeToMove, diskEntry.type, diskEntry.ID));

                        freeSpace.size -= diskEntry.size;
                        if (freeSpace.size <= 0) {
                            diskMap0.remove(freeSpace);
                        }
    
                        diskEntry.size -= sizeToMove;
                    }
    
                    // If we managed to move the whole entry, remove it
                    if (diskEntry.size <= 0) {
                        diskMap0.remove(diskEntry);
                    }

                    break;
                }
            }
        }
        System.out.println("Part 1: " + getChecksum(diskMap0));

        // Part 2
        final List<DiskEntry> diskMap1 = deepClone(originalDiskMap);
        final List<DiskEntry> sortedDiskMap1 = diskMap1.stream()
            .filter(diskEntry -> DiskEntryType.file.equals(diskEntry.type))
            .sorted(Comparator.comparing(diskEntry -> diskEntry.ID, Comparator.reverseOrder()))
            .toList();

        for (final DiskEntry fileEntry: sortedDiskMap1) {
            final int index = diskMap1.indexOf(fileEntry);
            final int freeSpaceIndex = findIndex(diskMap1, de -> DiskEntryType.freeSpace.equals(de.type) && de.size >= fileEntry.size);
            if (freeSpaceIndex > -1 && freeSpaceIndex < index) {
                final DiskEntry freeSpace = diskMap1.get(freeSpaceIndex);
                diskMap1.add(freeSpaceIndex, fileEntry.clone());

                // If we filled the free space fully, remove it
                freeSpace.size -= fileEntry.size;
                if (freeSpace.size <= 0) {
                    diskMap1.remove(freeSpace);
                }

                fileEntry.convertToFreeSpace();
            }
        }
        System.out.println("Part 2: " + getChecksum(diskMap1));
        System.out.println("Run time: %s ms".formatted(System.currentTimeMillis() - startTime));
    }

    private static <T> int findIndex(final List<T> list, final Function<T, Boolean> function) {
        for (int i = 0; i < list.size(); i++) {
            if (function.apply(list.get(i))) { return i; }
        }
        return -1;
    }

    private static List<DiskEntry> deepClone(final List<DiskEntry> diskMap) {
        return diskMap.stream().map(o -> o.clone()).collect(Collectors.toCollection(ArrayList::new));
    }

    private static boolean hasGaps(final List<DiskEntry> diskMap) {
        boolean freeSpaceEncountered = false;
        for (final DiskEntry diskEntry : diskMap) {
            if (freeSpaceEncountered && DiskEntryType.file.equals(diskEntry.type)) {
                return true;
            }
            if (DiskEntryType.freeSpace.equals(diskEntry.type)) {
                freeSpaceEncountered = true;
            }
        }
        return false;
    }

    private static long getChecksum(final List<DiskEntry> diskMap) {
        final List<Integer> list = new ArrayList<>();
        for (final DiskEntry diskEntry: diskMap) {
            list.addAll(Collections.nCopies(diskEntry.size, DiskEntryType.file.equals(diskEntry.type) ? diskEntry.ID : 0));
        }

        return LongStream.range(1, list.size())
            .map(i -> i * list.get((int) i))
            .sum();
    }

    private static class DiskEntry implements Cloneable {
        public int size;
        public DiskEntryType type;
        public Integer ID;

        @SuppressWarnings("unused")
        private final String identifier;

        public DiskEntry(final int size, final DiskEntryType type, final Integer ID) {
            this.identifier = UUID.randomUUID().toString();

            this.size = size;
            this.type = type;
            this.ID = ID;
        }

        public void convertToFreeSpace() {
            this.type = DiskEntryType.freeSpace;
            this.ID = null;
        }

        public DiskEntry clone() {
            return new DiskEntry(this.size, this.type, this.ID);
        }
    }

    private static enum DiskEntryType {
        file, freeSpace
    }
}