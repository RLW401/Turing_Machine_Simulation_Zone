// root/react-app/src/components/TuringMachinePage/turingStep.js

//
export const turingStep = (machine, instructions) => {
    machine = { ...machine };
    instructions = { ...instructions };

    const mBlank = machine.blankSymbol;

    if (!machine.currentTape && (typeof machine.currentTape === "string")) {
        machine.currentTape = mBlank;
    }

    if (!machine.currentState) {
        machine.currentState = machine.initState;
    }

    if (!machine.currentTape) {
        if (machine.initTape) {
            machine.currentTape = machine.initTape;
        } else {
            machine.currentTape = mBlank;
        }
    }

    // if (!machine.headPos || (machine.headPos < 0)) machine.headPos = 0;
    if (!machine.headPos) machine.headPos = 0;

    let mTape = machine.currentTape;
    let mState = machine.currentState;
    let headPos = machine.headPos;
    // the symbol currently scanned by the head
    const scanSymb = mTape[headPos];

    // find the correct instruction
    let mInst = null;
    for (let i = 0; i < machine.instructions.length; i++) {
        const instId = machine.instructions[i];
        const currentInstruction = instructions[instId];
        if (
            (scanSymb === currentInstruction.scannedSymbol)
            && (mState === currentInstruction.currentState)
            ) {
                mInst = currentInstruction;
        }
    }
    if (!mInst) {
        // throw new Error(`Error: No instruction found for state ${mState} and scanned symbol ${scanSymb}.`);

        machine.missingInstruction = {
            errorMsg: `Your machine was automatically reset because it entered a configuration not covered by any of its instructions: \nNo instruction found for state ${mState} and scanned symbol ${scanSymb}.`,
            state: mState,
            symbol: scanSymb,
    };
        return machine;
    }

    // print symbol
    mTape = ((mTape.slice(0, headPos) + mInst.printSymbol) + mTape.slice(headPos + 1));
    // switch state
    mState = mInst.nextState;
    // move head
    headPos += mInst.headMove;
    // expand tape as necessary
    if (headPos === -1) {
        mTape = (mBlank + mTape);
        headPos = 0;
    } else if (headPos === mTape.length) {
        mTape = (mTape + mBlank);
    }

    machine.currentTape = mTape;
    machine.currentState = mState;
    machine.headPos = headPos;

    return machine;
};
