Function.prototype.toString = Object.prototype.toString;


import React from 'react';
import ReactDOM from 'react-dom';
import { remote, shell } from 'electron';
import App from './components/App';


const main = remote.require('./main.js');


ReactDOM.render(
    <div>
        <App
            platform={main.platform}
            db={main.db}
            path={main.path}
            openWindow={main.openWindow}
            dataToHTML = {main.dataToHTML}
            config={main.config.get()}
            setConfig={main.config.set}
            openURL={shell.openExternal}
        />
    </div>,
    document.getElementById('root')
);
