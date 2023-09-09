// root/react-app/src/utils/parseInstructions.js

import { headMoves, instructionProperties, validBlanks } from "../constants/constants";

const parseInstructions = (text, machineId) => {
    if (typeof text !== "string" || !Number.isInteger(machineId)) return null;
    const badLines = [];
    const goodInstructions = [];
    const lineArr = text.split("\n");

    const instructions = lineArr.map((line) => {
        const inst = { machineId }
        const start = line.indexOf("<") + 1;
        line = line.slice(start);
        const end = line.indexOf(">")
        if (start === 0 || end === -1) return null;

        const instructionLine = line.slice(0, end).replaceAll(", ", ",").split(",");
        if (instructionLine.length !== instructionProperties.length) return null;

        instructionProperties.forEach((property, i) => {
            let value = instructionLine[i]
            if (property === "headMove") {
                const intVal = Number.parseInt(value)
                if (Number.isNaN(intVal)) {
                    if (value.length) {
                        value = value[0].toUpperCase();
                        headMoves.forEach((hm, i) => {
                            if (value === hm[0].toUpperCase()) {
                                value = i - 1;
                            }
                        });
                    }
                } else {
                    value = intVal;
                }

            }
            inst[property] = value;
        });

        return inst;
    });
    instructions.forEach((inst, i) => {
        if (inst) {
            goodInstructions.push(inst);
        } else {
            badLines.push(i + 1);
        }
    });

    return { instructions: goodInstructions, badLines };
};

export default parseInstructions;
