// root/react-app/src/components/InstructionForm/CreateInstructionForm.js

import InstructionForm from "./InstructionForm";
import { createInst } from "../../constants/constants";

// const dev = false;
const dev = false;

const devInstruction = {
    currentState: "First State",
    scannedSymbol: "A",
    nextState: "Next State",
    printSymbol: "B",
    headMove: 1,
};

const productionInstruction = {
    currentState: "",
    scannedSymbol: "",
    nextState: "",
    printSymbol: "",
    headMove: null,
};

const CreateInstructionForm = () => {
    const instruction =  (dev ? devInstruction : productionInstruction);
    return <InstructionForm instruction={instruction} formType={createInst} />
};

export default CreateInstructionForm;
