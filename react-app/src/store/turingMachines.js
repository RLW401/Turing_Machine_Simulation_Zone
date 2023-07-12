// root/react-app/src/store/turingMachines.js
import { normalizeAll } from "../utils/normalization";

const prefix = "turingMachines/"
export const LOAD_MACHINES = prefix + "LOAD_MACHINES";

const loadMachines = (turingMachines) => ({
    type: LOAD_MACHINES,
    payload: turingMachines
});

export const getAuthorizedTMs = () => async (dispatch) => {
    try {
        const response = await fetch("/api/turing-machines/authorized", {
            "headers": {"Content-Type": "application/json"}
        });

        if (response.ok) {
            const turingMachines = await response.json();
            const normalizedMachines = normalizeAll(turingMachines);
            dispatch(loadMachines(normalizedMachines));
            return normalizedMachines;
        }
    } catch (error) {
        throw error;
    }
};

const initialState = {
    byId: {},
    allIds: []
};

const machineReducer = (state=initialState, action) => {
    let newState = {};

    switch (action.type) {
        case LOAD_MACHINES:
            newState.byId = { ...state.byId, ...action.payload.byId };
            newState.allIds = action.payload.allIds;
            return newState
        default:
            return state;
    }
};

export default machineReducer;
