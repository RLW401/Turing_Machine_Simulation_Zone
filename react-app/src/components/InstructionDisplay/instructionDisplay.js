// root/react-app/src/components/InstructionDisplay/instructionDisplay.js
import { headMoves } from "../../constants/constants";

const InstructionDisplay = ({ instructions, machine, userId=null, instructionId=null, page="MachinePage" }) => {
    machine = { ...machine };

    if (!machine.initTape) machine.initTape = machine.blankSymbol;
    if (!machine.currentState) machine.currentState = machine.initState;

    const headPos = (machine.headPos ? machine.headPos : 0);
    const mState = (machine.currentState ? machine.currentState : machine.initState);
    const mTape = (machine.currentTape ? machine.currentTape : machine.initTape);

    const scanSymb = mTape[headPos];

    const instList = machine.instructions.map((instId) => {
        const currentInst = instructions[instId];
        const headMove = headMoves[currentInst.headMove + 1];

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
