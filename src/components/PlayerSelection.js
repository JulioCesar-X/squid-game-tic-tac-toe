import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMode, setPlayerSymbol, startGame } from '../redux/gameSlice';

const PlayerSelection = ({ onStartGame }) => {
    const dispatch = useDispatch();
    const [mode, setLocalMode] = useState(null); // Gerencia o modo localmente
    const [symbol, setLocalSymbol] = useState(null); // Gerencia o símbolo localmente

    // Atualiza o modo e verifica a inicialização
    const handleModeSelection = (selectedMode) => {
        console.log('Modo selecionado:', selectedMode); // Depuração
        setLocalMode(selectedMode);
        dispatch(setMode(selectedMode));
    };

    // Atualiza o símbolo e verifica a inicialização
    const handleSymbolSelection = (selectedSymbol) => {
        console.log('Símbolo selecionado:', selectedSymbol);
        setLocalSymbol(selectedSymbol);
        dispatch(setPlayerSymbol(selectedSymbol));

        // Verifica se o modo já foi selecionado
        if (mode) {
            dispatch(startGame());
            onStartGame();
        }
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

            <h2 className="mt-4 text-red">Select Your Symbol</h2>
            <div className="d-flex justify-content-center">
                <button
                    className={`btn btn-success m-2 ${symbol === 'X' ? 'active' : ''}`}
                    onClick={() => handleSymbolSelection('X')}
                >
                    X
                </button>
                <button
                    className={`btn btn-danger m-2 ${symbol === 'O' ? 'active' : ''}`}
                    onClick={() => handleSymbolSelection('O')}
                >
                    O
                </button>
            </div>
        </div>
    );
};

export default PlayerSelection;
