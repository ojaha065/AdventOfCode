import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Day 12: Hill Climbing Algorithm
 * https://adventofcode.com/2022/day/12
 */
public class Day12 {
    public static void main(final String[] args) throws IOException {
        final List<String> lines = Files.readAllLines(Path.of("2022\\12\\input"));
        final Map<String, Node> nodes = new HashMap<>();
        for (int y = 0; y < lines.size(); y++) {
            final char[] arr = lines.get(y).toCharArray();
            for (int x = 0; x < arr.length; x++) {
                nodes.put(
                    getNodeKey(x, y),
                    new Node(x, y, arr[x], Integer.MAX_VALUE)
                );
            }
        }

        // Find end (E)
        final Node endNode = nodes.values().stream().filter(node -> node.value == 'E').findFirst().orElseThrow();
        endNode.value = 'z';

        // Start node for part 1: S
        System.out.println("Part 1: " + nodes.values().stream()
            .filter(node -> node.value == 'S')
            .findFirst()
            .map(node -> {
                node.value = 'a';
                return node;
            }).map(node -> pathFinder(nodes, node, endNode, Integer.MAX_VALUE)).orElseThrow());

        // Part 2: Start from every 'a', find lowest
        // Note: Very slow, could be optimized by going end --> start instead of start --> end
        int part2Result = Integer.MAX_VALUE;
        for (final Node node : nodes.values()) {
            if (node.value == 'a') {
                final int result = pathFinder(nodes, node, endNode, part2Result);
                if (result < part2Result) {
                    part2Result = result;
                }
            }
        }
        System.out.println("Part 2: " + part2Result);
    }

    // Basic Dijkstra's
    // https://en.wikipedia.org/wiki/Dijkstra's_algorithm#Algorithm
    private static final int pathFinder(final Map<String, Node> nodes, final Node startNode, final Node endNode, final int maxDistance) {
        final Map<String, Node> unvisitedNodes = nodes.entrySet().stream().collect(Collectors.toMap(
            Map.Entry::getKey,
            entry -> entry.getValue().clone(), // Need to clone as otherwise the original Map gets modified
            (a, _b) -> a,
            HashMap::new
        ));

        Node currentNode = unvisitedNodes.get(getNodeKey(startNode.x, startNode.y));
        currentNode.distance = 0;

        while (true) {
            if (currentNode.x == endNode.x && currentNode.y == endNode.y) {
                return currentNode.distance;
            }

            // Optimization: As we're always looking for the shortest route, we can discard any routes that longer than the current shortest
            if (currentNode.distance >= maxDistance) {
                return maxDistance;
            }

            final Node cn = currentNode;
            Stream.of(
                unvisitedNodes.get(getNodeKey(cn.x, cn.y - 1)), // Top neighbor
                unvisitedNodes.get(getNodeKey(cn.x, cn.y + 1)), // Bottom neighbor
                unvisitedNodes.get(getNodeKey(cn.x - 1, cn.y)), // Left neighbor
                unvisitedNodes.get(getNodeKey(cn.x + 1, cn.y)) // Right neighbor
            ).filter(Objects::nonNull).forEach(unvisitedNode -> {
                final int newDistance = cn.distance + (unvisitedNode.value <= cn.value + 1 ? 1 : 1000);
                if (newDistance < unvisitedNode.distance) {
                    unvisitedNode.distance = newDistance;
                }
            });

            unvisitedNodes.remove(getNodeKey(cn.x, cn.y));
            currentNode = unvisitedNodes.values().stream().sorted(Comparator.comparingInt(node -> node.distance)).findFirst().orElseThrow();
        }
    }

    private static final String getNodeKey(final int x, final int y) {
        return String.format("%s,%s", x, y);
    }

    private static final class Node implements Cloneable {
        public int x;
        public int y;
        public int value;
        public int distance;

        public Node(final int x, final int y, final int value, final int distance) {
            this.x = x;
            this.y = y;
            this.value = value;
            this.distance = distance;
        }

        @Override
        public Node clone() {
            return new Node(x, y, value, distance);
        }
    }
}