const config = require('./config').get;
const platform = require('os').platform();


module.exports = (app, window, ipcMain) => [
    {
        label: "Page.qy",
        submenu: [
            {
                label: config().language === 'zh' ? '关于Page.qy' : "About Application",
                selector: "orderFrontStandardAboutPanel:"
            },
            platform !== 'win32' && {type: "separator"},
            platform !== 'win32' && {
                label: config().language === 'zh' ? "退出" : "Quit",
                accelerator: "CmdOrCtrl+Q",
                click: app.quit
            }
        ]
    },
    {
        label: config.language === 'zh' ? "编辑" : "Edit",
        submenu: [
            {label: config().language === 'zh' ? "撤销" : "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
            {label: config().language === 'zh' ? "重做" : "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
            {type: "separator"},
            {label: config().language === 'zh' ? "剪切" : "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
            {label: config().language === 'zh' ? "复制" : "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
            {label: config().language === 'zh' ? "粘贴" : "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
            {
                label: config().language === 'zh' ? "全选" : "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:"
            }
        ]
    },
    {
        label: config.language === 'zh' ? "开发者选项" : "Development",
        submenu: [
            {
                label: config().language === 'zh' ? '打开DevTools' : "Open DevTools",
                accelerator: "CmdOrCtrl+Alt+i",
                click: () => { window.webContents.openDevTools() }
            }
        ]
    }
];

