// root/react-app/src/components/TuringMachineForm/CreateMachineForm.js

import MachineForm from "./MachineForm";

const formType = "Create Turing Machine";
const dev = false;

const devMachine = null;

const productionMachine = {
    name: "",
    notes: "",
    blankSymbol: "",
    alphabet: "",
    initTape: "",
    initState: "",
    haltingState: "",
    states: "",
};

const CreateMachineForm = () => {
    const machine = (dev ? devMachine : productionMachine);
    return <MachineForm machine={machine} formType={formType} />
};

export default CreateMachineForm;
