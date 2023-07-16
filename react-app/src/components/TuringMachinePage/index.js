// root/react-app/src/components/TuringMachinePage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAuthorizedTMs } from "../../store/turingMachines";
import renderTape from "./renderTape";
import { genTapeStr } from "./renderTape";
import { runMachine } from "./runMachine";
import { stringOnAlphabet } from "../../utils/stringOnAlphabet";
import { turingStep } from "./turingStep";
import { trimBlanks } from "../../utils/trimBlanks";
import "./turingMachine.css"

const TuringMachinePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const machineId = Number(useParams().machineId);
    const maxHeadMoves = 9001;
    const timeDelay = 500;
    let turingInterval;

    const [currentUser, setCurrentUser] = useState({});
    const [machines, setMachines] = useState({});
    const [instructions, setInstructions] = useState({});
    const [formattedInstructions, setFormattedInstructions] = useState('');
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


    const loadCurrentUser = useSelector((state) => {
        return state.session.user;
    });

    const loadMachines = useSelector((state) => {
        return state.turingMachines;
    });

    const loadInstructions = useSelector((state) => {
        return state.machineInstructions;
    });

    useEffect(() => {
        const fetchTMs = async () => {
            await dispatch(getAuthorizedTMs());
        }

        fetchTMs();
        setCurrentUser(loadCurrentUser);
    }, [loadCurrentUser, dispatch]);

    useEffect(() => {
        setMachines(loadMachines);
        setInstructions(loadInstructions);
    }, [loadMachines, loadInstructions]);

    useEffect(() => {
        if (machines.allIds && (machines.allIds.includes(machineId))) {
            setCurrentMachine(machines.byId[machineId]);
        }
    }, [machines, machineId]);


    let machineNames = <li key={0}>no machines</li>
    if (machines.allIds) {
        machineNames = machines.allIds.map((mId) => {
            const mName = machines.byId[mId].name;
            return <li key={mId}>{mName}</li>
        });
    }

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

    //   const handleRunMachine = () => {
    //     if (!validTape) return;


    //     if (!initTape) {
    //         setStartingTape(currentMachine.blankSymbol);
    //     } else {
    //         setStartingTape(initTape);
    //     }

    //     const mRes = runMachine(currentMachine, instructions, initTape);
    //     console.log("mRes: ", mRes);
    //     setCurrentTape(mRes[0]);
    //     setHaltingTape(mRes[0]);
    //     setHeadPos(mRes[1]);
    //     setFinishedRun(true);
    //     setInitTape(mRes[0]);

    //   };

    const handleRunMachine = () => {
        let headMoves = 0;
        if (!validTape) return;

        setFinishedRun(false);

        if (!initTape) {
            setStartingTape(currentMachine.blankSymbol);
        } else {
            setStartingTape(initTape);
        }

        let machine = { ...currentMachine };
        // while ((machine.currentState !== machine.haltingState) && (headMoves <= maxHeadMoves)) {
        //     machine = turingStep(machine, instructions.byId, initTape);
        //     headMoves++;
        //     setCurrentTape(machine.currentTape);
        //     setHeadPos(machine.headPos);
        // }

        turingInterval = setInterval(() => {
            if ((machine.currentState !== machine.haltingState) && (headMoves <= maxHeadMoves)) {
                machine = turingStep(machine, instructions.byId, initTape);
                headMoves++;
                setCurrentTape(machine.currentTape);
                setHeadPos(machine.headPos);
            } else {
                clearInterval(turingInterval);
                const trimResult = trimBlanks(machine.currentTape, machine.blankSymbol);
                // machine.headPos -= trimResult.leadingBlanks;
                // machine = trimResult.newString;

                setHeadPos(machine.headPos - trimResult.leadingBlanks);
                setCurrentTape(trimResult.newString);
                setHaltingTape(trimResult.newString);
                setFinishedRun(true);
                setInitTape(trimResult.newString);
            }
        }, timeDelay);

      };

      const handleResetMachine = () => {
        // TODO: the clearInterval here isn't working as intended
        clearInterval(turingInterval);
        if (renderedTape) {
            const resetTape = currentMachine.initTape;
            setInitTape(resetTape);
            setCurrentTape(resetTape);
            setStartingTape(resetTape);
            setHeadPos(0);
            setFinishedRun(false);
            setValidTape(stringOnAlphabet(
                resetTape,
                (currentMachine.blankSymbol + currentMachine.alphabet)
            ));
        }
      };

    if (currentMachine) {
        machinePage = (
            <div className="machine-page">
                <div className="description">
                    <h2>{currentMachine.name}</h2>
                    <p>{currentMachine.notes}</p>
                </div>
                {renderedTape}
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
                            <label htmlFor="initialTape">Initial Tape </label>
                            <input
                            type="text"
                            id="initialTape"
                            value={initTape}
                            onChange={(e) => {
                                setInitTape(e.target.value);
                                setCurrentTape(e.target.value);
                                setValidTape(stringOnAlphabet(
                                    e.target.value,
                                    (currentMachine.blankSymbol + currentMachine.alphabet)
                                ));
                            }}
                            />
                            {!validTape && <p className="error">Initial tape must not contain any symbols apart from those in the alphabet and the blank.</p>}
                        </div>
                        <p>States: {`{${currentMachine.states.split('|').join(', ')}}`}</p>
                        <p>Initial State: {currentMachine.initState}</p>
                        <p>Halting State: {currentMachine.haltingState}</p>
                        {finishedRun && <p>Starting Tape: {startingTape}</p>}
                        {finishedRun && <p>Halting Tape: {haltingTape}</p>}
                    </div>
                    <div className="machine-instructions">
                    <h3>Machine Instructions</h3>
                    </div>
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
