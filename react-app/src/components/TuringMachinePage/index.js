// root/react-app/src/components/TuringMachinePage/index.js
import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAuthorizedTMs } from "../../store/turingMachines";
import renderTape, { genTapeStr } from "./renderTape";
import InstructionDisplay from "../InstructionDisplay/instructionDisplay";
import { stringOnAlphabet } from "../../utils/stringOnAlphabet";
import { turingStep } from "./turingStep";
import { trimBlanks } from "../../utils/trimBlanks";
import DeleteMachineModal from "../DeleteMachine";
import { genMachUpdatePath, genAddInstPath, genUpdateInstPath } from "../../constants/constants";
import "./turingMachine.css"

const TuringMachinePage = () => {
    // const dispatch = useDispatch();
    const history = useHistory();
    const machineId = Number(useParams().machineId);
    const maxHeadMoves = 5;
    const timeDelay = 500;
    let turingInterval;

    const [currentUser, setCurrentUser] = useState({});
    const [machines, setMachines] = useState({});
    const [instructions, setInstructions] = useState({});
    const [formattedInstructions, setFormattedInstructions] = useState(null);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [defaultInitTape, setDefaultInitTape] = useState('');
    const [initTape, setInitTape] = useState('');
    const [currentTape, setCurrentTape] = useState('');
    const [startingTape, setStartingTape] = useState('');
    const [haltingTape, setHaltingTape] = useState('');
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [currentState, setCurrentState] = useState('');
    const [blankSymbol, setBlankSymbol] = useState('');
    const [headPos, setHeadPos] = useState(0);
    const [activeInstruction, setActiveInstruction] = useState(null);
    const [numSquares, setNumSquares] = useState(11); // Number of squares of tape to be displayed
    // const [centralSquareIndex, setCentralSquareIndex] = useState(Math.floor(numSquares / 2));
    const [tapeStr, setTapeStr] = useState(null);
    const [renderedTape, setRenderedTape] = useState(null);
    const [finishedRun, setFinishedRun] = useState(false);
    const [validTape, setValidTape] = useState(true);
    const [deleteAuth, setDeleteAuth] = useState(false);
    const [editAuth, setEditAuth] = useState(false);
    const [resetTriggered, setResetTriggered] = useState(false);
    const [missingInstruction, setMissingInstruction] = useState(false);


    const loadCurrentUser = useSelector((state) => {
        return state.session.user;
    });

    const loadMachines = useSelector((state) => {
        return state.turingMachines;
    });

    const loadInstructions = useSelector((state) => {
        return state.machineInstructions;
    });

    // useEffect(() => {
    //     const fetchTMs = async () => {
    //         await dispatch(getAuthorizedTMs());
    //     }

    //     fetchTMs();
    //     setCurrentUser(loadCurrentUser);
    // }, [loadCurrentUser, dispatch]);

    useEffect(() => {
        setMachines(loadMachines);
        setInstructions(loadInstructions.byId);
    }, [loadMachines, loadInstructions]);

    useEffect(() => {
        if (machines.allIds && (machines.allIds.includes(machineId))) {
            const setM = machines.byId[machineId];
            setCurrentMachine(setM);
            const fInst = (<InstructionDisplay instructions={instructions} machine={setM} buttonDisplay={editAuth} />);
            setFormattedInstructions(fInst);
            setFinishedRun(false);
            setMissingInstruction(false);
            setHeadPos(0);
        }
    }, [machines, machineId, instructions, editAuth]);

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



      // set current tape
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

            if (currentMachine.headPos) setHeadPos(currentMachine.headPos);

            setBlankSymbol(currentMachine.blankSymbol);
            // console.log("instructions: ", instructions);
            // console.log("currentMachine: ", currentMachine);
        }
    // });
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
        // TODO allow re-runs of machine even if it halts with headPos > 0
        let headMoves = 0;
        if (!validTape) return;

        setMissingInstruction(false);
        setFinishedRun(false);

        if (!initTape) {
            setStartingTape(currentMachine.blankSymbol);
        } else {
            setStartingTape(initTape);
        }

        let machine = { ...currentMachine };
        machine.currentTape = initTape;
        machine.missingInstruction = false;
        // machine.headPos = headPos;

        turingInterval = setInterval(() => {
            if (((machine.currentState !== machine.haltingState) && (headMoves <= maxHeadMoves)) && !machine.missingInstruction) {
                machine = turingStep(machine, instructions);
                headMoves++;
                // console.log("machine.currentTape: ", machine.currentTape);
                setCurrentTape(machine.currentTape);
                setHeadPos(machine.headPos);
                const fInst = (<InstructionDisplay instructions={instructions} machine={machine} />);
                setFormattedInstructions(fInst);
            } else {
                clearInterval(turingInterval);
                // turingInterval = null;
                if (machine.missingInstruction) {
                    setMissingInstruction(
                        <div className="missing-instructions">
                            <p className="error">{machine.missingInstruction.errorMsg}</p>
                        </div>
                    );
                    handleResetMachine();
                } else if (headMoves >= maxHeadMoves) {
                    handleResetMachine();
                    console.log(`Machine exceeded max number of head moves (${headMoves}).`);
                } else {
                    const trimResult = trimBlanks(machine.currentTape, machine.blankSymbol);
                    const finalHeadPos = (machine.headPos - trimResult.leadingBlanks);
                    setHeadPos(finalHeadPos);
                    setCurrentTape(trimResult.newString);
                    setHaltingTape(trimResult.newString);
                    setInitTape(trimResult.newString);
                    setFinishedRun(true);
                    // // if machine didn't halt scanning first non-blank symbol reset the machine
                    // if (finalHeadPos) {
                    //     handleResetMachine();
                    // }
                }
            }
        }, timeDelay);

      };

      const handleResetMachine = () => {
        // TODO: the clearInterval here isn't working as intended
        // clearInterval(turingInterval);

        if (renderedTape) {
            const machine = { ...currentMachine };
            const resetTape = machine.initTape;
            machine.currentTape = resetTape;
            const fInst = (<InstructionDisplay instructions={instructions} machine={machine} buttonDisplay={editAuth} />);
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
        ? <button className="update" onClick={
            () => history.push(genMachUpdatePath(machineId))
        } >Update Machine</button>
        : null
    );

    // display delete machine button iff user is logged in and owns the current machine
    const deleteMachineButton = (deleteAuth ? <DeleteMachineModal /> : null);

    const mChangeButtons = (
        <div className="m-change">
            {updateMachineButton}
            {deleteMachineButton}
        </div>
    );

    if (currentMachine) {
        machinePage = (
            <div className="machine-page">
                <div className="description">
                    <h2>{currentMachine.name}</h2>
                    <p>{currentMachine.notes}</p>
                </div>
                {mChangeButtons}
                {renderedTape}
                {missingInstruction}
                <div className="machine-controls">
                    <button className="run-machine" onClick={handleRunMachine}>Run Machine</button>
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
                            value={initTape}
                            onChange={(e) => {
                                setHeadPos(0);
                                const tape = e.target.value;
                                const machine = { ...currentMachine };
                                // machine.currentTape = e.target.value;
                                machine.currentTape = (tape ? tape : machine.blankSymbol);
                                const fInst = (<InstructionDisplay instructions={instructions} machine={machine} buttonDisplay={editAuth} />);
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
                    {/* {addInstructionButton} */}
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
