// root/react-app/src/components/InstructionForm/UpdateInstructionForm.js

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InstructionForm from "./InstructionForm";
import { updateInst } from "../../constants/constants";

const UpdateInstructionForm = () => {
    const machineId = Number(useParams().machineId);
    const instructionId = Number(useParams().instructionId);
    const [instruction, setInstruction] = useState(null);
    const [machine, setMachine] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userAuth, setUserAuth] = useState(false);

    const loadCurrentUser = useSelector((state) => {
        return state.session.user;
    });

    const loadMachines = useSelector((state) => {
        return state.turingMachines;
    });

    const loadInstructions = useSelector((state) => {
        return state.machineInstructions;
    });

    // set machine, instruction, and user
    useEffect(() => {
        if ((loadMachines && loadInstructions) && loadCurrentUser) {
            if (loadMachines.byId[machineId]) {
                setMachine(loadMachines.byId[machineId]);
            }
            if (loadInstructions.byId[instructionId]) {
                setInstruction(loadInstructions.byId[instructionId]);
            }
            if (loadCurrentUser.id) {
                setCurrentUser(loadCurrentUser);
            }
        }
    }, [loadMachines, loadInstructions, loadCurrentUser, machineId, instructionId]);

    // set userAuth
    useEffect(() => {
        if ((machine && instruction) && currentUser) {
            const uId = currentUser.id;
            const ownerId = machine.ownerId;
            const collaboratorId = machine.collaboratorId;
            const machineAuth = (uId === ownerId) || (uId === collaboratorId);
            const instructionAuth = (instruction.machineId === machine.id);
            setUserAuth(machineAuth && instructionAuth);
        }
    }, [machine, instruction, currentUser]);

    if (userAuth) {
        return <InstructionForm instruction={instruction} formType={updateInst}/>
    } else if (!machine) {
        return (<h2 className="error-heading">{`Machine with id ${machineId} not found`}</h2>);
    } else if (!instruction) {
        return (<h2 className="error-heading">{`Instruction with id ${instructionId} for machine ${machine.name} not found`}</h2>);
    } else {
        return (<h2 className="error-heading">User not authorized to edit instructions for this machine</h2>);
    }
};

export default UpdateInstructionForm;
