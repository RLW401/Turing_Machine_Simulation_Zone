import { csrfFetch } from "./csrf";
import { normalizeAll } from "../utils/normalization";

const prefix = "turingMachines/"
export const LOAD_MACHINES = prefix + "LOAD_MACHINES";

const loadMachines = (turingMachines) => ({
    type: LOAD,
    payload: turingMachines
});

export const getAuthorizedTMs = () => async (dispatch) => {
    try {
        const response = await fetch("/api/turing-machines/authorized", {
            "headers": {"Content-Type": "application/json"}
        });

        if (response.ok) {
            const turingMachines = await response.json();
            dispatch(loadMachines(turingMachines));
            return turingMachines;
        }
    } catch (error) {
        throw error;
    }
};

const initialState = {};

const machineReducer = (state=initialState, action) => {
    let newSate = {};

    switch (action.type) {
        case LOAD_MACHINES:
            return { ...state, ...action.payload }

    }
};

export default machineReducer;
