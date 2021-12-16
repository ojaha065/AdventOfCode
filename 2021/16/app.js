"use strict";

class Packet {
    version;
    typeId;
    data; // value
    length;

    versionSum = 0;

    static operatorMethodsMap = new Map([
        [0, subPackets => subPackets.reduce((a, b) => a + b)], // sum
        [1, subPackets => subPackets.reduce((a, b) => a * b)], // product
        [2, subPackets => Math.min(...subPackets)], // minimum
        [3, subPackets => Math.max(...subPackets)], // maxium
        [5, subPackets => subPackets[0] > subPackets[1] ? 1 : 0], // greater than
        [6, subPackets => subPackets[0] < subPackets[1] ? 1 : 0], // less than
        [7, subPackets => subPackets[0] === subPackets[1] ? 1 : 0], // equal to
    ]);

    constructor (binaryData) {
        let readHead = 0; // Next bit not yet read; 0 === first bit

        // Version
        this.version = parseInt(binaryData.substring(readHead, readHead + 3), 2);
        readHead += 3;
        this.versionSum += this.version;

        // Type ID
        this.typeId = parseInt(binaryData.substring(readHead, readHead + 3), 2);
        readHead += 3;

        if (this.typeId === 4) { // Literal value
            let value = "";

            let hasNext = true;
            do {
                hasNext = parseInt(binaryData.charAt(readHead++)); // Each group is prefixed by a 1 bit except the last group, which is prefixed by a 0 bit.
                value += binaryData.substring(readHead, readHead + 4);
                readHead += 4;
            } while (hasNext)

            this.data = parseInt(value, 2);
        } else { // Operator
            /**
             * If the length type ID is 0, then the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
             * If the length type ID is 1, then the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.
             */
            const lengthTypeId = parseInt(binaryData.charAt(readHead++)) === 0 ? 15 : 11;
            
            const subPacketsLength = parseInt(binaryData.substring(readHead, readHead + lengthTypeId), 2);
            readHead += lengthTypeId;

            const subPackets = [];
            let subPacketsConsumed = 0;
            while (subPacketsConsumed < subPacketsLength) {
                const subPacket = new Packet(binaryData.substring(readHead));
                readHead += subPacket.length;
                subPacketsConsumed += (lengthTypeId === 15 ? subPacket.length : 1);
                this.versionSum += subPacket.versionSum;
                subPackets.push(subPacket);
            }

            this.data = Packet.operatorMethodsMap.get(this.typeId)(subPackets.map(packet => packet.data));
        }

        this.length = readHead;
    }
}

// Have to do this manually as parseInt(string, 16) removes zeros from the beginning
const binaryConversionMap = new Map([
    ["0", "0000"],
    ["1", "0001"],
    ["2", "0010"],
    ["3", "0011"],
    ["4", "0100"],
    ["5", "0101"],
    ["6", "0110"],
    ["7", "0111"],
    ["8", "1000"],
    ["9", "1001"],
    ["A", "1010"],
    ["B", "1011"],
    ["C", "1100"],
    ["D", "1101"],
    ["E", "1110"],
    ["F", "1111"]
]);

/*
    D2FE28
    38006F45291200
    EE00D40C823060
    8A004A801A8002F478
    620080001611562C8802118E34
    C0015000016115A2E0802F182340
    A0016C880162017C3686B18A3D4780
    C200B40A82
    04005AC33890
    880086C3E88112
    CE00C43D881120
    D8005AC2A8F0
    F600BC2D8F
    9C005AC2F8F0
    9C0141080250320F1802104A08
*/

const hex = "9C0141080250320F1802104A08"; // Puzzle input here
const binary = hex.split("").map(char => binaryConversionMap.get(char)).join("");

const result = new Packet(binary);
console.log(`Part 1: ${result.versionSum}, Part 2: ${result.data}`);