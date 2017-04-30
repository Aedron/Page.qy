Function.prototype.toString = Object.prototype.toString;


import React from 'react';
import ReactDOM from 'react-dom';
import reactCSS from 'reactcss';
import { remote } from 'electron';


const user = remote.require('./main.js').user;
const config = remote.require('./main.js').config.get();
const app = remote.app;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.style = this.style.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleBackup = this.handleBackup.bind(this);
        this.backupOnGitHub = this.backupOnGitHub.bind(this);
        this.backupOnLocal = this.backupOnLocal.bind(this);
        this.skipBackUp = this.skipBackUp.bind(this);
        this.handleOperate = this.handleOperate.bind(this);

        this.state = {
            status: 'init',
            selected: 'github'
        }
    }

    handleSelect(select) {
        this.setState({
            selected: select
        })
    }

    handleBackup() {
        switch (this.state.selected) {
            case 'github':
                return this.backupOnGitHub();
            case 'local':
                return this.backupOnLocal();
            case 'skip':
                return this.skipBackUp();
        }
    }

    backupOnGitHub() {
        this.setState({
            status: 'backup',
        });
        this.props.user.backupOnGitHub()
            .then(function () {
                this.props.app.restart();
            }.bind(this))
            .catch(function () {
                this.setState({
                    status: 'failed'
                })
            }.bind(this));
    }

    backupOnLocal() {

    }

    skipBackUp() {

    }

    handleOperate() {
        if (this.state.status === 'backup')
            return this.setState({ status: 'init' });
        return this.handleBackup();
    }

    render() {return (
        <div>
            <p style={this.style().title}>
                {function () {
                    switch (this.state.status) {
                        case 'init':
                            return this.props.language === 'zh' ?
                                '备份' : 'BACKUP';
                        case 'backup':
                            return false;
                        case 'failed':
                            return this.props.language === 'zh' ?
                                '备份失败!' : 'BACKUP FAILED!';
                    }
                }.bind(this)()}
            </p>
            <div style={this.style().operateArea}>
                <button
                    onClick={this.handleSelect.bind(this, 'github')}
                    style={this.state.selected === 'github' ?
                        this.style().operateButtonSelected :
                        this.style().operateButton}
                >
                    {this.props.language === 'zh' ?
                        '备份在GitHub' : 'BACKUP ON GITHUB'}
                </button>
                <button
                    onClick={this.handleSelect.bind(this, 'local')}
                    style={this.state.selected === 'local' ?
                        this.style().operateButtonSelected :
                        this.style().operateButton}
                >
                    {this.props.language === 'zh' ?
                        '备份在本地' : 'BACKUP ON LOCAL'}
                </button>
                <button
                    onClick={this.handleSelect.bind(this, 'skip')}
                    style={this.state.selected === 'skip' ?
                        this.style().operateButtonSelected :
                        this.style().operateButton}
                >
                    {this.props.language === 'zh' ?
                        '跳过备份' : 'SKIP'}
                </button>
            </div>
            <div style={this.style().loading} id="load">
                <div>G</div>
                <div>N</div>
                <div>I</div>
                <div>K</div>
                <div>R</div>
                <div>O</div>
                <div>W</div>
            </div>
            <div style={this.style().buttonArea}>
                <button
                    style={this.style().button}
                    onClick={this.handleOperate}
                >
                    {function () {
                        switch (this.state.status) {
                            case 'failed':
                                return this.props.language === 'zh' ? '重试' : 'RETRY';
                            case 'init':
                                return this.props.language === 'zh' ? '备份' : 'BACKUP';
                            case 'backup':
                                return this.props.language === 'zh' ? '取消' : 'CANCEL';
                        }
                    }.bind(this)()}
                </button>
                <button
                    style={this.style().button}
                    onClick={function () {
                        this.props.app.quit();
                    }.bind(this)}
                >
                    {this.props.language === 'zh' ? '退出' : 'QUIT'}
                </button>
            </div>
        </div>
    )}

    style() {return reactCSS({
        default: {
            title: {
                fontSize: '1.3em',
                textAlign: 'center',
                color: 'white',
                width: 'calc(40% - 16px)',
                margin: '35px calc(30% + 8px)',
                letterSpacing: '0.06em'
            },
            operateArea: {
                width: '40%',
                margin: '0 30%',
                display: this.state.status === 'backup' ?
                    'none' : 'flex',
                color: 'white',
                flexDirection: 'column',
                alignItems: 'center',
                flexWrap: 'wrap'
            },
            operateButton: {
                width: '92%',
                height: '30px',
                border: 'none',
                color: 'white',
                backgroundColor: 'rgba(54, 122, 209, 0.3)',
                cursor: 'pointer',
                fontSize: '0.7em',
                letterSpacing: '0.08em',
                marginBottom: '10px',
            },
            operateButtonSelected: {
                width: '92%',
                height: '30px',
                border: 'none',
                color: 'white',
                backgroundColor: 'rgba(54, 122, 209, 0.8)',
                cursor: 'pointer',
                fontSize: '0.7em',
                letterSpacing: '0.08em',
                marginBottom: '10px'
            },
            loading: {
                position: 'absolute',
                width: '100%',
                height: '80px',
                left: '40%',
                top: '100px',
                marginLeft: '-260px',
                overflow: 'visible',
                display: this.state.status === 'backup' ?
                    'block' : 'none'
            },
            buttonArea: {
                width: '36%',
                position: 'absolute',
                left: '32%',
                bottom: '45px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            },
            button: {
                width: '42%',
                height: '30px',
                borderRadius: '30px',
                border: 'none',
                color: 'white',
                backgroundColor: 'rgba(54, 122, 209, 0.3)',
                cursor: 'pointer',
                fontSize: '0.7em',
                letterSpacing: '0.08em',
                transition: 'all ease 200ms'
            },
        }
    }, this.state, this.props)}
}


ReactDOM.render(
    <App
        language={config.language}
        user={user}
        app={app}
    />,
    document.getElementById('root')
);
