const renderTape = ({numSquares, headPos, blankSymbol, currentTape }) => {
    const centralSquareIndex = Math.floor(numSquares / 2);
    const squares = [];
    let tapeStr = "";

    for (let i = 0; i < numSquares; i++) {
        const isCentral = (i === centralSquareIndex);
        squares.push(
        <div key={i} className={`${isCentral ? "central " : ""}square`}>
            <p>{blankSymbol}</p>
        </div>
        );
    }
    return (
        <div className="tape">
            {squares}
        </div>
    );
};

// export const genTapeStr = (numSquares, headPos, blankSymbol, currentTape) => {
//     let tapeStr = "";
//     if ((headPos >= currentTape.length) || (headPos < 0)) {
//         throw new Error("Error: Head position must be non-negative integer less than the length of the tape.")
//     }
//     for (let i = 0; i < numSquares; i++) {
//         let currentSymbol = blankSymbol;
//         if
//     }
// };

export default renderTape;
