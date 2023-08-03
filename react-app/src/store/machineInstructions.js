// root/react-app/src/store/machineInstructions.js

import { LOAD_MACHINES } from "./turingMachines";
import { REMOVE_MACHINE } from "./turingMachines";

const initialState = {
    byId: {},
    allIds: []
};

const instructionReducer = (state=initialState, action) => {
    let newState = {};

    switch (action.type) {
        case LOAD_MACHINES:
            const instructions = { ...action.payload.subObjects.instructions };
            newState.allIds = instructions.allIds;
            newState.byId = { ...state.byId, ...instructions.byId };
            return newState;
        case REMOVE_MACHINE:
            const machineId = action.payload;
            const remainingIds = [];
            const remainingInstructions = {};
            state.allIds.forEach((instId) => {
                const currentInstruction = { ...state.byId[instId] };
                if (currentInstruction.machineId !== machineId) {
                    remainingIds.push(instId);
                    remainingInstructions[instId] = currentInstruction;
                }
            });
            newState.allIds = remainingIds;
            newState.byId = remainingInstructions;
            return newState;
        default:
            return state;
    }
};

export default instructionReducer;
