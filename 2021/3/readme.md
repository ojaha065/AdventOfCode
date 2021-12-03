# Day three

Something interesting (and very annoying!) happened that I thought I would share.
During part two, I originally wrote line 44 like this:

```javascript
.map(parseInt)
```

For those who don't know, in the wonderful world of JavaScript `["1", "1", "1"].map(parseInt)` returns `[1, NaN, 1]`. For a explanation of why this happens, read [this Stack Overflow answer](https://stackoverflow.com/a/262511 "Why does parseInt yield NaN with Array#map?"). It took some debugging to figure that out and it ruined my otherwise solid part two run.