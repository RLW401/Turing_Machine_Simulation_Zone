// root/react-app/src/components/TuringMachinePage/index.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import renderTape, { genTapeStr } from "./renderTape";
import InstructionDisplay from "../InstructionDisplay/instructionDisplay";
import { stringOnAlphabet } from "../../utils/stringOnAlphabet";
import { turingStep } from "./turingStep";
import { trimBlanks } from "../../utils/trimBlanks";
import DeleteMachineModal from "../DeleteMachine";
import { genMachUpdatePath, maxHeadMoves, stateSeparator } from "../../constants/constants";
import "./turingMachine.css"

const TuringMachinePage = () => {
    const history = useHistory();
    const machineId = Number(useParams().machineId);
    // const timeDelay = 500;
    // const [currentUser, setCurrentUser] = useState({});
    const [machines, setMachines] = useState({});
    const [instructions, setInstructions] = useState({});
    const [formattedInstructions, setFormattedInstructions] = useState(null);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [defaultInitTape, setDefaultInitTape] = useState('');
    const [initTape, setInitTape] = useState('');
    const [currentTape, setCurrentTape] = useState('');
    const [startingTape, setStartingTape] = useState('');
    const [haltingTape, setHaltingTape] = useState('');
    const [blankSymbol, setBlankSymbol] = useState('');
    const [headPos, setHeadPos] = useState(0);
    const [numSquares, setNumSquares] = useState(11); // Number of squares of tape to be displayed
    // const [centralSquareIndex, setCentralSquareIndex] = useState(Math.floor(numSquares / 2));
    const [tapeStr, setTapeStr] = useState(null);
    const [renderedTape, setRenderedTape] = useState(null);
    const [finishedRun, setFinishedRun] = useState(false);
    const [validTape, setValidTape] = useState(true);
    const [deleteAuth, setDeleteAuth] = useState(false);
    const [editAuth, setEditAuth] = useState(false);
    // const [resetTriggered, setResetTriggered] = useState(false);
    const [runError, setRunError] = useState(false);
    const [turingInterval, setTuringInterval] = useState(null);
    const [machineRunning, setMachineRunning] = useState(false);
    const [cancelInterval, setCancelInterval] = useState(false);
    const [fullInstructions, setFullInstructions] = useState(false);
    const [timeDelay, setTimeDelay] = useState(500);


    const loadCurrentUser = useSelector((state) => {
        return state.session.user;
    });

    const loadMachines = useSelector((state) => {
        return state.turingMachines;
    });

    const loadInstructions = useSelector((state) => {
        return state.machineInstructions;
    });

    // cancel interval when necessary
    useEffect(() => {
        if (cancelInterval && turingInterval) {
            clearInterval(turingInterval);
            setTuringInterval(null);
            setMachineRunning(false);
        }
    }, [cancelInterval, turingInterval]);

    useEffect(() => {
        setMachines(loadMachines);
        setInstructions(loadInstructions.byId);
    }, [loadMachines, loadInstructions]);

    useEffect(() => {
        if (machines.allIds && (machines.allIds.includes(machineId))) {
            const setM = machines.byId[machineId];
            setCurrentMachine(setM);
            const fInst = (<InstructionDisplay instructions={instructions} machine={setM} buttonDisplay={editAuth} fullInstructions={fullInstructions} />);
            setFormattedInstructions(fInst);
            setFinishedRun(false);
            setRunError(false);
            // reset head position when changing machines or instructions
            setHeadPos(0);
            setCancelInterval(true);
        }
    }, [machines, machineId, instructions, editAuth, fullInstructions]);

    useEffect(() => {
        const loggedAndLoaded = (loadCurrentUser && (loadCurrentUser.id && currentMachine));
        const owner = (loggedAndLoaded && (loadCurrentUser.id === currentMachine.ownerId));
        const collaborator = (loggedAndLoaded && (loadCurrentUser.id === currentMachine.collaboratorId));

        setDeleteAuth(owner);
        setEditAuth(owner || collaborator);

    }, [loadCurrentUser, currentMachine]);

    let machinePage = (
        <div className="machine-page">
            <h2>Machine Not Found</h2>
        </div>
    );



    // set current tape and check to see if there is room for additional instructions
    useEffect(() => {
        if (currentMachine) {
            if (currentMachine.initTape) {
                setCurrentTape(currentMachine.initTape);
                setDefaultInitTape(currentMachine.initTape);
                setInitTape(currentMachine.initTape);
            } else {
                setCurrentTape(currentMachine.blankSymbol);
                setDefaultInitTape(currentMachine.blankSymbol);
                setInitTape(currentMachine.blankSymbol);
            }

            if (currentMachine.currentTape) {
                setCurrentTape(currentMachine.currentTape);
            }

            // if (currentMachine.headPos) setHeadPos(currentMachine.headPos);

            setBlankSymbol(currentMachine.blankSymbol);
            setHeadPos(0);
            // console.log("instructions: ", instructions);
            // console.log("currentMachine: ", currentMachine);

            const numInstructions = currentMachine.instructions.length;
            // count symbols including blank
            const numSymbols = (currentMachine.alphabet.length + 1);
            // count states excluding halting state
            const numActiveStates = (currentMachine.states.split(stateSeparator).length - 1);
            const maxInstructions = (numSymbols * numActiveStates);
            setFullInstructions(numInstructions === maxInstructions);
        }
    }, [currentMachine]);

    // set tape symbols to be rendered
    useEffect(() => {
        if (currentMachine && blankSymbol) {
        // if ((currentMachine && blankSymbol) && (headPos < currentTape.length)) {
            setTapeStr(genTapeStr(
                numSquares, headPos, blankSymbol, currentTape
                ));
        }
    }, [currentMachine, currentTape, numSquares, blankSymbol, headPos]);

    // render tape whenever string of symbols or head position changes
    useEffect(() => {
        if (tapeStr) {
            setRenderedTape(renderTape({tapeStr}));
        }
    }, [tapeStr, headPos]);

    const handleRunMachine = () => {
        let headMoves = 0;
        if (!validTape) return;

        setRunError(false);
        setFinishedRun(false);
        setCancelInterval(false);
        setMachineRunning(true);

        if (!initTape) {
            setStartingTape(currentMachine.blankSymbol);
        } else {
            setStartingTape(initTape);
        }

        let machine = { ...currentMachine };
        machine.currentTape = initTape;
        machine.runError = false;
        machine.headPos = headPos;

        const runMachine = () => {
            // console.log("interval active");
            if (((machine.currentState !== machine.haltingState) && (headMoves <= maxHeadMoves)) && !machine.runError) {
                machine = turingStep(machine, instructions);
                headMoves++;
                // console.log("machine.currentTape: ", machine.currentTape);
                // console.log("machine.headPos: ", machine.headPos);
                setCurrentTape(machine.currentTape);
                setHeadPos(machine.headPos);
                const fInst = (<InstructionDisplay instructions={instructions} machine={machine} fullInstructions={fullInstructions} />);
                setFormattedInstructions(fInst);
            } else {
                setCancelInterval(true);
                if ((headMoves > maxHeadMoves) && !machine.runError) {
                    machine.runError = {
                        errorMsg: `Your machine was automatically reset because it exceeded the maximum number of head movements. headMoves: ${headMoves}, maxHeadMoves: ${maxHeadMoves}`,
                        headMoves,
                        maxHeadMoves,
                    };
                }
                if (machine.runError) {
                    setRunError(
                        <div className="run-error">
                            <p className="error">{machine.runError.errorMsg}</p>
                        </div>
                    );
                    handleResetMachine();
                } else {
                    const trimResult = trimBlanks(machine.currentTape, machine.headPos, machine.blankSymbol);
                    const finalHeadPos = (machine.headPos - trimResult.leadingBlanks);
                    setHeadPos(finalHeadPos);
                    setCurrentTape(trimResult.newString);
                    setHaltingTape(trimResult.newString);
                    setInitTape(trimResult.newString);
                    setFinishedRun(true);
                }
            }
        };
        // prevent more than one interval being set
        if (!turingInterval) {
            const newInterval = setInterval(runMachine, timeDelay);
            // console.log("newInterval: ", newInterval)
            setTuringInterval(newInterval);
        } else {
            handleResetMachine();
        }
    };

      const handleResetMachine = () => {
        setCancelInterval(true);

        if (renderedTape) {
            const machine = { ...currentMachine };
            const resetTape = machine.initTape;
            machine.currentTape = resetTape;
            const fInst = (<InstructionDisplay instructions={instructions} machine={machine} buttonDisplay={editAuth} fullInstructions={fullInstructions} />);
            setFormattedInstructions(fInst);
            setInitTape(resetTape);
            setHeadPos(0);
            setCurrentTape(resetTape);
            setStartingTape(resetTape);
            setFinishedRun(false);
            setValidTape(stringOnAlphabet(
                resetTape,
                (currentMachine.blankSymbol + currentMachine.alphabet)
            ));
        }
    };

    // display update machine button iff user is logged in and either owns or is a collaborator on the current machine
    const updateMachineButton = (
        editAuth
        ? <button className="update" disabled={machineRunning}
        onClick={
            () => history.push(genMachUpdatePath(machineId))
        } >Update Machine</button>
        : null
    );

    // display delete machine button iff user is logged in and owns the current machine
    const deleteMachineButton = (deleteAuth && <DeleteMachineModal machineRunning={machineRunning} />);

    const mChangeButtons = (
        <div className="m-change">
            {updateMachineButton}
            {deleteMachineButton}
        </div>
    );

    const handleSpeedChange = (e) => setTimeDelay(Number(e.target.value));

    const speedSlider = (
        <div className="slider-container">
            <div className="speed-slider">
                <label>Time between steps:</label>
                <input
                type="range"
                name="Computation Speed"
                min={125}
                max={1000}
                step={125}
                disabled={machineRunning}
                value={timeDelay}
                onChange={handleSpeedChange}
                />
            </div>
            <p>One step every {timeDelay === 1000 ? "second" : `${timeDelay} milliseconds`}</p>
        </div>

    );

    if (currentMachine) {
        machinePage = (
            <div className="machine-page">
                <div className="description">
                    <h2>{currentMachine.name}</h2>
                    <p>{currentMachine.notes}</p>
                </div>
                {speedSlider}
                {mChangeButtons}
                {renderedTape}
                {runError}
                {(finishedRun && editAuth) && <p className="reset-info">To restore ability to create, update, and delete instructions after a run, click the Reset Machine button.</p>}
                <div className="machine-controls">
                    <button className="run-machine" disabled={machineRunning} onClick={handleRunMachine}>Run Machine</button>
                    <button className="reset-machine" onClick={handleResetMachine}>Reset Machine</button>
                </div>

                <div className="basics-and-instructions">
                    <div className="machine-basics">
                        <h3>Machine Basics</h3>
                        <div className="symbols">
                            <p>Blank Symbol: &lsquo;{currentMachine.blankSymbol}&rsquo;</p>
                            <p>Alphabet: {`{${currentMachine.alphabet.split('').join(', ')}}`}</p>
                        </div>
                        <div>
                            <label htmlFor="initialTape">Initial Tape: </label>
                            <input
                            type="text"
                            id="initialTape"
                            disabled={machineRunning}
                            value={initTape}
                            onChange={(e) => {
                                setHeadPos(0);
                                const tape = e.target.value;
                                const machine = { ...currentMachine };
                                machine.currentTape = (tape ? tape : machine.blankSymbol);
                                const fInst = (<InstructionDisplay instructions={instructions} machine={machine} buttonDisplay={editAuth} fullInstructions={fullInstructions} />);
                                setFormattedInstructions(fInst);
                                setInitTape(tape);
                                setCurrentTape(tape);
                                setValidTape(stringOnAlphabet(
                                    tape,
                                    (currentMachine.blankSymbol + currentMachine.alphabet)
                                ));
                            }}
                            />
                            {!validTape && <p className="error">Initial tape must not contain any symbols apart from those in the alphabet and the blank.</p>}
                        </div>
                        <p>States: {`{${currentMachine.states.split('|').join(', ')}}`}</p>
                        <p>Initial State: {currentMachine.initState}</p>
                        <p>Halting State: {currentMachine.haltingState}</p>
                        {finishedRun && <div className="results-box">
                            <p>Starting Tape: {startingTape}</p>
                            <p>Halting Tape: {haltingTape}</p>
                        </div>}
                    </div>
                    {formattedInstructions}
                </div>
            </div>
        );

    }

    return (
        <>
            {machinePage}
        </>
    );
};

export default TuringMachinePage;
