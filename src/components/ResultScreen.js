import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetBoard } from '../redux/gameSlice';

const ResultScreen = ({ winner, onRestart }) => {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.game.mode);
    const playerSymbol = useSelector((state) => state.game.playerSymbol);

    // Define a mensagem de resultado
    const getResultMessage = () => {
        if (!winner) return "It's a Draw!";
        if (mode === 'solo') {
            return winner === playerSymbol ? 'You Win!' : 'Computer Wins!';
        }
        if (mode === 'two-players') {
            return winner === 'X' ? 'Player 1 Wins!' : 'Player 2 Wins!';
        }
        return 'Unexpected Result'; // Fallback explícito
    };

    // Define quem será eliminado
    const getEliminatedMessage = () => {
        if (!winner) return 'Both players survive... for now.';
        if (mode === 'solo') {
            return winner === playerSymbol ? 'Computer will be eliminated!' : 'You will be eliminated!';
        }
        if (mode === 'two-players') {
            return winner === 'X' ? 'Player 2 will be eliminated!' : 'Player 1 will be eliminated!';
        }
        return '';
    };

    const handleRestart = () => {
        dispatch(resetBoard());
        onRestart();
    };

    return (
        <div className="result-screen fade-in">
            <div className="result-container">
                <h2 className="result-message">
                    {getResultMessage()}
                </h2>
                <p className="eliminated-message">
                    {getEliminatedMessage()}
                </p>
                <button className="restart-btn" onClick={handleRestart}>
                    Restart Game
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
