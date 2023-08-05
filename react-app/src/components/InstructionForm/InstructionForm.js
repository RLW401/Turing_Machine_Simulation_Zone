// root/react-app/src/components/InstructionForm/InstructionForm.js

import { useState, useEffect, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createInst, updateInst, stateSeparator, headMoves } from '../../constants/constants';

import "./instructionForm.css";

const InstructionForm = ({ instruction, formType }) => {
    const machineId = Number(useParams().machineId);
    const history = useHistory();
    const dispatch = useDispatch();
    const [currentState, setCurrentState] = useState(instruction.currentState);
    const [scannedSymbol, setScannedSymbol] = useState(instruction.scannedSymbol);
    const [nextState, setNextState] = useState(instruction.nextState);
    const [printSymbol, setPrintSymbol] = useState(instruction.printSymbol);
    const [headMove, setHeadMove] = useState(instruction.headMove);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [machineInstructions, setMachineInstructions] = useState(null);
    const [symbols, setSymbols] = useState(null);
    const [states, setStates] = useState(null);
    const [userAuth, setUserAuth] = useState(false);
    const [errors, setErrors] = useState({});

    const formHeader = ((currentMachine && userAuth) ? <h2>{`${formType} for ${currentMachine.name}`}</h2>
        : <h2>Machine not found</h2>
    );

    const currentUser = useSelector((state) => {
        return state.session.user;
    });

    const allMachines = useSelector((state) => {
        return state.turingMachines;
    });

    const allInstructions = useSelector((state) => {
        return state.machineInstructions;
    });

    useEffect(() => {
        if (allMachines) {
            setCurrentMachine(allMachines.byId[machineId]);
        }
    }, [allMachines, machineId]);

    useEffect(() => {
        if (allInstructions && currentMachine) {
            const mInst = {};
            if (currentMachine.instructions) {
                currentMachine.instructions.forEach((instId) => {
                    mInst[instId] = allInstructions.byId[instId];
                });
            }
            setMachineInstructions(mInst);
        }
    }, [allInstructions, currentMachine]);

    // make sure user is logged in and authorized to edit the
    // machine with which this line of instructions in associated
    useEffect(() => {
        if ((machineInstructions && currentUser) && currentUser.id) {
            const uId = currentUser.id;
            const oId = currentMachine.ownerId;
            const cId = currentMachine.collaboratorId;
            setUserAuth((uId === oId) || (uId === cId));
        }
    }, [currentUser, machineInstructions]);

    return (
        <form className='instruction-form'>
            {formHeader}
        </form>
    );
};

export default InstructionForm;
