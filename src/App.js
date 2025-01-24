import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startGame, nextBackground } from './redux/gameSlice';
import PlayerSelection from './components/PlayerSelection';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';
import './index.css';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('selection'); // Controla a tela atual
    const backgroundIndex = useSelector((state) => state.game.backgroundIndex);
    const winner = useSelector((state) => state.game.winner);
    const playerSymbol = useSelector((state) => state.game.playerSymbol);
    const mode = useSelector((state) => state.game.mode);
    const dispatch = useDispatch();

    const introAudioRef = useRef(null); // Áudio de introdução
    const themeAudioRef = useRef(null); // Áudio do tema do jogo
    const moveAudioRef = useRef(null); // Áudio de movimento
    const winAudioRef = useRef(null); // Áudio de vitória
    const drawAudioRef = useRef(null); // Áudio de empate

    const backgrounds = [
        `${process.env.PUBLIC_URL}/assets/images/bg1.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg2.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg3.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg4.jpg`,
    ];

    // Inicializa os áudios
    useEffect(() => {
        introAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/intro.mp3`);
        introAudioRef.current.loop = true;

        themeAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/theme.mp3`);
        moveAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/move.mp3`);
        winAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/win.mp3`);
        drawAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/music/draw.mp3`);

        // Toca o som de introdução ao carregar a aplicação
        introAudioRef.current.play().catch((error) => console.error('Erro ao tocar som:', error));

        return () => {
            // Limpa os áudios ao desmontar o componente
            [introAudioRef, themeAudioRef, moveAudioRef, winAudioRef, drawAudioRef].forEach((ref) => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current.currentTime = 0;
                }
            });
        };
    }, []);

    // Atualiza o fundo dinâmico a cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(nextBackground());
        }, 10000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Controla o áudio (tocar e pausar)
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

    // Inicia o jogo: muda para o GameBoard e troca os áudios
    const handleStartGame = () => {
        stopSound(introAudioRef); // Pausa o som de introdução
        playSound(themeAudioRef); // Toca o áudio do tema principal
        dispatch(startGame());
        setCurrentScreen('game'); // Vai para o GameBoard
    };

    // Finaliza o jogo e toca os áudios apropriados
    const handleGameOver = () => {
        console.log('Finalizando o jogo, vencedor:', winner);

        stopSound(themeAudioRef);

        if (mode === 'two-players') {
            winner ? playSound(winAudioRef) : playSound(drawAudioRef);
        } else if (mode === 'solo') {
            if (winner === playerSymbol) {
                playSound(winAudioRef);
            } else if (winner === null) {
                playSound(drawAudioRef);
            } else {
                playSound(drawAudioRef);
            }
        }

        setCurrentScreen('result'); // Vai para a tela de resultados
    };

    // Reinicia o jogo
    const handleRestart = () => {
        console.log('Reiniciando o jogo');
        setCurrentScreen('selection');

        [themeAudioRef, winAudioRef, drawAudioRef].forEach((ref) => stopSound(ref));

        // Reinicia o áudio de introdução
        playSound(introAudioRef);
    };

    // Som de movimento
    const handleMoveSound = () => {
        playSound(moveAudioRef);
    };

    return (
        <>
            {/* Fundo dinâmico */}
            <div
                className="dynamic-bg"
                style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}
            ></div>

            {/* Container principal */}
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
