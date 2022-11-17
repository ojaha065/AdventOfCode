# Day 2: Password Philosophy

As a warmup for 2022 I decided to complete some old ones from 2020.

Pretty basic still. Just some String splitting and character counting. Something I hadn't previously realized was that how limited String handling in Vanilla Java really is.

## The puzzle

Suppose you have the following list:
```
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
```

### Part 1

Each line gives the password policy and then the password. The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.

How many passwords are valid according to their policies?

### Part 2

Each policy actually describes two positions in the password, where 1 means the first character, 2 means the second character, and so on. Exactly one of these positions must contain the given letter. Other occurrences of the letter are irrelevant for the purposes of policy enforcement.

How many passwords are valid according to their policies?