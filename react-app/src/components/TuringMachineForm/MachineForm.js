// root/react-app/src/components/TuringMachineForm/MachineForm.js

import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createMachine } from '../../store/turingMachines';
import { findErr } from '../../utils/errorHandling';
import "./machineForm.css";

const MachineForm = ({ machine, formType }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const createGroup = "Create Turing Machine";
    const updateGroup = "Update Turing Machine";
    const validBlanks = ["#", " ", "0"];
    const minStateNameLen = 2;
    const maxStateNameLen = 31;
    const minNumStates = 2;
    const maxNumStates = 32;
    const minNameLen = 2;
    const maxNameLen = 255;
    const minAlphaLen = 1;
    const maxAlphaLen = 127;
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [blankSymbol, setBlankSymbol] = useState(validBlanks[0]);
    const [alphabet, setAlphabet] = useState('');
    const [initTape, setInitTape] = useState('');
    // const [initState, setInitState] = useState('');
    // const [haltingState, setHaltingState] = useState('');
    const [states, setStates] = useState(["q0", "qh"]);
    const [numStates, setNumStates] = useState(2);
    const [stateNameInputs, setStateNameInputs] = useState([]);
    const [stateNameErrors, setStateNameErrors] = useState({});
    const [errors, setErrors] = useState({});
    const [otherErrors, setOtherErrors] = useState({});
    const [submissionAttempt, setSubmissionAttempt] = useState(false);

    const loadMachines = useSelector((state) => {
		return state.turingMachines;
	});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionAttempt(true);
        // console.log("formType: ", formType);

        const errTypes = Object.keys(errors);
        for (let i = 0; i < errTypes.length; i++) {
            if (errors[errTypes[i]].length) return;
        }

        machine = {
            ...machine, name, notes, blankSymbol, alphabet,
            initTape, states: states.join('|'),
            initState: states[0], haltingState: states[states.length - 1],
        };
        // console.log("errors: ", errors);



        setSubmissionAttempt(false);
        if (formType === createGroup) {

        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.target.blur(); // Trigger onBlur event
        }
      };

    // consolidate errors
    useEffect(()=> {
        setErrors({ ...stateNameErrors, ...otherErrors });
    }, [stateNameErrors, otherErrors]);

    // set state names upon change in number of states
    useEffect(() => {
        if (states.length !== numStates) {
            const haltingStateName = states[states.length - 1];
            const newStates = [];
            const newErrors = { ...stateNameErrors };
            const maxIndex = ((numStates > states.length) ? (numStates - 1) : (states.length - 1));
            let errorsErased = false;

            for (let i = 0; i <= maxIndex; i++) {
                const errKey = `stateName${i}`;
                // since state names that fail validation revert to the last valid name, errors can be safely cleared.
                if (newErrors[errKey]) {
                    delete newErrors[errKey];
                    errorsErased = true;
                }

                if (i < numStates) {
                    if (i === (numStates - 1)) {
                        // add halting state name last
                        newStates.push(haltingStateName);
                    } else if (i < (states.length - 1)) {
                            // before the halting state name, add previously set custom state names
                            newStates.push(states[i]);
                    } else {
                            // if numStates has been increased, fill in remaining state names before the halting state with default values.
                            newStates.push(`q${i}`);
                    }
                }
            }

            if (errorsErased) setStateNameErrors(newErrors);
            setStates(newStates);
        }

    }, [numStates, states, stateNameErrors]);

    // set state name inputs in response to change in states or number of states
    useEffect(() => {
        const invalidStateNameChars = [',', '|', '<', '>', '{', '}'];
        let badCharStr = "";
        const newInputs = [];
        const newErrors = { ...stateNameErrors };
        invalidStateNameChars.forEach((char) => {
            badCharStr += char;
        });
        if (states.length === numStates) {
            const haltingStateName = states[states.length - 1];
            for (let i = 0; i < numStates; i++) {
                const errKey = `stateName${i}`;
                let errType = `The name of internal state ${i}`;
                let description = <p className="description">{`Pick a name for internal state ${i} of your machine.`}</p>
                let defaultValue = states[i];
                if (i === 0) {
                    description = <p className="description">Pick a name for your machine's initial state.</p>
                    errType = `The initial state name`;
                } else if (i === (numStates - 1)) {
                    description = <p className="description">Pick a name for your machine's halting state.</p>
                    defaultValue = haltingStateName;
                    errType = `The halting state name`;
                }

                const stateNameInputError = ` ${errType} must be at least ${minStateNameLen} and at most ${maxStateNameLen} characters long, and must not include any of the following characters: ${badCharStr}. `

                newInputs.push(
                    <div key={`${i}StateInput`} className="form-group">
                        {description}
                        <input type="text" name="states" defaultValue={defaultValue} onKeyDown={handleKeyDown} onBlur={(e) => {
                            const stateName = e.target.value;
                            const goodChars = invalidStateNameChars.every((char) => (!stateName.includes(char)));
                            if (((stateName.length >= minStateNameLen) && (stateName.length <= maxStateNameLen)) && goodChars) {
                                delete newErrors[errKey];
                                setStateNameErrors(newErrors);
                                const newStates = [ ...states ];
                                newStates[i] = stateName;
                                setStates(newStates);
                            } else {
                                newErrors[errKey] = [stateNameInputError];
                                setStateNameErrors(newErrors);
                            }
                        }} />
                        {(stateNameErrors[errKey]) && <span className="error-message">{stateNameErrors[errKey]}</span>}

                    </div>
                );
            }
        }
        setStateNameInputs(newInputs);
    }, [states, numStates, stateNameErrors]);


    // handle errors for inputs unrelated to machine states
    useEffect(() => {
        const valSymb = (blankSymbol + alphabet);
        const newErrors = { name: [], alphabet: [], initTape: []};
        // handle name errors
        if ((name.length < minNameLen) || (name.length > maxNameLen)) {
            newErrors.name.push(` Machine name must be between ${minNameLen} and ${maxNameLen} characters, inclusive. `)
        }
        loadMachines.allIds.forEach((mId) => {
            const mName = loadMachines.byId[mId].name;
            if ((name === mName) && ((formType === createGroup) || (mId !== machine.id))) {
                newErrors.name.push(` You already have another machine called ${name}, please choose a different name for this machine. `);
            }
        });

        // handle alphabet errors
        if ((alphabet.length < minAlphaLen) || (alphabet.length > maxAlphaLen)) {
            newErrors.alphabet.push(` Machine alphabet must be between ${minAlphaLen} and ${maxAlphaLen} characters, inclusive. `)
        }

        if (alphabet.includes(' ') || alphabet.includes(blankSymbol)) {
            newErrors.alphabet.push(` The machine alphabet cannot contain whitespace or the symbol you have chosen as the blank (${blankSymbol}). `)
        }

        // handle initial tape errors
        const tapeGood = initTape.split("").every((char) => valSymb.includes(char));

        if (!tapeGood) {
            newErrors.initTape.push(` The initial tape may only contain the blank and symbols from the alphabet (${valSymb}). `);
        }

        setOtherErrors(newErrors);
    }, [blankSymbol, name, alphabet, initTape, loadMachines, formType, machine.id]);


    return (
        <form className="machine-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <h4 className="heading">Name</h4>
                <p className="description">Give your machine a descriptive name.</p>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                {submissionAttempt && errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <h4 className="heading">Notes</h4>
                <p className="description">Optional explanatory notes for the machine.</p>
                <textarea name="notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                {submissionAttempt && errors.notes && <span className="error-message">{errors.notes}</span>}
            </div>

            <div className="form-group">
                <h4 className="heading">Blank Symbol</h4>
                <p className="description">Choose a symbol to represent a blank square of tape.</p>
                <select name="blankSymbol" value={blankSymbol} onChange={(e) => setBlankSymbol(e.target.value)}>
                    {validBlanks.map((bSymb) => <option key={bSymb} value={bSymb}>&lsquo;{bSymb}&rsquo;</option>)}
                </select>
            </div>

            <div className="form-group">
                <h4 className="heading">Alphabet</h4>
                <p className="description">The set of non-blank symbols recognized by the machine. Enter as a string of symbols without spaces.</p>
                <input type="text" name="alphabet" value={alphabet} onChange={(e) => setAlphabet(e.target.value)} />
                {submissionAttempt && errors.alphabet && <span className="error-message">{errors.alphabet}</span>}
            </div>

            <div className="form-group">
                <h4 className="heading">Initial Tape</h4>
                <p className="description">The initial contents of the tape from the leftmost to the rightmost non-blank symbol. May be interspaced with blanks.</p>
                <input type="text" name="initTape" value={initTape} onChange={(e) => setInitTape(e.target.value)} />
                {submissionAttempt && errors.initTape && <span className="error-message">{errors.initTape}</span>}
            </div>

            <div className="form-group">
                <h4 className="heading">Internal Machine States</h4>
                <p className="description">Enter the total number of internal states your machine will have -- this can be edited later. All Turing machines in this webzone must have at least two states: an initial state and a halting state. </p>
                <input type="text" name="states" defaultValue={numStates} onKeyDown={handleKeyDown}
                onBlur={(e) => {
                    const newNumStates = Number.parseInt(e.target.value)
                    const newErrors = { ...stateNameErrors }
                    if (newNumStates >= minNumStates && newNumStates <= maxNumStates) {
                        delete newErrors.numStates;
                        setStateNameErrors(newErrors);
                        setNumStates(newNumStates);
                    } else {
                        newErrors.numStates = [`Number of states must be an integer between ${minNumStates} and ${maxNumStates}, inclusive.`];
                        setStateNameErrors(newErrors);
                    }
                }} />
                {(errors.numStates && errors.numStates.length) && <span className="error-message">{errors.numStates}</span>}

            </div>

            {stateNameInputs}

            <div className="form-group">
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default MachineForm;
