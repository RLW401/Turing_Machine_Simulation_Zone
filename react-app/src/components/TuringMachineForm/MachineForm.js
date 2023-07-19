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
    const [states, setStates] = useState('');
    const [errors, setErrors] = useState({});
    const [submissionAttempt, setSubmissionAttempt] = useState(false);

    const handleSubmit = () => null;

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
                <p className="description">Enter the names of machine states separated by a vertical bar (|). These can be short codenames (e.g. “q0|q1|q2|qh”) or more descriptive names (e.g. “Scan Right|Operation X|Scan Left|Halt”). States can be added or removed later.</p>
                <input type="text" name="states" value={states} onChange={(e) => setStates(e.target.value)} />
            </div>

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
