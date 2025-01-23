import React, { useCallback, useEffect } from 'react';
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
        return winner === 'X' ? 'Player 1 Wins!' : 'Player 2 Wins!';
    };

    // Função para tocar o som
    const playResultSound = useCallback(() => {
        const soundPath = winner ? '/assets/music/win.mp3' : '/assets/music/draw.mp3';
        const audio = new Audio(soundPath);
        audio.play();
    }, [winner]);

    // Toca o som ao montar o componente
    useEffect(() => {
        playResultSound();
    }, [playResultSound]);

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
                <button className="restart-btn" onClick={handleRestart}>
                    Restart Game
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
