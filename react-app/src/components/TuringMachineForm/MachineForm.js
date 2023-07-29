// root/react-app/src/components/TuringMachineForm/MachineForm.js

import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { findErr } from '../../utils/errorHandling';
import "./machineForm.css";

const MachineForm = ({ machine, formType }) => {
    const history = useHistory();
    const dispatch = useDispatch();
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
    // const [stateNameErrors, setStateNameErrors] = useState([]);
    const [errors, setErrors] = useState({});
    const [submissionAttempt, setSubmissionAttempt] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmissionAttempt(true);

        if (Object.keys(errors).length) return;
        setSubmissionAttempt(false);
        return null;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.target.blur(); // Trigger onBlur event
        }
      };

    // set states upon change in number of states
    useEffect(() => {
        if (states.length !== numStates) {
            const haltingStateName = states[states.length - 1];
            const newStates = [];
            const newErrors = { ...errors };
            let errorsErased = false;
            for (let i = 0; i < (numStates - 1); i++) {
                const errKey = `stateName${i}`;
                // since state names that fail validation revert to the last valid name, errors can be safely cleared.
                if (errors[errKey]) {
                    delete newErrors[errKey];
                    errorsErased = true;
                }

                if (i < (states.length - 1)) {
                    newStates.push(states[i]);
                } else {
                    newStates.push("q" + i);
                }
            }
            newStates.push(haltingStateName);

            // erase errors for deleted states, if any
            for (let i = (numStates - 1); i < states.length; i++) {
                const errKey = `stateName${i}`;
                if (errors[errKey]) {
                    delete newErrors[errKey];
                    errorsErased = true;
                }
            }
            if (errorsErased) setErrors(newErrors);
            setStates(newStates);
        }

    }, [numStates, states, errors]);

    // set state name inputs in response to change in states or number of states
    useEffect(() => {
        const invalidStateNameChars = [',', '|', '<', '>', '{', '}'];
        let badCharStr = "";
        const newInputs = [];
        const newErrors = { ...errors };
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

                const stateNameInputError = `${errType} must be at least ${minStateNameLen} and at most ${maxStateNameLen} characters long, and must not include any of the following characters: ${badCharStr}.`

                newInputs.push(
                    <div key={`${i}StateInput`} className="form-group">
                        {description}
                        <input type="text" name="states" defaultValue={defaultValue} onKeyDown={handleKeyDown} onBlur={(e) => {
                            const stateName = e.target.value;
                            const goodChars = invalidStateNameChars.every((char) => (!stateName.includes(char)));
                            if (((stateName.length >= minStateNameLen) && (stateName.length <= maxStateNameLen)) && goodChars) {
                                delete newErrors[errKey];
                                setErrors(newErrors);
                                const newStates = [ ...states ];
                                newStates[i] = stateName;
                                setStates(newStates);
                            } else {
                                newErrors[errKey] = [stateNameInputError];
                                setErrors(newErrors);
                            }
                        }} />
                        {(errors[errKey]) && <span className="error-message">{errors[errKey]}</span>}

                    </div>
                );
            }
        }
        setStateNameInputs(newInputs);
    }, [states, numStates, errors]);


    // handle errors for inputs unrelated to machine states
    useEffect(() => {
        const valSymb = (blankSymbol + alphabet).split("");
        const newErrors = { ...errors };
        // handle name errors
        newErrors.name = [];
        if ((name.length < minNameLen) || (name.length > maxNameLen)) {
            newErrors.name.push("")
        }
    }, [blankSymbol, name, alphabet, initTape, errors]);


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
            </div>

            <div className="form-group">
                <h4 className="heading">Initial Tape</h4>
                <p className="description">The initial contents of the tape from the leftmost to the rightmost non-blank symbol. May be interspaced with blanks.</p>
                <input type="text" name="initTape" value={initTape} onChange={(e) => setInitTape(e.target.value)} />
            </div>

            <div className="form-group">
                <h4 className="heading">Internal Machine States</h4>
                <p className="description">Enter the total number of internal states your machine will have -- this can be edited later. All Turing machines in this webzone must have at least two states: an initial state and a halting state. </p>
                <input type="text" name="states" defaultValue={numStates} onKeyDown={handleKeyDown}
                onBlur={(e) => {
                    const newNumStates = Number.parseInt(e.target.value)
                    const newErrors = { ...errors }
                    if (newNumStates >= minNumStates && newNumStates <= maxNumStates) {
                        delete newErrors.numStates;
                        setErrors(newErrors);
                        setNumStates(newNumStates);
                    } else {
                        newErrors.numStates = [`Number of states must be an integer between ${minNumStates} and ${maxNumStates}, inclusive.`];
                        setErrors(newErrors);
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
