// root/react-app/src/components/InstructionDisplay/instructionDisplay.js

import { useHistory } from "react-router-dom";
import DeleteInstructionModal from "../DeleteInstruction";
import { genAddInstPath, genUpdateInstPath, headMoves } from "../../constants/constants";

const InstructionDisplay = ({ instructions, machine, buttonDisplay=false, selectedInstructionId=null, fullInstructions=false }) => {
    const history = useHistory();
    machine = { ...machine };
    machine.instructions = [ ...machine.instructions ];

    if (!machine.initTape) machine.initTape = machine.blankSymbol;
    if (!machine.currentState) machine.currentState = machine.initState;

    const headPos = (machine.headPos ? machine.headPos : 0);
    const mState = (machine.currentState ? machine.currentState : machine.initState);
    const mTape = (machine.currentTape ? machine.currentTape : machine.initTape);

    const scanSymb = mTape[headPos];

    // button for adding lines of instructions
    const addInstructionButton = (
        <button className="add-instruction" disabled={fullInstructions}
        title={fullInstructions ? "Your machine already has a line of instructions for every possible state-symbol pair. To change your machine's behavior, edit its existing instructions, or edit your machine to add additional symbols or states." : "Add new instructions to your machine."}
        onClick={
            () => history.push(genAddInstPath(machine.id))
        }>+ Add Instruction</button>
    );

    // button for updating a line of instructions
    const genUpdateInstButton = (machineId, instructionId) => {
        const buttonLink = genUpdateInstPath(machineId, instructionId);
        const updateInstButton = (
            <button className="update small"
            title="Update this line of machine instructions"
            onClick={() => history.push(buttonLink)
            }>U</button>
        );
        return updateInstButton;
    };

    const instList = machine.instructions.map((instId) => {
        const currentInst = instructions[instId];
        const headMove = headMoves[currentInst.headMove + 1];

        const properties = [
            currentInst.currentState, currentInst.scannedSymbol,
            currentInst.nextState, currentInst.printSymbol, headMove
        ]

        const display = properties.join(", ");

        let instructionStr = null;

        if (((machine.currentState === properties[0]) && (scanSymb === properties[1])) && !selectedInstructionId) {
            instructionStr = (<p className="active">=&gt; &lt;{display}&gt;</p>);
        } else if (selectedInstructionId === instId) {
            instructionStr = (<p className="active">=&gt; &lt;{display}&gt;</p>);
        } else {
            instructionStr = (<p className="inactive">&lt;{display}&gt;</p>);
        }
        const instructionLine = (
            <div className="instruction-line" key={instId}>
                {instructionStr}
                {buttonDisplay && genUpdateInstButton(machine.id, instId)}
                {buttonDisplay && <DeleteInstructionModal machineId={machine.id} instructionId={instId} instructionStr={instructionStr} />}
            </div>
        );
        return instructionLine;
    });






    return (
        <div className="machine-instructions">
            <h3>{`Machine Instructions for ${machine.name}`}</h3>
            {instList}
            {buttonDisplay && addInstructionButton}
        </div>
    );

};

export default InstructionDisplay;
