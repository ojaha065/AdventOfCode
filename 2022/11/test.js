

    monkeys = require("fs").readFileSync("./input", "UTF-8").split("\n\n").map(a => {
      let arr = a.split("\n")
      return {
        items: [...arr[1].matchAll(/\d+/g)].map(c => BigInt(c[0])), //worry level
        op: [...arr[2].matchAll(/(old)|\*|\+|\d+/g)].map(c => isNaN(+c[0]) ? c[0] : BigInt(c[0])), //new =
        test: BigInt(arr[3].match(/\d+/)), //divisible by x
        onTrue: +arr[4].match(/\d+/), //throw to monkey x
        onFalse: +arr[5].match(/\d+/), //^
        inspections: 0,
      }
    })

    megaMod = monkeys.reduce((v,c)=>v*c.test,1n)

    rounds = function(n, part) {
      for (let i = 0; i < n; i++) {
        for (monkey of monkeys)
          while (monkey.items[0]) {
            let item = monkey.items.shift() % megaMod;
            let op = monkey.op.map(a => (a == "old") ? item : a)

            //inspection
            if (op[1] == "+")
              item = op[0] + op[2]
            else if (op[1] == "*")
              item = op[0] * op[2]
            monkey.inspections++

            //boredom
            if (part == 1) item /= 3n; //used for part 1

            //test
            if (item % monkey.test == 0)
              monkeys[monkey.onTrue].items.push(item);
            else
              monkeys[monkey.onFalse].items.push(item);
          }
      }
      let monkeyActivity = monkeys.map(a => a.inspections).sort((a, b) => b - a)
      let monkeyBusiness = monkeyActivity[0] * monkeyActivity[1]

      return monkeyBusiness
    }

    console.log(rounds(20, 1)) //result 1