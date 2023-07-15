// root/react-app/src/components/TuringMachinePage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAuthorizedTMs } from "../../store/turingMachines";
import renderTape from "../RenderTape/renderTape";
import { genTapeStr } from "../RenderTape/renderTape";
import "./turingMachine.css"

const TuringMachinePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const machineId = Number(useParams().machineId);

    const [currentUser, setCurrentUser] = useState({});
    const [machines, setMachines] = useState({});
    const [instructions, setInstructions] = useState({});
    const [formattedInstructions, setFormattedInstructions] = useState('');
    const [currentMachine, setCurrentMachine] = useState(null);
    const [initTape, setInitTape] = useState('');
    const [currentTape, setCurrentTape] = useState('');
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [blankSymbol, setBlankSymbol] = useState('');
    const [headPos, setHeadPos] = useState(0);
    const [activeInstruction, setActiveInstruction] = useState(null);
    const [numSquares, setNumSquares] = useState(11); // Number of squares of tape to be displayed
    // const [centralSquareIndex, setCentralSquareIndex] = useState(Math.floor(numSquares / 2));
    const [tapeStr, setTapeStr] = useState(null);
    const [renderedTape, setRenderedTape] = useState(null);


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
            currentMachine.currentTape ? setCurrentTape(currentMachine.currentTape) : setCurrentTape(currentMachine.initTape);
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

    if (currentMachine) {
        machinePage = (
            <div className="machine-page">
                <div className="description">
                    <h2>{currentMachine.name}</h2>
                    <p>{currentMachine.notes}</p>
                </div>
                {renderedTape}
                <div className="basics-and-instructions">
                    <div className="machine-basics">
                        <h3>Machine Basics</h3>
                        <p>Alphabet: {`{${currentMachine.alphabet.split('').join(', ')}}`}</p>
                        <p>Blank Symbol: &lsquo;{currentMachine.blankSymbol}&rsquo;</p>
                        <p>Initial Tape: {currentMachine.initTape}</p>
                        <p>States: {`{${currentMachine.states.split('|').join(', ')}}`}</p>
                        <p>Initial State: {currentMachine.initState}</p>
                        <p>Halting State: {currentMachine.haltingState}</p>
                        <p>Current Tape: {currentTape}</p>
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
