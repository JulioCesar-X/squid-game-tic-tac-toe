import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useDispatch } from 'react-redux';
import { setMode, setPlayerSymbol, startGame } from '../redux/gameSlice';

const PlayerSelection = ({ onStartGame }) => {
    const dispatch = useDispatch();
    const [mode, setModeState] = useState(null);
    const [symbol, setSymbolState] = useState(null);
    const [playerSymbols, setPlayerSymbols] = useState({});
    const [isTwoPlayerSymbolsConfirmed, setSymbolsConfirmed] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const introAudioRef = useRef(null);

    // Configura o áudio de introdução
    useEffect(() => {
        introAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/intro.mp3`);
        introAudioRef.current.loop = true;

        // Tenta reproduzir automaticamente
        introAudioRef.current
            .play()
            .catch(() => {
                console.log('Áudio bloqueado pelo navegador. Clique para reproduzir.');
            });

        return () => {
            if (introAudioRef.current) {
                introAudioRef.current.pause();
                introAudioRef.current.currentTime = 0;
            }
        };
    }, []);

    // Função para reproduzir o áudio ao clicar no ícone
    const playIntroAudio = () => {
        if (introAudioRef.current) {
            introAudioRef.current.play().catch((error) => console.error('Erro ao tocar som:', error));
        }
    };

    // Define o modo de jogo e atualiza o estado global
    const handleModeSelection = (selectedMode) => {
        setModeState(selectedMode);
        dispatch(setMode(selectedMode));
    };

    const handleSymbolSelection = (selectedSymbol, isTwoPlayer) => {
        if (isTwoPlayer) {
            setPlayerSymbols({
                Player1: selectedSymbol,
                Player2: selectedSymbol === 'X' ? 'O' : 'X',
            });
            setSymbolsConfirmed(true);
        } else {
            setSymbolState(selectedSymbol);
            setPlayerSymbols({
                Player: selectedSymbol,
                Computer: selectedSymbol === 'X' ? 'O' : 'X',
            });
        }
    };

    const startGameHandler = () => {
        const playerSymbolToSet = mode === 'solo' ? symbol : playerSymbols.Player1;
        dispatch(setPlayerSymbol(playerSymbolToSet));
        dispatch(startGame());
        onStartGame();

        if (introAudioRef.current) {
            introAudioRef.current.pause();
            introAudioRef.current.currentTime = 0;
        }
    };

    const renderSymbolButtons = (isTwoPlayer) => (
        <div className="d-flex justify-content-center">
            <button
                className={`btn btn-success m-2 ${
                    (isTwoPlayer ? playerSymbols.Player1 : symbol) === 'X' ? 'active' : ''
                }`}
                onClick={() => handleSymbolSelection('X', isTwoPlayer)}
            >
                X
            </button>
            <button
                className={`btn btn-danger m-2 ${
                    (isTwoPlayer ? playerSymbols.Player1 : symbol) === 'O' ? 'active' : ''
                }`}
                onClick={() => handleSymbolSelection('O', isTwoPlayer)}
            >
                O
            </button>
        </div>
    );

    const renderIntro = () => (
        <CSSTransition in={showIntro} timeout={1500} classNames="fade" unmountOnExit>
            <div className="intro">
                <h1 className="squid-title">Welcome Players</h1>
                <h2 className="squid-subtitle">to the Tic Tac Toe Squid Game</h2>
                <p className="squid-message">"Let the game begin..."</p>
                <button
                    className="restart-btn mt-4"
                    onClick={() => {
                        setShowIntro(false);
                        if (introAudioRef.current) {
                            introAudioRef.current.pause();
                            introAudioRef.current.currentTime = 0;
                        }
                    }}
                >
                    Start Game
                </button>
            </div>
        </CSSTransition>
    );

    const renderModeSelection = () => (
        <div>
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
        </div>
    );

    const renderSymbolSelection = () => {
        if (mode === 'solo') {
            return (
                <div>
                    <h2 className="mt-4 text-red">Select Your Symbol</h2>
                    {renderSymbolButtons(false)}
                    {symbol && (
                        <div className="mt-4">
                            <p>
                                <strong>You:</strong> {playerSymbols.Player}
                            </p>
                            <p>
                                <strong>Computer:</strong> {playerSymbols.Computer}
                            </p>
                            <button className="btn btn-primary mt-3" onClick={startGameHandler}>
                                Start Game
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (mode === 'two-players') {
            return (
                <div>
                    {!isTwoPlayerSymbolsConfirmed ? (
                        <div>
                            <h2 className="mt-4 text-red">Player 1, select your symbol:</h2>
                            {renderSymbolButtons(true)}
                        </div>
                    ) : (
                        <div className="mt-4">
                            <p>
                                <strong>Player 1:</strong> {playerSymbols.Player1}
                            </p>
                            <p>
                                <strong>Player 2:</strong> {playerSymbols.Player2}
                            </p>
                            <button className="btn btn-primary mt-3" onClick={startGameHandler}>
                                Start Game
                            </button>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="player-selection text-center">
            <button
                className="audio-icon"
                onClick={playIntroAudio}
                title="Play Intro Sound"
            >
                🔊
            </button>
            {showIntro ? renderIntro() : renderModeSelection()}
            {!showIntro && mode && renderSymbolSelection()}
        </div>
    );
};

export default PlayerSelection;
