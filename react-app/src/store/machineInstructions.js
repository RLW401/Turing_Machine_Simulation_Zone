// root/react-app/src/store/machineInstructions.js

import { LOAD_MACHINES } from "./turingMachines";

const initialState = {
    byId: {},
    allIds: []
};

const instructionReducer = (state=initialState, action) => {
    let newState = {};

    switch (action.type) {
        case LOAD_MACHINES:
            const instructions = { ...action.payload.subObjects.instructions };
            newState.byId = { ...state.byId, ...instructions.byId };
            newState.allIds = instructions.allIds;
            return newState;
        default:
            return state;
    }
};

export default instructionReducer;
