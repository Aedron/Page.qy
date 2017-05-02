import React from 'react';
import reactCSS from 'reactcss';
import eventProxy from '../../lib/eventProxy';
import Select from '../Common/Select';


export default class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.style = this.style.bind(this);
        this.handleConfigChange = this.handleConfigChange.bind(this);
    }

    handleConfigChange(name, value) {
        const config = {};
        config[name] = value;
        eventProxy.trigger('setConfig', this.props.config.set(config));
        eventProxy.trigger('message',
            this.props.config.get().language === 'zh' ?
                '设置已保存!' : 'Apply setting success!')
    }

    render() {return (
        <div style={this.style().container}>
            <h1 style={this.style().title}>
                {this.props.config.get().language === 'zh' ? '设置' : 'SETTING'}
            </h1>
            <div style={this.style().selects}>
                <div style={this.style().selectContainer}>
                    <p style={this.style().selectText}>
                        { this.props.config.get().language === 'zh' ?
                            'LANGUAGE:' : '语言:' }
                    </p>
                    <div style={this.style().select}>
                        <Select
                            onSelect={this.handleConfigChange.bind(null, 'language')}
                            selects={{
                                'zh': '中文',
                                'en': 'English'
                            }}
                            default={this.props.config.get().language}
                        />
                    </div>
                </div>
                <div style={this.style().selectContainer}>
                    <p style={this.style().selectText}>
                        { this.props.config.get().language === 'zh' ?
                            '布局列数:' : 'COLUMNS:' }
                    </p>
                    <div style={this.style().select}>
                        <Select
                            onSelect={this.handleConfigChange.bind(null, 'layoutColumn')}
                            selects={{
                                1: this.props.config.get().language === 'zh' ?
                                    '一' : '1',
                                2: this.props.config.get().language === 'zh' ?
                                    '二' : '2',
                                3: this.props.config.get().language === 'zh' ?
                                    '三' : '3',
                                4: this.props.config.get().language === 'zh' ?
                                    '四' : '4',
                            }}
                            default={this.props.config.get().layoutColumn}
                        />
                    </div>
                </div>
                <div style={this.style().selectContainer}>
                    <p style={this.style().selectText}>
                        { this.props.config.get().language === 'zh' ?
                            '编辑器:' : 'EDITOR:' }
                    </p>
                    <div style={this.style().select}>
                        <Select
                            onSelect={this.handleConfigChange.bind(null, 'editor')}
                            selects={{
                                'default': this.props.config.get().language === 'zh' ?
                                    '默认' : 'Default',
                                'markdown': 'Markdown'
                            }}
                            default={this.props.config.get().editor}
                        />
                    </div>
                </div>
                <div style={this.style().selectContainer}>
                    <p style={this.style().selectText}>
                        { this.props.config.get().language === 'zh' ?
                            '默认视图:' : 'INIT VIEW:' }
                    </p>
                    <div style={this.style().select}>
                        <Select
                            onSelect={this.handleConfigChange.bind(null, 'initView')}
                            selects={{
                                'manage': this.props.config.get().language === 'zh' ?
                                    '管理' : 'Manage',
                                'preview': this.props.config.get().language === 'zh' ?
                                    '预览' : 'Preview',
                                'options': this.props.config.get().language === 'zh' ?
                                    '选项' : 'Options',
                            }}
                            default={this.props.config.get().initView}
                        />
                    </div>
                </div>
            </div>
        </div>
    )}

    style() {return reactCSS({
        default: {
            container: {
                width: 'calc(33% - 50px)',
                height: 'calc(100% - 30px)',
                display: 'inline-block',
                zIndex: 1,
                padding: '15px 25px',
                position: 'absolute',
                top: 0,
                left: 0
            },
            title: {
                fontSize: '2em',
                letterSpacing: '0.1em',
                color: '#4A4A4A'
            },
            selects: {
                width: '95%',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
            },
            selectContainer: {
                margin: '30px 0 60px 0',
                height: '30px',
                display: 'inline-block',
                width: '44%',
                position: 'relative'
            },
            selectText: {
                fontSize: '1.1em',
                fontWeight: 'Bold',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                display: 'block',
                height: '30px',
            },
            select: {
                width: '100%',
                height: '30px',
                position: 'absolute'
            }
        }
    }, this.props, this.state)}
}
