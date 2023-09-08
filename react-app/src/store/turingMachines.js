// root/react-app/src/store/turingMachines.js
import { normalizeAll } from "../utils/normalization";
import { ADD_INSTRUCTION, BATCH_ADD_INSTRUCTIONS , REMOVE_INSTRUCTION } from "./machineInstructions";

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
    let newState = {
         byId: {},
         allIds: []
    };

    let machineId = null;
    let instructionId = null;
    let newInstIds = [];

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
            machineId = action.payload;
            newState.allIds = state.allIds.filter((mId) => mId !== machineId);
            newState.byId = { ...state.byId };
            delete newState.byId[machineId];
            return newState;
        case ADD_INSTRUCTION:
            instructionId = action.payload.id;
            machineId = action.payload.machineId;
            newState.byId = { ...state.byId };
            newState.allIds = [ ...state.allIds ];
            newInstIds = [ ...state.byId[machineId].instructions ];
            if (newInstIds.includes(instructionId)) {
                throw new Error(`Error: Duplicate instruction id (${instructionId})`);
            }
            newInstIds.push(instructionId);
            newState.byId[machineId] = { ...newState.byId[machineId], instructions: newInstIds };
            return newState;
        case REMOVE_INSTRUCTION:
            // console.log("Hit Remove Instruction in machine reducer");
            // console.log("action.payload: ", action.payload);
            instructionId = action.payload.instructionId;
            machineId = action.payload.machineId;
            newState.byId = { ...state.byId };
            newState.allIds = [ ...state.allIds ];
            newInstIds = state.byId[machineId].instructions.filter((instId) => {
                return (instId !== instructionId);
            });
            newState.byId[machineId] = { ...newState.byId[machineId], instructions: newInstIds };
            return newState;
        case BATCH_ADD_INSTRUCTIONS:
            console.log("Hit BATCH_ADD_INSTRUCTIONS in machine reducer");
            console.log("action.payload: ", action.payload);
            newState.allIds = [ ...state.allIds ];
            const normalizedInstructions = action.payload;
            machineId = normalizedInstructions.machineId;
            const machineForInstructions = { ...state.byId[machineId] };
            const instructions = [ ...machineForInstructions.instructions ];
            normalizedInstructions.allIds.forEach((instructionId) => {
                if (instructions.includes(instructionId)) {
                    throw new Error(`Error: Attempted to add duplicate instruction id (${instructionId}) to machine ${machineForInstructions.name}.`);
                }
                instructions.push(instructionId);
            });
            machineForInstructions.instructions = instructions;

            newState.byId = { ...state.byId, [machineId]: machineForInstructions };
            return newState;
        default:
            return state;
    }
};

export default machineReducer;
