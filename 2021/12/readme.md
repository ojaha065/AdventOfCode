# Day 12: Passage Pathing

Another day, another recursive function. :laughing: I have played around with path finding before, but usually in a grid based scenarios. Took some serious thinking (and a pen and a paper) to figure out a logic for this. I'm pretty satisfied with the one-liner in line 38 for figuring out if the current path has already visited any small cave twice.

## The puzzle

The puzzle input is a list of how all of the caves are connected. For example:
```
start-A
start-b
A-c
A-b
b-d
A-end
b-end
```

You start in the cave named start, and your destination is the cave named end. An entry like b-d means that cave b is connected to cave d - that is, you can move between them.

There are two types of caves: big caves (written in uppercase, like A) and small caves (written in lowercase, like b). The caves named start and end can only be visited exactly once each: once you leave the start cave, you may not return to it, and once you reach the end cave, the path must end immediately.

Part 1: How many paths through this cave system are there that visit small caves at most once?

Part 2: New rules: Big caves can be visited any number of times, a single small cave can be visited at most twice, and the remaining small caves can be visited at most once. Given these new rules, how many paths through this cave system are there?