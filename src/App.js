import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startGame, nextBackground } from './redux/gameSlice';
import PlayerSelection from './components/PlayerSelection';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';
import './index.css';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('selection');
    const backgroundIndex = useSelector((state) => state.game.backgroundIndex);
    const winner = useSelector((state) => state.game.winner);
    const playerSymbol = useSelector((state) => state.game.playerSymbol);
    const mode = useSelector((state) => state.game.mode);
    const dispatch = useDispatch();

    const themeAudioRef = useRef(null);
    const moveAudioRef = useRef(null);
    const winAudioRef = useRef(null);
    const drawAudioRef = useRef(null);

    const backgrounds = [
        `${process.env.PUBLIC_URL}/assets/images/bg1.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg2.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg3.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg4.jpg`,
    ];

    useEffect(() => {
        themeAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/theme.mp3`);
        moveAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/move.mp3`);
        winAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/win.mp3`);
        drawAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/draw.mp3`);

        return () => {
            [themeAudioRef, moveAudioRef, winAudioRef, drawAudioRef].forEach((ref) => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current.currentTime = 0;
                }
            });
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(nextBackground());
        }, 10000);

        return () => clearInterval(interval);
    }, [dispatch]);

    const stopSound = (ref) => {
        if (ref?.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
        }
    };

    const playSound = (ref) => {
        stopSound(ref);
        ref?.current?.play().catch((error) => console.error('Erro ao tocar som:', error));
    };

    const handleStartGame = () => {
        dispatch(startGame());
        setCurrentScreen('game');
        playSound(themeAudioRef);
    };

    const handleGameOver = () => {
        console.log('Finalizando o jogo, vencedor:', winner);

        stopSound(themeAudioRef);

        if (mode === 'two-players') {
            if (winner) {
                playSound(winAudioRef);
            } else {
                playSound(drawAudioRef);
            }
        } else if (mode === 'solo') {
            if (winner === playerSymbol) {
                playSound(winAudioRef);
            } else if (winner === null) {
                playSound(drawAudioRef);
            } else {
                playSound(drawAudioRef);
            }
        }

        setCurrentScreen('result');
    };

    const handleRestart = () => {
        console.log('Reiniciando o jogo');
        setCurrentScreen('selection');

        [themeAudioRef, winAudioRef, drawAudioRef].forEach((ref) => stopSound(ref));
    };

    const handleMoveSound = () => {
        playSound(moveAudioRef);
    };

    return (
        <>
            <div
                className="dynamic-bg"
                style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}
            ></div>
            <div className="app fade-content">
                {currentScreen === 'selection' && (
                    <PlayerSelection onStartGame={handleStartGame} />
                )}
                {currentScreen === 'game' && (
                    <GameBoard onGameOver={handleGameOver} onMove={handleMoveSound} />
                )}
                {currentScreen === 'result' && (
                    <ResultScreen winner={winner} onRestart={handleRestart} />
                )}
            </div>
        </>
    );
};

export default App;
