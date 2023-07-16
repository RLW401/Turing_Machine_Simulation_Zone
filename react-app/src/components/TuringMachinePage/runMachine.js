// root/react-app/src/components/TuringMachinePage/runMachine.js
import { trimBlanks } from "../../utils/trimBlanks";

export const runMachine = (machine, instructions, tape = null) => {
    const maxHeadMoves = 9001;
    const mBlank = machine.blankSymbol;
    let mTape = mBlank;
    let headPos = 0;
    let mState = machine.initState;
    let headMoves = 0;

    if (!tape && (typeof tape === "string")) tape = mBlank;


    if (tape) {
        mTape = tape;
    } else if (machine.currentTape) {
        mTape = machine.currentTape;
    } else if (machine.initTape) {
        mTape = machine.initTape;
    }

    if (machine.headPos) headPos = machine.headPos;
    if (machine.currentState) mState = machine.currentState;

    // bugtest
    // mTape = '000111111111';
    // bugtest

    while ((mState !== machine.haltingState) && (headMoves <= maxHeadMoves)) {
        let mInst = null;
        let scanSymb = mTape[headPos];
        // machine.instructions.forEach((instId) => {
        for (let i = 0; i < machine.instructions.length; i++) {
            const instId = machine.instructions[i];
            const currentInstruction = instructions.byId[instId];
            if (
                (scanSymb === currentInstruction.scannedSymbol)
                && (mState === currentInstruction.currentState)
                ) {
                    mInst = currentInstruction;
            }
        }
        // });
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
        // keep track of number of times head has moved
        headMoves++;
        console.log(`mTape at step ${headMoves}: ${mTape}`);
    }
    const trimResult = trimBlanks(mTape, mBlank);
    headPos -= trimResult.leadingBlanks;
    mTape = trimResult.newString;
    return [mTape, headPos, headMoves];
};
