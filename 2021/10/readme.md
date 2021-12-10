# Day ten: Syntax Scoring

Pretty basic one today, just pushing and popping items in and out of the stack.

## The puzzle

Consider the following input:
```
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
```

### Part 1
Stop at the first incorrect closing character on each corrupted line.

To calculate the syntax error score for a line, take the first illegal character on the line and look it up in the following table:
```
): 3 points
]: 57 points
}: 1197 points
>: 25137 points
```

What is the total syntax error score for those errors?

### Part 2
Now, discard the corrupted lines. The remaining lines are incomplete. Calculate the autocomplete score for each line. The score is determined by considering the completion string character-by-character. Start with a total score of 0. Then, for each character, multiply the total score by 5 and then increase the total score by the point value given for the character in the following table:
```
): 1 points
]: 2 points
}: 3 points
>: 4 points
```

What is the middle score?