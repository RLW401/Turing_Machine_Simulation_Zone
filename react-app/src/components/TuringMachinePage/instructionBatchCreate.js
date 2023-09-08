// root/react-app/src/components/TuringMachinePage/instructionBatchCreate.js
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import TextAreaWithNumberedLines from "./textareaWithNumberedLines";

// const BatchCreateInstructions = ({ text, setText }) => {
const BatchCreateInstructions = () => {
    const [text, setText] = useState("");
    const [errors, setErrors] = useState({});
    const submitBatch = () => {
        console.log("Array from batchCreateInstructions: \n", text.split("\n"));
    };
    const batchCreateInstSubmit = (
        <button className="submit batch-create"
        onClick={submitBatch}
        >Create Instructions</button>
    );
    return (
        <>
            <TextAreaWithNumberedLines text={text} setText={setText} />
            {batchCreateInstSubmit}
        </>
    );
};

// const batchCreateInstBtn = (
//     <button className="batch-create"
//     onClick={batchCreateInstructions}
//     >Batch Create Instructions</button>
// );

export default BatchCreateInstructions;
