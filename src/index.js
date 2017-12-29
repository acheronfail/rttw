import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
    <div>
        <App />
        <div className="site-footer">
            Made with ❤️ by <a href="https://github.com/acheronfail">acheronfail</a>, 
            because <a href="https://alf.nu/ReturnTrue">alf.nu/ReturnTrue</a> is down 😞
        </div>
    </div>,
    document.getElementById('root')
);

registerServiceWorker();
