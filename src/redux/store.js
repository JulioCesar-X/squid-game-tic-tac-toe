import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

// Middleware para logs customizados (opcional)
const loggerMiddleware = (storeAPI) => (next) => (action) => {
    console.group(`Redux Action: ${action.type}`);
    console.log('Estado anterior:', storeAPI.getState());
    console.log('Ação:', action);
    const result = next(action);
    console.log('Novo estado:', storeAPI.getState());
    console.groupEnd();
    return result;
};

// Configuração do Redux Store
const store = configureStore({
    reducer: {
        game: gameReducer, // Reducer principal do jogo
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loggerMiddleware), // Adiciona middleware de log
    devTools: process.env.NODE_ENV !== 'production', // Ativa o Redux DevTools apenas em desenvolvimento
});

// Log do estado inicial para depuração
console.log('Estado inicial:', store.getState());

// Exporta o store para ser usado no aplicativo
export default store;
