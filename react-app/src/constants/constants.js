// root/react-app/src/constants/constants.js

export const validBlanks = ["#", " ", "0"];
export const headMoves = ["Left", "Stop", "Right"];
export const stateSeparator = '|'
export const defaultStates = `Q0${stateSeparator}Qh`;
export const maxHeadMoves = 9001;
export const instructionProperties = ["currentState", "scannedSymbol", "nextState", "printSymbol", "headMove"];

// formTypes for TuringMachineForm
export const createTM = "Add a new machine";
export const updateTM = "Update a machine";

// formTypes for InstructionForm
export const createInst = "Create a new line of instructions";
export const updateInst = "Update a line of instructions";

// url segments
export const genMachUpdatePath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}/update`
);

export const genAddInstPath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}/instructions/new`
);

export const genUpdateInstPath = (machineId = ":machineId", instructionId = ":instructionId") => (
    `/turing-machines/${machineId}/instructions/${instructionId}/update`
);

export const genMachinePath = (machineId = ":machineId") => (
    `/turing-machines/${machineId}`
);


// long descriptions

export const instExConDesc = "First, specify the conditions in which the machine will execute this line of instructions. The execution conditions at each step of the computation are jointly determined by two factors: the internal state of the machine and the symbol on the tape being scanned at that step. ";
export const currentStateDescription = "In which state should this line of instructions be triggered (assuming the symbol specified in the next step is also being scanned). Note that Current State must be selected before Scanned Symbol."
export const scannedSymbolDescription = "Which tape symbol should trigger these instructions upon being scanned (assuming that the machine is also in the state specified in the previous step)?";

export const machOpDesc = "Specify the behavior of the machine when the instruction execution conditions are met.";
export const nextStateDescription = "Into which state should the machine transition from the current state? If the state of the machine should remain unchanged, select the same state you picked above for the current sate.";
export const printSymbolDescription = "What symbol, if any, should replace the scanned symbol? If the scanned symbol should remain  unchanged, make the same selection as scanned symbol above.";
export const headMoveDescription = "Should the read/write head scan one square to the left, one square to the right, or stop? Note that stop can be selected only if the next state is the halting state.";

// landing page about
export const aboutWebzone = "Eventually there will be a more thorough about section with pictures and whatnot, but here are some general tips for making Turing machines. Further information can be found in the forms used for creating machines and instructions. Turing machines on this webzone, unless they start with a blank tape, will always start scanning the leftmost non-blank symbol on their tape. Your goal will generally be to perform some manipulation of the symbols initially on the tape, and then halt with the read/write head scanning the leftmost non-blank symbol on the reconfigured tape. For example, if you wanted to create a machine to invert a binary number (flipping all ones to zeros and all zeros to ones) you could start by creating a machine with one of the blank values other than '0', since we want to distinguish a blank square from a square with the digit 0. The default value of '#' is fine. The alphabet can be {0, 1}, and three states, {Scan Right, Scan Left, Halt}, should be enough. The goal of this machine is to find the end of the binary number by scanning to the right, and then scan back left, flipping each digit on the way back to the beginning of the number. In the Scan Right state, you will need one line of instructions for each possible symbol, {#, 0, 1}. As the machine scans right, it will leave the zeros and ones unchanged, so 'print symbol' and 'scanned symbol' should have the same value. Same with 'current state' and 'next state'. When you hit '#' in the scan right state, that means you have reached the end of the number. Leave the blank square as it is and transition to the next state by setting 'current state' to 'Scan Right' and 'next state' to 'Scan Left'. On the way back, remember to flip the digits with your selections for 'scanned symbol' and 'print symbol' Finally, when you reach the blank to the left of the new number, remember to move the head to the right when transitioning to the halting state, so that the machine will be scanning the leftmost non-blank digit. You can check to see if your machine is working correctly by running it twice and comparing the output at the end of the second run to the original input. Something to think about: what will happen if this machine is started with a blank tape?";
