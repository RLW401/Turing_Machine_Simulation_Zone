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

export const availablePairs = (sSPairs, instructions) => {
    const takenPairs = [];
    const result = [];
    Object.keys(instructions).forEach((instructionId) => {
        const inst = instructions[instructionId];
        const scannedSymbol = inst.scannedSymbol;
        const currentState = inst.currentState;
        takenPairs.push([currentState, scannedSymbol]);
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

export const allSSOptions = (availablePairs) => {
    const result = {
        stateOptions: {},
        symbolOptions: {},
    };
    const stateSet = new Set();
    const symbolSet = new Set();

    availablePairs.forEach((pair) => {
        const state = pair[0];
        const symbol = pair[1];
        stateSet.add(state);
        symbolSet.add(symbol);
        // check to see if this state has already been found
        if (!result.stateOptions[symbol]) {
            result.stateOptions[symbol] = [];
        }
        // add the symbol as an option for the state
        result.stateOptions[symbol].push(state);
        // check to see if this symbol has already been found
        if (!result.symbolOptions[state]) {
            result.symbolOptions[state] = [];
        }
        // add the symbol as an option for the state
        result.symbolOptions[state].push(symbol);
    });
    result.availableStates = Array.from(stateSet);
    result.availableSymbols = Array.from(symbolSet);
    return result;
};

export default stateSymbolPairs;
