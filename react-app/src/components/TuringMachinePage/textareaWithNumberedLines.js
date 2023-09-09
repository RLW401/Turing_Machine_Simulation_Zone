// root/react-app/src/components/TuringMachinePage/textareaWithNumberedLines.js

import React, { useState, useRef, useEffect } from 'react';
import './TextAreaWithNumberedLines.css';

function TextAreaWithNumberedLines({ text, setText }) {
    // const [text, setText] = useState('');
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    useEffect(() => {
        const lineNumbers = []
        // add number for every line in textarea
        for (let i = 1; i <= text.split('\n').length; i++) {
            lineNumbers.push(i)
        }

        lineNumbersRef.current.value = lineNumbers.join('\n');

        // reset hight on change to allow for shrinkage after line deletion
        textareaRef.current.style.height = 'auto';
        lineNumbersRef.current.style.height = 'auto';

        lineNumbersRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [text]);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div className="textarea-with-lines">
            <textarea ref={lineNumbersRef} className="line-numbers" readOnly></textarea>
            <textarea ref={textareaRef} value={text} onChange={handleChange} className="content-textarea"></textarea>
        </div>
    );
}

export default TextAreaWithNumberedLines;
