// root/react-app/src/components/InstructionForm/InstructionForm.js

import { useState, useEffect, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createInst, updateInst, stateSeparator, headMoves, instExConDesc, currentStateDescription, scannedSymbolDescription, machOpDesc, nextStateDescription, printSymbolDescription, headMoveDescription } from '../../constants/constants';
import InstructionDisplay from '../InstructionDisplay/instructionDisplay';

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
    const [submissionAttempt, setSubmissionAttempt] = useState(false);

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

    // When instructions and machine are loaded, set machine
    // instructions, symbols, and states.
    useEffect(() => {
        if (allInstructions && currentMachine) {
            const mInst = {};
            if (currentMachine.instructions) {
                currentMachine.instructions.forEach((instId) => {
                    mInst[instId] = allInstructions.byId[instId];
                });
            }
            setMachineInstructions(mInst);
            setSymbols((currentMachine.blankSymbol + currentMachine.alphabet).split(""));
            setStates(currentMachine.states.split(stateSeparator));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionAttempt(true);

        const errTypes = Object.keys(errors);
        for (let i = 0; i < errTypes.length; i++) {
            if (errors[errTypes[i]].length) return;
        }


        setSubmissionAttempt(false);
        if (formType === createInst) {

        } else if (formType === updateInst) {

        }
        return;
    };

    return (
        (symbols && states) && <form className='instruction-form' onSubmit={handleSubmit}>
            {formHeader}
            <div className='body'>
                <div className='execution-conditions'>
                    <h3>Instruction Execution Conditions</h3>
                    <p className='description'>{instExConDesc}</p>
                    <div className='form-group'>
                        <h4 className='heading'>Current State</h4>
                        <p className='description'>{currentStateDescription}</p>
                        <select name="currentState" value={currentState} onChange={(e) => setCurrentState(e.target.value)}>
                            {states.map((state) => <option key={state} value={state}>{state}</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <h4 className='heading'>Scanned Symbol</h4>
                        <p className='description'>{scannedSymbolDescription}</p>
                        <select name="scannedSymbol" value={scannedSymbol} onChange={(e) => setScannedSymbol(e.target.value)}>
                            {symbols.map((symbol) => <option key={symbol} value={symbol}>&lsquo;{symbol}&rsquo;</option>)}
                        </select>
                    </div>

                </div>
                <div className='machine-operations'>
                    <h3>Machine Operations</h3>
                    <p className='description'>{machOpDesc}</p>
                    <div className='form-group'>
                        <h4 className='heading'>Next State</h4>
                        <p className='description'>{nextStateDescription}</p>
                        <select name="nextState" value={nextState} onChange={(e) => setNextState(e.target.value)}>
                            {states.map((state) => <option key={state} value={state}>{state}</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <h4 className='heading'>Print Symbol</h4>
                        <p className='description'>{printSymbolDescription}</p>
                        <select name="printSymbol" value={printSymbol} onChange={(e) => setPrintSymbol(e.target.value)}>
                            {symbols.map((symbol) => <option key={symbol} value={symbol}>&lsquo;{symbol}&rsquo;</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <h4 className='heading'>Head Move</h4>
                        <p className='description'>{headMoveDescription}</p>
                        <select name="headMove" value={headMove} onChange={(e) => setHeadMove(e.target.value)}>
                            {headMoves.map((move) => <option key={move} value={move}>{move}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </div>
            <div className='info'>
                {(currentMachine && machineInstructions) ? <InstructionDisplay instructions={machineInstructions} machine={currentMachine} /> : null}
            </div>
        </form>
    );
};

export default InstructionForm;
