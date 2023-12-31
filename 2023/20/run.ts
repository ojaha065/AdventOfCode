/**
 * Day 20: Pulse Propagation
 * https://adventofcode.com/2023/day/20
 */

console.time("Run time");

import fs from "fs";

type Pulse = {
    type: 0 | 1;
    from: string;
    to: string;
};

interface Module {
    name: string;
    destinationModules: string[];
    onReceive: (pulse: Pulse) => Pulse[];
    afterInit: (modules: Module[]) => void;
};

class FlipFlopModule implements Module {
    public name: string;
    public destinationModules: string[];

    private state: boolean = false; // initially off

    constructor(name: string, destinationModules: string[]) {
        this.name = name;
        this.destinationModules = destinationModules;
    }

    onReceive(pulse: Pulse): Pulse[] {
        // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
        if (pulse.type === 1) {
            return [];
        }

        // if a flip-flop module receives a low pulse, it flips between on and off
        this.state = !this.state;

        // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
        return this.destinationModules.map(dm => ({type: this.state ? 1 : 0, from: this.name, to: dm}));
    }

    afterInit() {}
};

class ConjunctionModule implements Module {
    public name: string;
    public destinationModules: string[];

    // Conjunction modules remember the type of the most recent pulse received from each of their connected input modules
    private memory: Record<string, 0 | 1> = {};

    constructor(name: string, destinationModules: string[]) {
        this.name = name;
        this.destinationModules = destinationModules;
    }

    onReceive(pulse: Pulse): Pulse[] {
        // When a pulse is received, the conjunction module first updates its memory for that input.
        this.memory[pulse.from] = pulse.type;

        // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
        return Object.values(this.memory).every(Boolean)
            ? this.destinationModules.map(dm => ({type: 0, from: this.name, to: dm}))
            : this.destinationModules.map(dm => ({type: 1, from: this.name, to: dm}));
    };

    afterInit(modules: Module[]) {
        // they initially default to remembering a low pulse for each input.
        this.memory = Object.fromEntries(modules
            .filter(module => module.destinationModules.includes(this.name))
            .map(module => module.name)
            .map(moduleName => [moduleName, 0]));
    }
};

class BroadcastModule implements Module {
    public name: string = "broadcaster";
    public destinationModules: string[];

    constructor(destinationModules: string[]) {
        this.destinationModules = destinationModules;
    }

    onReceive(pulse: Pulse): Pulse[] {
        // When it receives a pulse, it sends the same pulse to all of its destination modules.
        return this.destinationModules.map(dm => ({type: pulse.type, from: this.name, to: dm}));
    }

    afterInit() {}
};

const MODULE_PATTERN = /^(%|&|broadcaster)(\w+)?\s->\s(.+)$/;

const modules: Record<string, Module> = Object.fromEntries(fs.readFileSync("./20/input.txt", "utf-8")
    .split(/[\r\n]+/)
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => MODULE_PATTERN.exec(row))
    .map(matcher => {
        if (!matcher) {
            throw new Error("Could not parse input!");
        }

        switch (matcher[1]) {
            case "%": return new FlipFlopModule(matcher[2], matcher[3].split(",").map(dm => dm.trim()));
            case "&": return new ConjunctionModule(matcher[2], matcher[3].split(",").map(dm => dm.trim()));
            case "broadcaster": return new BroadcastModule(matcher[3].split(",").map(dm => dm.trim()));
            default: throw new Error(`Error parsing input "${matcher[0]}"`);
        }
    }).map((module, _index, all) => {
        module.afterInit(all);
        return module;
    }).map(module => [module.name, module]));

let lowSent = 0;
let highSent = 0;
for (let i = 0; i < 1000; i++) {
    const pulseStack: Pulse[] = [{type: 0, from: "button", to: "broadcaster"}];
    lowSent++;

    while (pulseStack.length) {
        const pulse = pulseStack.shift();
        if (!pulse) {
            throw new Error("Something went wrong!");
        }
    
        if (!modules[pulse.to]) {
            continue;
        }
    
        const newPulses = modules[pulse.to].onReceive(pulse);
        if (newPulses.length) {
            pulseStack.push(...newPulses);
            newPulses.forEach(newPulse => {
                if (newPulse.type === 0) { lowSent++; }
                if (newPulse.type === 1) { highSent++; }
            });
        }
    }
}
console.info("Part 1: " + (lowSent * highSent));

console.timeEnd("Run time");