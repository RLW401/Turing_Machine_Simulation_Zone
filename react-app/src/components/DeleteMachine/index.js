// root/react-app/src/components/DeleteMachine/index.js

import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteMachine } from "../../store/turingMachines";
import "./deleteMachine.css";

const DeleteMachineModal = ({ machineRunning=false }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal, setModalContent, onModalClose, setOnModalClose } = useModal();
    const machineId = Number(useParams().machineId);

    const deleteClick = async () => {
        await dispatch(deleteMachine(machineId));
        closeModal();
        history.push("/");
    };

    const deleteOptions = (
        <div className="delete-options">
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to remove this machine?</h4>
            <div className="delete-buttons">
                <button
                    className="confirm delete"
                    onClick={deleteClick}
                >
                    Yes (Delete Machine)
                </button>
                <button
                    className="abort"
                    onClick={() => closeModal()}
                >
                    No (Keep Machine)
                </button>
            </div>

        </div>
    );


    const deleteButton = (
        <button
            className="delete"
            disabled={machineRunning}
            title="Permanently delete this Turing machine"
            onClick={() => {
                setModalContent(deleteOptions);
            }}>Delete Machine</button>);

    return deleteButton;
};

export default DeleteMachineModal;
