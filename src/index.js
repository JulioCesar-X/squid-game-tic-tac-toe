import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css'; // Importa os estilos globais

// Monta o React no elemento #root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Log para confirmar montagem em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
    console.log('Aplicação montada com sucesso no modo desenvolvimento');
}

root.render(
    <Provider store={store}> {/* Configura o Redux */}
        <React.StrictMode>
            <App /> {/* Componente principal */}
        </React.StrictMode>
    </Provider>
);
