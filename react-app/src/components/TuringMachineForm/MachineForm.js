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
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [blankSymbol, setBlankSymbol] = useState(validBlanks[0]);
    const [alphabet, setAlphabet] = useState('');
    const [initTape, setInitTape] = useState('');
    const [initState, setInitState] = useState('');
    const [haltingState, setHaltingState] = useState('');
    const [states, setStates] = useState([]);
    const [numStates, setNumStates] = useState(2);
    const [errors, setErrors] = useState({});
    const [submissionAttempt, setSubmissionAttempt] = useState(false);

    const handleSubmit = () => null;

    useEffect(() => {
        const newStates = [];
        for (let i = 0; i < (numStates - 1); i++) {
            newStates.push("q" + i);
        }
        newStates.push("qh");
        setStates(newStates);

    }, [numStates]);

    const stateNameInputs = [];
    for (let i = 0; i < numStates; i++) {
        if (i === 0) {
            stateNameInputs.push(
                <div className="form-group">
                    <p className="description">Pick a name for your machine's initial state.</p>
                    <input type="text" name="states" value={states[i]} onBlur={(e) => {
                        const newStates = [ ...states ];
                        newStates[i] = e.target.value;
                        setStates(newStates);
                    }} />
                </div>
            );
        } else if (i === (numStates - 1)) {
            stateNameInputs.push(
                <div className="form-group">
                    <p className="description">Pick a name for your machine's halting state.</p>
                    <input type="text" name="states" value={states[i]} onBlur={(e) => {
                        const newStates = [ ...states ];
                        newStates[i] = e.target.value;
                        setStates(newStates);
                    }} />
                </div>
            );
        } else {
            stateNameInputs.push(
                <div className="form-group">
                    <p className="description">{`Pick a name for internal state ${i} of your machine.`}</p>
                    <input type="text" name="states" value={states[i]} onBlur={(e) => {
                        const newStates = [ ...states ];
                        newStates[i] = e.target.value;
                        setStates(newStates);
                    }} />
                </div>
            );
        }
    }



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
                    {validBlanks.map((bSymb) => <option value={bSymb}>&lsquo;{bSymb}&rsquo;</option>)}
                    {/* <option value="#">&lsquo;#&rsquo;</option>
                    <option value=" ">&lsquo; &rsquo;</option>
                    <option value="0">&lsquo;0&rsquo;</option> */}
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
                <input type="text" name="states" value={numStates} onChange={(e) => setStates(Number.parseInt(e.target.value))} />
            </div>

            {stateNameInputs}

            <div className="init-and-halting-state-dropdowns">
                <div className="form-group">
                    <h4 className="heading">Initial State</h4>
                    <p className="description">In which state does your machine start?</p>
                    {/* Add dropdown element here */}
                </div>

                <div className="form-group">
                    <h4 className="heading">Halting State</h4>
                    <p className="description">Is there a state in which your machine will halt? If so, which one?</p>
                    {/* Add dropdown element here */}
                </div>
            </div>

            <div className="form-group">
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default MachineForm;
