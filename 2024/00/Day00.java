import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Just a test file to test the Java env
 */
public class Day00 {
    public static void main(final String[] args) throws IOException {
        final String input = Files.readString(Path.of("2024\\00\\input.txt"), StandardCharsets.UTF_8);
        System.out.println(input);
    }
}