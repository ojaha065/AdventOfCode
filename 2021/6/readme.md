# Day six: Lanternfish

Pretty easy one today. For part one I originally used OO solution (basically kept track of every single fish individually), which worked, but become an issue in part two. Needed to think for a couple of minutes before figuring out how this should be implemented. This puzzle become very easy once I realized I should be keeping track of number of fish in each state, instead of individual fish.

Just for fun, here's a semi code golf version that prints the part two answer. It weights 213 bytes.

```javascript
let q=require("fs").readFileSync("./i","UTF-8").split(",").map(Number).reduce((a,b)=>{a[b]++;return a},Array(9).fill(0));for(let w of Array(256)){let e=q.shift();q[6]+=e;q.push(e)}console.log(q.reduce((a,b)=>a+b))
```

_So long, and thanks for all the fish_