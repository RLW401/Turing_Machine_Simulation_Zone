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
            return {...action.payload}
        default:
            return state;
    }
};

export default instructionReducer;
