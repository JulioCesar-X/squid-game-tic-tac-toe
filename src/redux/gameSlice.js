import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
    mode: null, // 'solo' ou 'two-players'
    playerSymbol: 'X', // Símbolo escolhido pelo jogador
    currentPlayer: 'X', // Jogador atual ('X' ou 'O')
    board: Array(9).fill(null), // Estado do tabuleiro vazio
    winner: null, // Vencedor ('X', 'O' ou null para empate)
    score: { player1: 0, player2: 0, ties: 0 }, // Placar do jogo
    isGameActive: true, // Indica se o jogo está ativo
    backgroundIndex: 0, // Índice do fundo dinâmico
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setMode(state, action) {
            state.mode = action.payload;
        },
        setPlayerSymbol(state, action) {
            state.playerSymbol = action.payload;
        },
        startGame(state) {
            state.board = Array(9).fill(null);
            state.winner = null;
            state.isGameActive = true;

            // Configura quem joga primeiro
            if (state.mode === 'solo' && state.playerSymbol === 'O') {
                state.currentPlayer = 'X'; // Computador começa
            } else {
                state.currentPlayer = state.playerSymbol; // Jogador começa
            }
        },
        resetBoard(state) {
            state.board = Array(9).fill(null);
            state.winner = null;
            state.isGameActive = true;
            state.currentPlayer = 'X';
        },
        makeMove(state, action) {
            const { index } = action.payload;
            if (!state.board[index] && state.isGameActive) {
                state.board[index] = state.currentPlayer;
                state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
            }
        },
        setWinner(state, action) {
            const winner = action.payload;
            state.winner = winner;
            state.isGameActive = false;

            if (winner === 'X') {
                state.score.player1++;
            } else if (winner === 'O') {
                state.score.player2++;
            } else {
                state.score.ties++;
            }
        },
        nextBackground(state) {
            state.backgroundIndex = (state.backgroundIndex + 1) % 4;
        },
    },
});

export const {
    setMode,
    setPlayerSymbol,
    startGame,
    resetBoard,
    makeMove,
    setWinner,
    nextBackground,
} = gameSlice.actions;

// Memoized Selectors
const selectGame = (state) => state.game;

export const selectBoard = createSelector(
    [selectGame],
    (game) => game.board
);

export const selectIsGameActive = createSelector(
    [selectGame],
    (game) => game.isGameActive
);

export const selectCurrentPlayer = createSelector(
    [selectGame],
    (game) => game.currentPlayer
);

export const selectWinner = createSelector(
    [selectGame],
    (game) => game.winner
);

export const selectBackgroundIndex = createSelector(
    [selectGame],
    (game) => game.backgroundIndex
);

export default gameSlice.reducer;
