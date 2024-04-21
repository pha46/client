import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Auth from './auth';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Auth />);