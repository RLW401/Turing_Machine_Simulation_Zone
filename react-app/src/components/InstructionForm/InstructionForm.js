// root/react-app/src/components/InstructionForm/InstructionForm.js

import { useState, useEffect, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createOrEditInstruction } from '../../store/machineInstructions';

import { createInst, updateInst, stateSeparator, headMoves, instExConDesc, currentStateDescription, scannedSymbolDescription, machOpDesc, nextStateDescription, printSymbolDescription, headMoveDescription } from '../../constants/constants';
import InstructionDisplay from '../InstructionDisplay/instructionDisplay';

import "./instructionForm.css";

const InstructionForm = ({ instruction, formType }) => {
    const machineId = Number(useParams().machineId);
    const history = useHistory();
    const dispatch = useDispatch();
    const selectedInstructionId = ((formType === updateInst) ? instruction.id : -1);
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

    // error handling
    useEffect(() => {
        const validationErrors = {
            currentState: [], scannedSymbol: [],
            nextState: [], printSymbol: [], headMove: [],
        };

        if ((machineInstructions && currentMachine) && states) {
            Object.keys(machineInstructions).forEach((instId) => {
                const currentInstruction = machineInstructions[instId];
                if ((currentInstruction.currentState === currentState) && (currentInstruction.scannedSymbol === scannedSymbol)) {
                    if ((formType === createInst) || (instruction.id !== currentInstruction.id)) {
                        const dupExConErr = `The machine ${currentMachine.name} already has a line of instructions with execution conditions (${currentState + ", " + scannedSymbol}). Each line of machine instructions must have unique execution conditions`;
                        validationErrors.currentState.push(dupExConErr);
                        validationErrors.scannedSymbol.push(dupExConErr);
                    }
                }
            });

            // if headMove is set to Stop and nextState is not the halting state
            if ((headMove === 0) && (nextState !== states[states.length - 1])) {
                const prematureStop = `The head move option "Stop" can be selected only if the next state is the halting state`;
                validationErrors.nextState.push(prematureStop);
                validationErrors.headMove.push(prematureStop);
            }

            if (!(currentState && states.includes(currentState))) {
                validationErrors.currentState.push(`Current state must be one of the following states: ${states.slice(0, (states.length - 1)).join(", ")}.`);
            }
            if (!(scannedSymbol && symbols.includes(scannedSymbol))) {
                validationErrors.scannedSymbol.push(`Scanned symbol must be one of the following symbols: ${symbols.join(", ")}.`);
            }
            if (!(nextState && states.includes(nextState))) {
                validationErrors.nextState.push(`Next state must be one of the following states: ${states.join(", ")}.`);
            }
            if (!(printSymbol && symbols.includes(printSymbol))) {
                validationErrors.printSymbol.push(`Print symbol must be one of the following symbols: ${symbols.join(", ")}.`);
            }
            if (!Number.isInteger(headMove) || (Math.abs(headMove) > 1)) {
                const badHeadMove = `Head move must be an integer between -1 and 1, inclusive.`
                validationErrors.headMove.push(badHeadMove);
            }

        } else {
            validationErrors.notLoaded = [`not loaded`];
        }
        setErrors(validationErrors);
    }, [currentState, scannedSymbol, nextState, printSymbol, headMove, machineInstructions, currentMachine, states]);

    // // head move debugging
    // useEffect(() => {
    //     console.log("headMove: ", headMove);
    // }, [headMove]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionAttempt(true);

        const errTypes = Object.keys(errors);
        for (let i = 0; i < errTypes.length; i++) {
            if (errors[errTypes[i]].length) return;
        }

        instruction = {
            ...instruction, machineId, currentState, scannedSymbol,
            nextState, printSymbol, headMove,
        };


        setSubmissionAttempt(false);
        if (formType === createInst) {
            const newInstruction = await dispatch(createOrEditInstruction(instruction));
            console.log("newInstruction: ", newInstruction);
            history.push(`/machines/${newInstruction.machineId}`);
        } else if (formType === updateInst) {
            // console.log("instruction data from update form: ", instruction);
            const updatedInstruction = await dispatch(createOrEditInstruction(instruction, "edit"));
            history.push(`/machines/${updatedInstruction.machineId}`);
        }
        return;
    };

    return (
        (((symbols && states) && (currentMachine && machineInstructions)) && userAuth) ? <div className='page'>
            <form className='instruction-form' onSubmit={handleSubmit}>
                {formHeader}
                <div className='body'>
                    <div className='execution-conditions'>
                        <h3>Instruction Execution Conditions</h3>
                        <p className='description'>{instExConDesc}</p>
                        <div className='form-group'>
                            <h4 className='heading'>Current State</h4>
                            <p className='description'>{currentStateDescription}</p>
                            <select name="currentState" value={currentState} onChange={(e) => setCurrentState(e.target.value)}>
                                <option value={null} disabled={!!currentState}>Select a state</option>
                                {states.map((state) => {
                                    // do not include halting state
                                    if (state !== states[states.length - 1]) {
                                        return <option key={state} value={state}>{state}</option>
                                    }
                                })}
                            </select>
                            {(submissionAttempt && !!(errors.currentState && errors.currentState.length)) && <span className='error-message'>{errors.currentState}</span>}
                        </div>
                        <div className='form-group'>
                            <h4 className='heading'>Scanned Symbol</h4>
                            <p className='description'>{scannedSymbolDescription}</p>
                            <select name="scannedSymbol" value={scannedSymbol} onChange={(e) => setScannedSymbol(e.target.value)}>
                                <option value={null} disabled={!!scannedSymbol}>Select a symbol</option>
                                {symbols.map((symbol) => <option key={symbol} value={symbol}>&lsquo;{symbol}&rsquo;</option>)}
                            </select>
                            {(submissionAttempt && !!(errors.scannedSymbol && errors.scannedSymbol.length)) && <span className='error-message'>{errors.scannedSymbol}</span>}
                        </div>

                    </div>
                    <div className='machine-operations'>
                        <h3>Machine Operations</h3>
                        <p className='description'>{machOpDesc}</p>
                        <div className='form-group'>
                            <h4 className='heading'>Next State</h4>
                            <p className='description'>{nextStateDescription}</p>
                            <select name="nextState" value={nextState} onChange={(e) => {
                                // if headMove is set to Stop and nextState is not the halting state, set headMove to null.
                                if ((headMove === 0) && (e.target.value !== states[states.length - 1])) {
                                    setHeadMove(null);
                                }
                                setNextState(e.target.value)
                                }}>
                                <option value={null} disabled={!!nextState}>Select a state</option>
                                {states.map((state) => <option key={state} value={state}>{state}</option>)}
                            </select>
                            {(submissionAttempt && !!(errors.nextState && errors.nextState.length)) && <span className='error-message'>{errors.nextState}</span>}
                        </div>
                        <div className='form-group'>
                            <h4 className='heading'>Print Symbol</h4>
                            <p className='description'>{printSymbolDescription}</p>
                            <select name="printSymbol" value={printSymbol} onChange={(e) => setPrintSymbol(e.target.value)}>
                                <option value={null} disabled={!!printSymbol}>Select a symbol</option>
                                {symbols.map((symbol) => <option key={symbol} value={symbol}>&lsquo;{symbol}&rsquo;</option>)}
                            </select>
                            {(submissionAttempt && !!(errors.printSymbol && errors.printSymbol.length)) && <span className='error-message'>{errors.printSymbol}</span>}
                        </div>
                        <div className='form-group'>
                            <h4 className='heading'>Head Move</h4>
                            <p className='description'>{headMoveDescription}</p>
                            {headMoves.map((move) => {
                                if ((move !== headMoves[1]) || (nextState === states[states.length - 1])) {
                                    return <label key={move}>
                                        <input
                                            type="radio"
                                            name="headMove"
                                            value={move}
                                            checked={(headMove !== null) && (headMoves[headMove + 1] === move)}
                                            onChange={(e) => setHeadMove(headMoves.indexOf(e.target.value) - 1)}
                                        />
                                        {move}
                                    </label>
                                }
                            })}
                            {(submissionAttempt && !!(errors.headMove && errors.headMove.length)) && <span className='error-message'>{errors.headMove}</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
            <div className='info'>
                {!!(Object.keys(machineInstructions).length)
                && <InstructionDisplay instructions={machineInstructions} machine={currentMachine} selectedInstructionId={selectedInstructionId} />
                }
            </div>
        </div>
        : <h2 className='page'>Machine not Found or User not Authorized</h2>
    );
};

export default InstructionForm;
