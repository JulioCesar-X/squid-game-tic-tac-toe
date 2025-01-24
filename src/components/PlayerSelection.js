import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMode, setPlayerSymbol, startGame } from '../redux/gameSlice';

const PlayerSelection = ({ onStartGame }) => {
    const dispatch = useDispatch();
    const [mode, setLocalMode] = useState(null); // Gerencia o modo localmente
    const [symbol, setLocalSymbol] = useState(null); // Gerencia o símbolo localmente
    const [currentPlayer, setCurrentPlayer] = useState('Player 1'); // Rastreia o jogador atual (Player 1 ou Player 2)
    const [playerSymbols, setPlayerSymbols] = useState({}); // Rastreia os símbolos atribuídos
    const [isTwoPlayerSymbolsConfirmed, setIsTwoPlayerSymbolsConfirmed] = useState(false); // Confirmação dos símbolos no modo two-players

    // Atualiza o modo e verifica a inicialização
    const handleModeSelection = (selectedMode) => {
        setLocalMode(selectedMode);
        dispatch(setMode(selectedMode));
    };

    // Atualiza o símbolo no modo two-players
    const handleTwoPlayerSymbolSelection = (selectedSymbol) => {
        // Atribui o símbolo ao jogador atual
        setPlayerSymbols((prevSymbols) => ({
            ...prevSymbols,
            [currentPlayer]: selectedSymbol,
        }));

        // Alterna entre os jogadores
        if (currentPlayer === 'Player 1') {
            setCurrentPlayer('Player 2');
        } else {
            // Ambos os jogadores fizeram suas escolhas
            setIsTwoPlayerSymbolsConfirmed(true);
        }
    };

    // Atualiza o símbolo no modo solo
    const handleSoloSymbolSelection = (selectedSymbol) => {
        setLocalSymbol(selectedSymbol);

        // Atribui os símbolos para o jogador e o computador
        const computerSymbol = selectedSymbol === 'X' ? 'O' : 'X';
        setPlayerSymbols({
            Player: selectedSymbol,
            Computer: computerSymbol,
        });
    };

    // Inicia o jogo no modo two-players
    const handleTwoPlayerStartGame = () => {
        dispatch(setPlayerSymbol(playerSymbols['Player 1'])); // Define o símbolo do Player 1 no Redux
        dispatch(startGame());
        onStartGame();
    };

    // Inicia o jogo no modo solo
    const handleSoloStartGame = () => {
        dispatch(setPlayerSymbol(symbol)); // Define o símbolo do jogador no Redux
        dispatch(startGame());
        onStartGame();
    };

    return (
        <div className="player-selection text-center">
            <h1 className="text-pink">Choose Game Mode</h1>
            <div className="d-flex justify-content-center mt-4">
                <button
                    className={`btn btn-primary m-2 ${mode === 'solo' ? 'active' : ''}`}
                    onClick={() => handleModeSelection('solo')}
                >
                    Solo (Against Computer)
                </button>
                <button
                    className={`btn btn-primary m-2 ${mode === 'two-players' ? 'active' : ''}`}
                    onClick={() => handleModeSelection('two-players')}
                >
                    Two Players
                </button>
            </div>

            {/* Escolha de símbolos para o modo solo */}
            {mode === 'solo' && (
                <>
                    <h2 className="mt-4 text-red">Select Your Symbol</h2>
                    <div className="d-flex justify-content-center">
                        <button
                            className={`btn btn-success m-2 ${symbol === 'X' ? 'active' : ''}`}
                            onClick={() => handleSoloSymbolSelection('X')}
                        >
                            X
                        </button>
                        <button
                            className={`btn btn-danger m-2 ${symbol === 'O' ? 'active' : ''}`}
                            onClick={() => handleSoloSymbolSelection('O')}
                        >
                            O
                        </button>
                    </div>

                    {/* Mostra os símbolos designados após a escolha */}
                    {playerSymbols.Player && (
                        <div className="mt-4">
                            <p>
                                <strong>You:</strong> {playerSymbols.Player}
                            </p>
                            <p>
                                <strong>Computer:</strong> {playerSymbols.Computer}
                            </p>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={handleSoloStartGame}
                            >
                                Start Game
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Escolha de símbolos para o modo two-players */}
            {mode === 'two-players' && (
                <>
                    {!isTwoPlayerSymbolsConfirmed ? (
                        <>
                            <h2 className="mt-4 text-red">
                                {currentPlayer}, select your symbol:
                            </h2>
                            <div className="d-flex justify-content-center">
                                <button
                                    className={`btn btn-success m-2 ${
                                        playerSymbols[currentPlayer] === 'X' ? 'active' : ''
                                    }`}
                                    onClick={() => handleTwoPlayerSymbolSelection('X')}
                                    disabled={
                                        currentPlayer === 'Player 2' &&
                                        playerSymbols['Player 1'] === 'X'
                                    } // Impede que ambos escolham o mesmo símbolo
                                >
                                    X
                                </button>
                                <button
                                    className={`btn btn-danger m-2 ${
                                        playerSymbols[currentPlayer] === 'O' ? 'active' : ''
                                    }`}
                                    onClick={() => handleTwoPlayerSymbolSelection('O')}
                                    disabled={
                                        currentPlayer === 'Player 2' &&
                                        playerSymbols['Player 1'] === 'O'
                                    } // Impede que ambos escolham o mesmo símbolo
                                >
                                    O
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="mt-4">
                            <p>
                                <strong>Player 1:</strong> {playerSymbols['Player 1']}
                            </p>
                            <p>
                                <strong>Player 2:</strong> {playerSymbols['Player 2']}
                            </p>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={handleTwoPlayerStartGame}
                            >
                                Start Game
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PlayerSelection;
