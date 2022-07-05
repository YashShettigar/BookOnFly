import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthContextProvider } from './api/auth';
import { SearchContextProvider } from './api/context';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <SearchContextProvider>
            <App />
        </SearchContextProvider>    
    </AuthContextProvider>
);