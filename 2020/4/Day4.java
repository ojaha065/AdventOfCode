import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Day4 {
    public static void main(final String[] args) throws IOException {
        final List<Passport> allPassports = Arrays.stream(Files.readString(Paths.get("C:\\Users\\Jani\\Desktop\\AdventOfCode\\2020\\4\\input")).split("\n\n"))
            .map(Passport::new)
            .toList();

        System.out.println("Part 1: " + allPassports.stream().filter(Passport::hasAllFields).count());
        System.out.println("Part 2: " + allPassports.stream().filter(Passport::hasValidValues).count());
    }

    private static class Passport {
        private static final Pattern PASSPORT_PATTERN = Pattern.compile("([a-z]{3}):(\\S+)");
        private static final Pattern HEIGHT_PATTERN = Pattern.compile("^(\\d{2,3})(cm|in)$");
        private static final Pattern HAIR_PATTERN = Pattern.compile("^#[0-9a-f]{6}$");
        private static final Pattern PASSPORT_ID_PATTERN = Pattern.compile("^\\d{9}$");

        private static final List<String> EYE_COLORS = List.of("amb", "blu", "brn", "gry", "grn", "hzl", "oth");
        private static final List<String> REQUIRED_FIELDS = List.of("byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid");

        public Passport(final String input) {
            PASSPORT_PATTERN.matcher(input).results().forEach(result -> rawData.put(result.group(1), result.group(2)));
        }

        private Map<String, String> rawData = new HashMap<>();

        public boolean hasAllFields() {
            return rawData.keySet().containsAll(REQUIRED_FIELDS);
        }

        public boolean hasValidValues() {
            // Fields missing
            if (!hasAllFields()) {
                return false;
            }

            // byr (Birth Year) - four digits; at least 1920 and at most 2002
            if (Optional.of(rawData.get("byr")).filter(s -> s.length() == 4).map(s -> Integer.parseInt(s)).filter(i -> i >= 1920 && i <= 2002).isEmpty()) {
                return false;
            }

            // iyr (Issue Year) - four digits; at least 2010 and at most 2020
            if (Optional.of(rawData.get("iyr")).filter(s -> s.length() == 4).map(s -> Integer.parseInt(s)).filter(i -> i >= 2010 && i <= 2020).isEmpty()) {
                return false;
            }

            // eyr (Expiration Year) - four digits; at least 2020 and at most 2030
            if (Optional.of(rawData.get("eyr")).filter(s -> s.length() == 4).map(s -> Integer.parseInt(s)).filter(i -> i >= 2020 && i <= 2030).isEmpty()) {
                return false;
            }

            // hgt (Height) - a number followed by either cm or in
            final Matcher heightMatcher = HEIGHT_PATTERN.matcher(rawData.get("hgt"));
            if (!heightMatcher.matches()) {
                return false;
            }

            final int heightNumber = Integer.parseInt(heightMatcher.group(1));
            final String heightUnit = heightMatcher.group(2);

            // If cm, the number must be at least 150 and at most 193.
            if (heightUnit.equals("cm") && (heightNumber < 150 || heightNumber > 193)) {
                return false;
            }

            // If in, the number must be at least 59 and at most 76.
            if (heightUnit.equals("in") && (heightNumber < 59 || heightNumber > 76)) {
                return false;
            }

            // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
            if (!HAIR_PATTERN.matcher(rawData.get("hcl")).matches()) {
                return false;
            }

            // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
            if (!EYE_COLORS.contains(rawData.get("ecl"))) {
                return false;
            }

            // pid (Passport ID) - a nine-digit number, including leading zeroes.
            if (!PASSPORT_ID_PATTERN.matcher(rawData.get("pid")).matches()) {
                return false;
            }

            return true;
        }
    }
}