// root/react-app/src/components/DeleteInstruction/index.js

import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteInstruction } from "../../store/machineInstructions";

const DeleteInstructionModal = ({ machineId, instructionId, instructionStr }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal, setModalContent, onModalClose, setOnModalClose } = useModal();

    const idData = {
        machineId: Number(machineId),
        instructionId: Number(instructionId),
    };

    const deleteClick = async () => {
        await dispatch(deleteInstruction(idData));
        closeModal();
    };

    const deleteOptions = (
        <div className="delete-options">
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to remove the following line of instructions?</h4>
            {instructionStr}
            <div className="delete-buttons">
                <button
                    className="confirm delete"
                    onClick={deleteClick}
                >
                    Yes (Delete Instruction)
                </button>
                <button
                    className="abort"
                    onClick={() => closeModal()}
                >
                    No (Keep Instruction)
                </button>
            </div>

        </div>
    );


    const deleteButton = (
        <button
            className="delete small"
            title="Permanently delete this line of machine instructions"
            onClick={() => {
                setModalContent(deleteOptions);
            }}>D</button>);

    return deleteButton;
};

export default DeleteInstructionModal;
