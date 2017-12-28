import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/app';
import registerServiceWorker from './registerServiceWorker';

window.app = ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
