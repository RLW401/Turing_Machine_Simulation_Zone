// root/react-app/src/constants/constants.js

export const validBlanks = ["#", " ", "0"];
export const headMoves = ["Left", "Stop", "Right"];
export const stateSeparator = '|'
export const defaultStates = `q0${stateSeparator}qh`;

// formTypes for TuringMachineForm
export const createTM = "Add a new machine";
export const updateTM = "Update a machine";

// formTypes for InstructionForm
export const createInst = "Create a new line of instructions";
export const updateInst = "Update a line of instructions";

// url segments
// export const machineUpdatePath = "/turing-machines/:machineId/update";
export const genMachUpdatePath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}/update`
);

export const genAddInstPath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}/instructions/new`
);

export const genUpdateInstPath = (machineId = ":machineId", instructionId = ":instructionId") => (
    `/turing-machines/${machineId}/instructions/${instructionId}/update`
);


// long descriptions

export const instExConDesc = "First, specify the conditions in which the machine will execute this line of its instructions. The execution conditions at each step of the computation are jointly determined by two factors: the internal state of the machine at that step, and the symbol on the tape being scanned at the same time.";
export const currentStateDescription = "In which state should this line of instructions be triggered (assuming the symbol specified in the next step is also being scanned)?"
export const scannedSymbolDescription = "Which tape symbol should trigger these instructions upon being scanned (assuming that the machine is also in the state specified in the previous step)?";

export const machOpDesc = "Specify the behavior of the machine when the instruction execution conditions are met.";
export const nextStateDescription = "Into which state should the machine transition from the current state? If the state of the machine should remain unchanged, select the same state you picked above for the current sate.";
export const printSymbolDescription = "What symbol, if any, should replace the scanned symbol? If the scanned symbol should remain  unchanged, make the same selection as scanned symbol above.";
export const headMoveDescription = "Should the read/write head scan one square to the left, one square to the right, or stop? Note that stop can be selected only if the next state is the halting state.";
