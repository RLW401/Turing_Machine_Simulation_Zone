// root/react-app/src/store/turingMachines.js
import { normalizeAll } from "../utils/normalization";

const prefix = "turingMachines/"
export const LOAD_MACHINES = (prefix + "LOAD_MACHINES");
const ADD_MACHINE = (prefix + "ADD_MACHINE");
const UPDATE_MACHINE = (prefix + "UPDATE_MACHINE");
export const REMOVE_MACHINE = (prefix + "REMOVE_MACHINE");

const loadMachines = (turingMachines) => ({
    type: LOAD_MACHINES,
    payload: turingMachines
});

const addMachine = (turingMachine) => ({
    type: ADD_MACHINE,
    payload: turingMachine
});

const updateMachine = (turingMachine) => ({
    type: UPDATE_MACHINE,
    payload: turingMachine
});

const removeMachine = (machineId) => ({
    type: REMOVE_MACHINE,
    payload: machineId
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
            // return normalizedMachine;
            return turingMachine;
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

export const editMachine = (machineData) => async (dispatch) => {
    try {
        const machineId = machineData.id;
        const response = await fetch(`/api/turing-machines/${machineId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(machineData)
        });

        if (response.ok) {
            const turingMachine = await response.json();
            const normalizedMachine = normalizeAll({ Turing_Machine: [turingMachine] });
            await dispatch(updateMachine(normalizedMachine));
            // return normalizedMachine;
            return normalizedMachine.byId[machineId];
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

export const deleteMachine = (machineId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/turing-machines/${machineId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
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
        const deleteMessage = await response.json();
        dispatch(removeMachine(machineId));
        return deleteMessage;
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
            newState.allIds = action.payload.allIds;
            newState.byId = { ...state.byId, ...action.payload.byId };
            return newState
        case ADD_MACHINE:
            newState.allIds = [ ...state.allIds, ...action.payload.allIds ];
            newState.byId = { ...state.byId, ...action.payload.byId };
            return newState;
        case UPDATE_MACHINE:
            const updatedMachineId = action.payload.allIds[0];
            newState.allIds = [ ...state.allIds ];
            newState.byId = { ...state.byId, ...action.payload.byId };
            newState.byId[updatedMachineId] = { ...action.payload.byId[updatedMachineId] };
            return newState;
        case REMOVE_MACHINE:
            const deletedMachineId = action.payload;
            const allIds = state.allIds.filter((mId) => mId !== deletedMachineId);
            const byId = {};
            allIds.forEach((mId) => {
                byId[mId] = { ...state.byId[mId] }
            });
            newState.allIds = allIds;
            newState.byId = byId;
            return newState;
        default:
            return state;
    }
};

export default machineReducer;
