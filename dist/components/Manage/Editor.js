import React from 'react';
import reactCSS from 'reactcss';
import eventProxy from '../../lib/eventProxy';


export default class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.style = this.style.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleEditArticle = this.handleEditArticle.bind(this);
        this.saveArticle = this.saveArticle.bind(this);

        this.state = {
            title: '',
            tags: [],
            introduction: '',
            key: ''
        }
    }

    componentWillMount() {
        eventProxy.on('editArticle', function (data) {
            this.handleEditArticle(data);
        }.bind(this));
        eventProxy.on('createArticle', this.handleEditArticle);
        eventProxy.on('closeEditor', function () {
            this.saveArticle();
        }.bind(this));
    }

    handleEditArticle(data) {
        data && this.setState(data);
        this.refs.editor.contentWindow.document
            .getElementById('editorContainer')
            .innerHTML = data ? data.content : '';
        if (this.refs.editor.contentWindow.document
                .getElementsByClassName('init').length > 0)
            return;
        this.refs.editor.contentWindow.document
            .getElementsByTagName('body')[0]
            .appendChild(function () {
                const script = document.createElement('script');
                script.className='init';
                script.type = 'text/javascript';
                script.innerHTML = `init('${this.props.config.get().language}')`;
                return script
        }.bind(this)())
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value })
    }

    handleTagsChange(e) {
        let value = e.target.value;
        value = value.split('    ').join('').split('#');
        value.shift();
        this.setState({ tags: value })
    }

    async saveArticle() {
        const content = this.props.formatContent(
            this.refs.editor.contentWindow.document
                .getElementById('editorContainer').innerHTML,
            this.state.key
        );
        let data = {
            title: this.state.title,
            tags: this.state.tags,
            content: content,
            introduction: function () {
                let container = document.createElement('div');
                container.innerHTML = content;
                return container.innerText.slice(0, 150) + '......';
            }.bind(this)()
        };
        if (this.state.key === '') {
            if (this.state.title === '' &&
                (content === '' || content.replace(/\<(\s|.)*?\/?\>/g, '').trim() === '')) {
                eventProxy.trigger('changeManageView', 'article');
                return;
            }
            else {
                data = await this.props.db.createArticle(data);
                eventProxy.trigger('refreshArticleList', null);
            }
        }
        else {
            data.key = this.state.key;
            await this.props.db.editArticle(data);
            eventProxy.trigger('updateArticleData', data);
        }
        eventProxy.trigger('changeManageView', 'article');
        this.props.dataToHTML.dataToArticle(data.key);
        console.log(data.key);
        this.props.dataToHTML.dataToHome()
            .then(path => eventProxy.trigger('refreshPreview', path));
        this.props.dataToHTML.dataToTags();
        this.props.dataToHTML.dataToArchives();

        this.setState(() => ({
            title: '',
            tags: [],
            key: '',
            introduction: ''
        }));
    }

    render() {return(
        <div>
            <input
                value={this.state.title}
                onChange={this.handleTitleChange}
                type="text" style={this.style().title}
                placeholder="TYPE TITLE HERE..."
            />
            <input
                ref="tags"
                value={this.state.tags.length > 0 ?
                    '#' + this.state.tags.join('    #') : ''}
                onChange={this.handleTagsChange}
                type="text" style={this.style().tags}
                placeholder="ADD TAGS BY '#'"
            />
            <iframe
                style={this.style().editor}
                ref="editor"
                src="../../src/html/editor.html"
            />
        </div>
    )}

    style() {return(reactCSS({
        default: {
            container: {
                width: '100%'
            },
            title: {
                width: 'calc(100% - 30px)',
                height: '40px',
                fontSize: '1.5em',
                border: 'none',
                marginTop: '20px',
                padding: '0 15px'
            },
            tags: {
                width: 'calc(100% - 36px)',
                height: '30px',
                margin: '15px 0 20px 0',
                padding: '0 18px',
                border: 'none',
                fontSize: '1em',
            },
            editor: {
                width: 'calc(100% - 80px)',
                height: 'calc(100% - 125px)',
                position: 'absolute',
                top: '125px',
                left: '40px',
                border: 'none'
            }
        }
    }, this.props, this.state))}
}
