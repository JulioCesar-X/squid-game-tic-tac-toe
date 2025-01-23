import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeMove, setWinner } from '../redux/gameSlice';

const GameBoard = ({ onGameOver }) => {
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

    const [feedbackMessage, setFeedbackMessage] = useState(''); // Feedback inicial

    const computerSymbol = playerSymbol === 'X' ? 'O' : 'X'; // Define o símbolo do computador

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

    // Verifica as combinações vencedoras
    const checkWinner = useCallback(() => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                dispatch(setWinner(board[a])); // Define o vencedor
                onGameOver(); // Notifica que o jogo terminou
                return;
            }
        }

        if (board.every((cell) => cell)) {
            dispatch(setWinner(null)); // Define empate
            onGameOver();
        }
    }, [board, dispatch, onGameOver]);

    // Escolhe a próxima jogada do computador de forma inteligente
    const getBestMove = useCallback(() => {
        // 1. Verifica se o computador pode vencer
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === computerSymbol && board[b] === computerSymbol && board[c] === null)
                return c;
            if (board[a] === computerSymbol && board[c] === computerSymbol && board[b] === null)
                return b;
            if (board[b] === computerSymbol && board[c] === computerSymbol && board[a] === null)
                return a;
        }

        // 2. Bloqueia o jogador se ele estiver prestes a vencer
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === playerSymbol && board[b] === playerSymbol && board[c] === null)
                return c;
            if (board[a] === playerSymbol && board[c] === playerSymbol && board[b] === null)
                return b;
            if (board[b] === playerSymbol && board[c] === playerSymbol && board[a] === null)
                return a;
        }

        // 3. Prioriza o centro
        if (board[4] === null) return 4;

        // 4. Prioriza os cantos
        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (board[corner] === null) return corner;
        }

        // 5. Escolhe qualquer célula livre
        const emptyCells = board.map((value, index) => (value === null ? index : null)).filter((v) => v !== null);
        if (emptyCells.length > 0) {
            return emptyCells[0];
        }

        return null; // Nenhuma jogada possível
    }, [board, computerSymbol, playerSymbol]);

    // Realiza a jogada do computador com delay
    const handleComputerMove = useCallback(() => {
        if (mode === 'solo' && currentPlayer === computerSymbol && isGameActive) {
            setFeedbackMessage("Computer's Turn ...");

            setTimeout(() => {
                const bestMove = getBestMove();
                if (bestMove !== null) {
                    dispatch(makeMove({ index: bestMove }));
                }
            }, 2000); // Delay de 2 segundos para simular pensamento
        }
    }, [mode, currentPlayer, isGameActive, getBestMove, dispatch, computerSymbol]);

    useEffect(() => {
        checkWinner(); // Verifica vencedor após cada movimento
    }, [board, checkWinner]);

    useEffect(() => {
        if (mode === 'solo') handleComputerMove(); // Ação automática para o computador
    }, [board, mode, handleComputerMove]);

    // Atualiza o feedback com animação de oscilação
    useEffect(() => {
        if (!isGameActive) return;

        if (currentPlayer === playerSymbol) {
            setFeedbackMessage('Your Turn ...');
        } else if (currentPlayer === computerSymbol && mode === 'solo') {
            setFeedbackMessage("Computer's Turn ...");
        }
    }, [currentPlayer, mode, isGameActive, playerSymbol, computerSymbol]);

    // Manipula o clique em uma célula
    const handleBoxClick = (index) => {
        if (!isGameActive || board[index] || (mode === 'solo' && currentPlayer === computerSymbol)) return; // Bloqueia interação inválida
        dispatch(makeMove({ index })); // Realiza o movimento
    };

    return (
        <div className="game-container">
            {/* Indicador de Feedback Temporário */}
            {isGameActive && (
                <div className={`feedback-message`}>
                    {feedbackMessage}
                </div>
            )}

            <div id="gameboard" className="fade-content">
                {board.map((value, index) => (
                    <div
                        key={index}
                        className={`box ${!value && isGameActive ? 'clickable' : ''}`} // Adiciona destaque às células clicáveis
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
