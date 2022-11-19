import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

public class Day5 {
    public static void main(final String[] args) throws IOException {
        // Test cases
        System.out.println(new BoardingPass("FBFBBFFRLR").toString());
        System.out.println(new BoardingPass("BFFFBBFRRR").toString());
        System.out.println(new BoardingPass("FFFBBBFRRR").toString());
        System.out.println(new BoardingPass("BBFFBBFRLL").toString());

        final List<Integer> allSeatIDs = Files.readAllLines(Paths.get(args[0])).stream()
            .map(BoardingPass::new)
            .map(bp -> bp.seatID)
            .sorted()
            .toList();

        System.out.println("Part 1: " + Collections.max(allSeatIDs));

        // Finding the missing number
        for (int i = 0; i < allSeatIDs.size(); i++) {
            final int expectedNext = allSeatIDs.get(i) + 1;
            if (allSeatIDs.get(i + 1) != expectedNext) {
                System.out.println("Part 2: " + expectedNext);
                break;
            }
        }
    }

    private static class BoardingPass {
        public int row;
        public int column;
        public int seatID;

        public BoardingPass(final String binary) {
            // Row
            this.row = paperFolder(0, 127, 'F', binary.substring(0, 7).toCharArray());

            // Column
            this.column = paperFolder(0, 7, 'L', binary.substring(7).toCharArray());

            // Seat ID
            this.seatID = this.row * 8 + column;
        }

        @Override
        public String toString() {
            return String.format("Row %s, Column %s, Seat ID %s", this.row, this.column, this.seatID);
        }
    }

    private static int paperFolder(int lowerLimit, int upperLimit, final char keepLower, final char[] charArr) {
        for (int i = 0; lowerLimit != upperLimit; i++) {
            final int distance = Math.round(((float) (upperLimit - lowerLimit)) / 2);
            if (charArr[i] == keepLower) { // keep lower
                upperLimit -= distance;
            } else { // keep upper
                lowerLimit += distance;
            }
        }

        return lowerLimit;
    }
}