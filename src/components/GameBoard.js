import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeMove, setWinner } from '../redux/gameSlice';

const GameBoard = ({ onGameOver, onMove }) => {
    const {
        board,
        isGameActive,
        currentPlayer,
        mode,
        playerSymbol,
    } = useSelector((state) => ({
        board: state.game.board,
        isGameActive: state.game.isGameActive,
        currentPlayer: state.game.currentPlayer,
        mode: state.game.mode,
        playerSymbol: state.game.playerSymbol,
    }));

    const dispatch = useDispatch();

    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackClass, setFeedbackClass] = useState(''); // Classe dinâmica para o feedback

    const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinner = useCallback(() => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                dispatch(setWinner(board[a]));
                onGameOver();
                return;
            }
        }

        if (board.every((cell) => cell)) {
            dispatch(setWinner(null));
            onGameOver();
        }
    }, [board, dispatch, onGameOver]);

    const getBestMove = useCallback(() => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === computerSymbol && board[b] === computerSymbol && board[c] === null)
                return c;
            if (board[a] === computerSymbol && board[c] === computerSymbol && board[b] === null)
                return b;
            if (board[b] === computerSymbol && board[c] === computerSymbol && board[a] === null)
                return a;
        }

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === playerSymbol && board[b] === playerSymbol && board[c] === null)
                return c;
            if (board[a] === playerSymbol && board[c] === playerSymbol && board[b] === null)
                return b;
            if (board[b] === playerSymbol && board[c] === playerSymbol && board[a] === null)
                return a;
        }

        if (board[4] === null) return 4;

        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (board[corner] === null) return corner;
        }

        const emptyCells = board
            .map((value, index) => (value === null ? index : null))
            .filter((v) => v !== null);
        return emptyCells.length > 0 ? emptyCells[0] : null;
    }, [board, computerSymbol, playerSymbol]);

    const handleComputerMove = useCallback(() => {
        if (mode === 'solo' && currentPlayer === computerSymbol && isGameActive) {
            setFeedbackMessage("Computer's Turn ...");
            setFeedbackClass('feedback-computer');

            setTimeout(() => {
                const bestMove = getBestMove();
                if (bestMove !== null) {
                    dispatch(makeMove({ index: bestMove }));
                    if (onMove) onMove();
                }
            }, 2000);
        }
    }, [mode, currentPlayer, isGameActive, getBestMove, dispatch, computerSymbol, onMove]);

    useEffect(() => {
        checkWinner();
    }, [board, checkWinner]);

    useEffect(() => {
        if (mode === 'solo') {
            handleComputerMove();
        }
    }, [board, mode, handleComputerMove]);

    useEffect(() => {
        if (!isGameActive) return;

        if (mode === 'two-players') {
            if (currentPlayer === 'X') {
                setFeedbackMessage('Player 1 Turn ...');
                setFeedbackClass('feedback-player1');
            } else {
                setFeedbackMessage('Player 2 Turn ...');
                setFeedbackClass('feedback-player2');
            }
        } else if (mode === 'solo') {
            if (currentPlayer === playerSymbol) {
                setFeedbackMessage('Your Turn ...');
                setFeedbackClass('feedback-player1');
            } else {
                setFeedbackMessage("Computer's Turn ...");
                setFeedbackClass('feedback-computer');
            }
        }
    }, [currentPlayer, mode, isGameActive, playerSymbol, computerSymbol]);

    const handleBoxClick = (index) => {
        if (!isGameActive || board[index] || (mode === 'solo' && currentPlayer === computerSymbol))
            return;
        dispatch(makeMove({ index }));
        if (onMove) onMove();
    };

    return (
        <div className="game-container">
            {isGameActive && (
                <div className={`feedback-message ${feedbackClass}`}>
                    {feedbackMessage}
                </div>
            )}

            <div id="gameboard" className="fade-content">
                {board.map((value, index) => (
                    <div
                        key={index}
                        className={`box ${!value && isGameActive ? 'clickable' : ''}`}
                        onClick={() => handleBoxClick(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
