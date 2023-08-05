// root/react-app/src/components/InstructionForm/InstructionForm.js

import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createInst, updateInst } from '../../constants/constants';

import "./instructionForm.css";

const InstructionForm = ({ instruction, formType }) => {
    const history = useHistory();
    const dispatch = useDispatch();
};

export default InstructionForm;
