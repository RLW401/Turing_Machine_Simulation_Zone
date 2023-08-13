// root/react-app/src/components/TuringMachineForm/UpdateMachineForm.js

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MachineForm from "./MachineForm";
import { updateTM } from "../../constants/constants";
import "./machineForm.css";

const UpdateMachineForm = () => {
    const formType = updateTM;
    const machineId = Number(useParams().machineId);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [userAuth, setUserAuth] = useState(false);

    const loadCurrentUser = useSelector((state) => {
        return state.session.user;
    });

    const loadMachines = useSelector((state) => {
        return state.turingMachines;
    });

    // set the current machine
    useEffect(() => {
        if (loadMachines && loadMachines.byId[machineId]) {
            setCurrentMachine(loadMachines.byId[machineId])
        }
    }, [loadMachines, machineId]);

    useEffect(() => {
        if ((currentMachine && loadCurrentUser) && loadCurrentUser.id) {
            const uId = loadCurrentUser.id;
            const ownerId = currentMachine.ownerId;
            const collaboratorId = currentMachine.collaboratorId;
            setUserAuth((uId === ownerId) || (uId === collaboratorId));
        }
    }, [currentMachine, loadCurrentUser]);

    if (currentMachine && userAuth) {
        return (<MachineForm machine={currentMachine} formType={formType} />);
    } else if (!currentMachine) {
        return (<h2 className="error-heading">Machine not found</h2>);
    } else {
        return (<h2 className="error-heading">User not authorized to edit machine</h2>);
    }
};

export default UpdateMachineForm;
