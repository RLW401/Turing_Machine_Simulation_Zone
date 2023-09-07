// root/react-app/src/store/machineInstructions.js
import { normalizeAll } from "../utils/normalization";
import sameValue from "../utils/sameValue";

import { LOAD_MACHINES } from "./turingMachines";
import { REMOVE_MACHINE } from "./turingMachines";

const prefix = "machineInstructions/";
export const ADD_INSTRUCTION = (prefix + "ADD_INSTRUCTION");
const UPDATE_INSTRUCTION = (prefix + "UPDATE_INSTRUCTION");
export const REMOVE_INSTRUCTION = (prefix + "REMOVE_INSTRUCTION");
export const BATCH_ADD_INSTRUCTIONS = (prefix + "BATCH_ADD_INSTRUCTIONS");

const addInstruction = (machineInstruction) => ({
    type: ADD_INSTRUCTION,
    payload: machineInstruction
});

const updateInstruction = (machineInstruction) => ({
    type: UPDATE_INSTRUCTION,
    payload: machineInstruction
});

const removeInstruction = (idData) => ({
    type: REMOVE_INSTRUCTION,
    payload: idData
});

const batchAddInstructions = (instructionBatch) => ({
    type: BATCH_ADD_INSTRUCTIONS,
    payload: instructionBatch
});

export const createOrEditInstruction = (instructionData, edit=false) => async (dispatch) => {
    try {
        edit = !!edit;
        const machineId = instructionData.machineId;
        const instructionId = instructionData.id;
        const createURL = `/api/turing-machines/${machineId}/machine-instructions/`;
        const fetchURL = (edit ? (createURL + instructionId) : createURL);
        const method = (edit ? "PUT" : "POST");
        const response = await fetch(fetchURL, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(instructionData)
        });
        if (response.ok) {
            const machineInstruction = await response.json();
            if (edit) {
                await dispatch(updateInstruction(machineInstruction));
            } else {
                await dispatch(addInstruction(machineInstruction));
            }
            return machineInstruction;
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

export const deleteInstruction = (idData) => async (dispatch) => {
    try {
        const instructionId = idData.instructionId;
        const machineId = idData.machineId;
        const fetchURL = `/api/turing-machines/${machineId}/machine-instructions/${instructionId}`
        const response = await fetch(fetchURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const deleteMessage = await response.json();
            await dispatch(removeInstruction(idData));
            return deleteMessage;
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

export const batchCreateInstructions = (instructionBatch) => async (dispatch) => {
    try {
        if (instructionBatch?.machineInstructions?.length) {
            const sameMId = sameValue(instructionBatch.machineInstructions, "machineId");
            const machineId = (sameMId ? sameMId["machineInstructions"] : null);

            if (!machineId) {
                throw new Error("Not every instruction in batch has the same machineId");
            }

            const fetchURL = `/api/turing-machines/${machineId}/machine-instructions/batch-create/`
            const response = await fetch(fetchURL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(instructionBatch)
            });

            if (response.ok) {
                instructionBatch = await response.json();
                await dispatch(batchAddInstructions(instructionBatch));
                return instructionBatch;
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

        } else {
            throw new Error("No instructions in this batch.")
        }
    } catch (error) {
        throw error;
    }
};

const initialState = {
    byId: {},
    allIds: []
};

const instructionReducer = (state=initialState, action) => {
    let newState = {
        byId: {},
        allIds: []
    };
    let machineId = null;
    let instructionId = null;



    switch (action.type) {
        case LOAD_MACHINES:
            const instructions = ((action.payload.subObjects && action.payload.subObjects.instructions) ? { ...action.payload.subObjects.instructions } : null )
            if (instructions) {
                newState.allIds = instructions.allIds;
                newState.byId = { ...state.byId, ...instructions.byId };
            }
            return newState;
        case REMOVE_MACHINE:
            machineId = action.payload;
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
        case ADD_INSTRUCTION:
            instructionId = action.payload.id;
            newState.allIds = [ ...state.allIds ];
            // newState.byId = { ...state.byId };
            if (newState.allIds.includes(instructionId)) {
                throw new Error(`Error: Duplicate instruction id (${instructionId})`);
            }
            newState.allIds.push(instructionId);
            // newState.byId[instructionId] = action.payload;
            newState.byId = { ...state.byId, [instructionId]: action.payload };
            return newState;
        case UPDATE_INSTRUCTION:
            instructionId = action.payload.id;
            newState.allIds = [ ...state.allIds ];
            // newState.byId = { ...state.byId };
            // newState.byId[instructionId] = action.payload;
            newState.byId = { ...state.byId, [instructionId]: action.payload };
            return newState;
        case REMOVE_INSTRUCTION:
            instructionId = action.payload.instructionId;
            newState.allIds = state.allIds.filter((instId) => instId !== instructionId);
            newState.byId = { ...state.byId };
            delete newState.byId[instructionId];
            return newState;
        case BATCH_ADD_INSTRUCTIONS:
            newState.allIds = [ ...state.allIds ];
            const normalizedInstructions = normalizeAll(action.payload);
            normalizedInstructions.allIds.forEach((instructionId) => {
                if (newState.allIds.includes(instructionId)) {
                    throw new Error(`Error: Duplicate instruction id (${instructionId})`);
                }
                newState.allIds.push(instructionId);
            });
            newState.byId = [ ...state.byId, ...normalizedInstructions.byId ];
            return newState;
        default:
            return state;
    }
};

export default instructionReducer;
