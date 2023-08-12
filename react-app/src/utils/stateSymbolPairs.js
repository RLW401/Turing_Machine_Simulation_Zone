// root/react-app/src/utils/stateSymbolPairs.js
import { stateSeparator } from "../constants/constants";

const stateSymbolPairs = (states, symbols) => {
    const pairs = [];
    states.forEach((state) => {
        symbols.forEach((symbol) => {
            const sSP = [state, symbol];
            pairs.push(sSP);
        });
    });
    return pairs;
};

export const extractStateSymbolPairs = (machine) => {
    const states = machine.states.split('|');
    const symbols = (machine.blankSymbol + machine.alphabet).split("");
    return stateSymbolPairs(states, symbols);
};

export const availablePairs = (sSPairs, instructions) => {
    const takenPairs = [];
    const result = [];
    Object.keys(instructions).forEach((instructionId) => {
        const inst = instructions[instructionId];
        const scannedSymbol = inst.scannedSymbol;
        const currentState = inst.currentState;
        takenPairs.push([scannedSymbol, currentState]);
    });
    sSPairs.forEach((pair) => {
        let taken = false;
        for (let i = 0; i < takenPairs.length; i++) {
            const tPair = takenPairs[i];
            if ((tPair[0] === pair[0]) && (tPair[1] === pair[1])) {
                taken = true;
            }
        }
        if (!taken) {
            result.push(pair);
        }
    });
    return result;
};

export const availableStates = (availablePairs, symbol) => {
    const result = [];
    availablePairs.forEach((pair) => {
        if (pair[1] === symbol) result.push(pair[0]);
    });
    return result;
}

export const availableSymbols = (availablePairs, state) => {
    const result = [];
    availablePairs.forEach((pair) => {
        if (pair[0] === state) result.push(pair[1]);
    });
    return result;
};
