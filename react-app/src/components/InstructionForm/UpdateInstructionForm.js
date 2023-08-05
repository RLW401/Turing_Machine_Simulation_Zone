// root/react-app/src/components/InstructionForm/UpdateInstructionForm.js

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InstructionForm from "./InstructionForm";
import { updateInst } from "../../constants/constants";

const UpdateInstructionForm = () => {
    const machineId = Number(useParams().machineId);
    const instructionId = Number(useParams().instructionId);

    return null;
};

export default UpdateInstructionForm;
