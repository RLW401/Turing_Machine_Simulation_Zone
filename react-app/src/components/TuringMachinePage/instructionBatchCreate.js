// root/react-app/src/components/TuringMachinePage/instructionBatchCreate.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { batchCreateInstructions } from "../../store/machineInstructions";
import TextAreaWithNumberedLines from "./textareaWithNumberedLines";
import parseInstructions from "../../utils/parseInstructions";

const BatchCreateInstructions = ({ showBatchInput, setShowBatchInput }) => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [errors, setErrors] = useState({});
    const machineId = Number.parseInt(useParams().machineId);
    const submitBatch = async (e) => {
        e.preventDefault()
        const instructions = parseInstructions(text, machineId);
        const instructionBatch = { machineInstructions: instructions.instructions };
        // console.log("instructionBatch: ", instructionBatch);
        if (instructionBatch.machineInstructions.length) {
            const addedInstructions = await dispatch(batchCreateInstructions(instructionBatch));
        }
    };
    const batchCreateInstSubmit = (
        <button className="submit batch-create"
        onClick={submitBatch}
        >Create Instructions</button>
    );
    const batchCreateInstCancel = (
        <button className="cancel batch-create"
        onClick={() => setShowBatchInput(false)}
        >Cancel</button>
    );
    const submitAndCancelBtns = (
        <div className="batch-create submit-and-cancel">
            {batchCreateInstSubmit}
            {batchCreateInstCancel}
        </div>
    );


    return (
        <>
            <TextAreaWithNumberedLines text={text} setText={setText} />
            {submitAndCancelBtns}
        </>
    );
};

export default BatchCreateInstructions;
