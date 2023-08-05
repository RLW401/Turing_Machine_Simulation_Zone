// root/react-app/src/constants/constants.js

export const validBlanks = ["#", " ", "0"];
export const stateSeparator = '|'
export const defaultStates = `q0${stateSeparator}qh`;

// formTypes for TuringMachineForm
export const createTM = "Add a new machine";
export const updateTM = "Update a machine";

// formTypes for InstructionForm
export const createInst = "Create a new line of instructions ";
export const updateInst = "Update a line of instructions ";

// url segments
// export const machineUpdatePath = "/turing-machines/:machineId/update";
export const genMachUpdatePath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}/update`
);

export const genAddInstPath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}/instructions/new`
);

export const genInstUpdatePath = (machineId = ":machineId", instructionId = ":instructionId") => (
    `/turing-machines/${machineId}/instructions/${instructionId}/update`
);
