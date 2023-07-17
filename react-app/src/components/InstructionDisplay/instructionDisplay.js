// root/react-app/src/components/InstructionDisplay/instructionDisplay.js

const InstructionDisplay = ({ instructions, machine }) => {
    machine = { ...machine };

    if (!machine.initTape) machine.initTape = machine.blankSymbol;
    if (!machine.currentState) machine.currentState = machine.initState;

    const headPos = (machine.headPos ? machine.headPos : 0);
    const mState = (machine.currentState ? machine.currentState : machine.initState);
    const mTape = (machine.currentTape ? machine.currentTape : machine.initTape);
    // if (machine.headPos) headPos = machine.headPos;

    // if (machine.currentState) mState = machine.currentState;

    // if (machine.currentTape) {
    //     mTape = machine.currentTape;
    // } else if (machine.initTape) {
    //     mTape = machine.initTape;
    // }

    const scanSymb = mTape[headPos];

    const instList = machine.instructions.map((instId) => {
        const currentInst = instructions[instId];
        let headMove;
        if (currentInst.headMove === -1) {
            headMove = "Left";
        } else if (currentInst.headMove === 0) {
            headMove = "Stop";
        } else if (currentInst.headMove === 1) {
            headMove = "Right";
        }

        const properties = [
            currentInst.currentState, currentInst.scannedSymbol,
            currentInst.nextState, currentInst.printSymbol, headMove
        ]

        const display = properties.join(", ");

        if ((machine.currentState === properties[0]) && (scanSymb === properties[1])) {
            return (<p key={instId} className="active">=&gt; &lt;{display}&gt;</p>);
        } else {
            return (<p key={instId} className="inactive">&lt;{display}&gt;</p>);
        }
    });



    return (
        <div className="machine-instructions">
            <h3>Machine Instructions</h3>
            {instList}
        </div>
    );

};

export default InstructionDisplay;
