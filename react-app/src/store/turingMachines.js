// root/react-app/src/store/turingMachines.js
import { normalizeAll } from "../utils/normalization";

const prefix = "turingMachines/"
export const LOAD_MACHINES = (prefix + "LOAD_MACHINES");
const ADD_MACHINE = (prefix + "ADD_MACHINE");

const loadMachines = (turingMachines) => ({
    type: LOAD_MACHINES,
    payload: turingMachines
});

const addMachine = (turingMachine) => ({
    type: ADD_MACHINE,
    payload: turingMachine
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

export const createMachine = (machineData) => async (dispatch) => {
    try {
        const response = await fetch("/api/turing-machines/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(machineData)
        });

        if (response.ok) {
            const turingMachine = await response.json();
            const normalizedMachine = normalizeAll({ Turing_Machine: [turingMachine] });
            await dispatch(addMachine(normalizedMachine));
            return normalizedMachine;
        } else {
            const error = await response.text();
            let errorJSON;
            try {
                // check to see if error is JSON
                errorJSON = JSON.parse(error);
            } catch {
                // error was not from server
                throw new Error(error);
            }
            throw new Error(`${errorJSON.title}: ${errorJSON.message}`);
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
        case ADD_MACHINE:
            newState.byId = { ...state.byId, ...action.payload.byId };
            newState.allIds = [ ...state.allIds, ...action.payload.allIds ];
            return newState;
        default:
            return state;
    }
};

export default machineReducer;
