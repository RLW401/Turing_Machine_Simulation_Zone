// root/react-app/src/components/TuringMachineForm/CreateMachineForm.js

import MachineForm from "./MachineForm";
import { createTM, defaultStates, stateSeparator, validBlanks } from "../../constants/constants";

const testStates = `start${stateSeparator}first${stateSeparator}second${stateSeparator}third${stateSeparator}halt`
const stateArr = defaultStates.split(stateSeparator);
const testStateArr = testStates.split(stateSeparator);
// const dev = false;
const dev = true;

const devMachine = {
    name: "Test Machine 0",
    notes: "Notes Notes Notes Notes",
    blankSymbol: validBlanks[0],
    alphabet: "abAB",
    initTape: "AaBb",
    initState: testStateArr[0],
    haltingState: testStateArr[testStateArr.length - 1],
    states: testStates,
};

const productionMachine = {
    name: "",
    notes: "",
    blankSymbol: validBlanks[0],
    alphabet: "",
    initTape: "",
    initState: stateArr[0],
    haltingState: stateArr[stateArr.length - 1],
    states: defaultStates,
};

const CreateMachineForm = () => {
    const machine = (dev ? devMachine : productionMachine);
    return <MachineForm machine={machine} formType={createTM} />
};

export default CreateMachineForm;
