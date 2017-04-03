const electron = require('electron');
const path = require('path');
const url = require('url');
const db = require('./src/js/db');
const platform = require('os').platform();
const {app, BrowserWindow} = electron;



let win;


// Define a function to create window
function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        minHeight: 600,
        minWidth: 400,
        center: true,
        show: false
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, './src/html/index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });

    win.on('ready-to-show', () => {
        win.show()
    });

    const devToolPath = platform === 'win32' ?
        `C:\\Users\\hqy84\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.0.12_0`:
        `/Users/huqingyang/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.0.12_0`;
    BrowserWindow.addDevToolsExtension(devToolPath);
}


// App events
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    platform !== 'darwin' && app.quit()
});

app.on('activate', () => {
    win === null && createWindow();
    win.show();
});


function openWindow(path) {
    let win;
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        minHeight: 600,
        minWidth: 400,
        center: true,
        show: false
    });

    win.loadURL(url.format({
        pathname: path,
        protocol: 'file',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });

    win.on('ready-to-show', () => {
        win.show()
    });
}


// Functions for rendering process
exports.platform = platform;
exports.db = db;
exports.path = path.join(__dirname);
exports.openWindow = openWindow;
