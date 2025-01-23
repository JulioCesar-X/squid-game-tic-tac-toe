import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startGame } from './redux/gameSlice';
import { nextBackground } from './redux/gameSlice'; // Importa a ação Redux
import PlayerSelection from './components/PlayerSelection';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';
import './index.css';

const App = () => {
    // Gerencia a tela atual: 'selection', 'game', ou 'result'
    const [currentScreen, setCurrentScreen] = useState('selection');
    const backgroundIndex = useSelector((state) => state.game.backgroundIndex);
    const winner = useSelector((state) => state.game.winner); // Vencedor do jogo
    const dispatch = useDispatch();

    // Lista de fundos para transição dinâmica
    const backgrounds = [
        `${process.env.PUBLIC_URL}/assets/images/bg1.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg2.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg3.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/bg4.jpg`,
    ];

    // Alteração automática do fundo em intervalos regulares
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(nextBackground()); // Atualiza o índice no Redux
        }, 10000); // Altera a cada 10 segundos

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [dispatch]);

    // Função para tocar sons com tratamento de erros
    const playSound = (soundPath) => {
        console.log('Tocando som:', soundPath); // Debug para verificar o caminho
        const audio = new Audio(`${process.env.PUBLIC_URL}${soundPath}`);
        audio.play().catch((error) => console.error('Erro ao tocar som:', error));
    };

    // Manipula o início do jogo
    const handleStartGame = () => {
        dispatch(startGame()); // Inicializa o tabuleiro e o estado do jogo
        setCurrentScreen('game'); // Transita para a tela do jogo
        playSound('/assets/music/theme.mp3'); // Som do tema
    };
    // Manipula o fim do jogo
    const handleGameOver = () => {
        console.log('Finalizando o jogo, vencedor:', winner); // Debug
        if (winner) {
            playSound('/assets/music/win.mp3'); // Som de vitória
        } else {
            playSound('/assets/music/draw.mp3'); // Som de empate
        }
        setCurrentScreen('result');
    };

    // Reinicia o jogo para nova partida
    const handleRestart = () => {
        console.log('Reiniciando o jogo'); // Debug
        setCurrentScreen('selection');
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
            {currentScreen === 'game' && <GameBoard onGameOver={handleGameOver} />}
            {currentScreen === 'result' && (
                <ResultScreen winner={winner} onRestart={handleRestart} />
            )}
        </div>
    </>
    );
};

export default App;