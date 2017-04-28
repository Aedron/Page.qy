import React from 'react';
import reactCSS from 'reactcss';
import eventProxy from '../../lib/eventProxy';
import path from 'path';


export default class Article extends React.Component {
    constructor(props) {
        super(props);
        this.style = this.style.bind(this);
        this.handleEditArticle = this.handleEditArticle.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handlePublish = this.handlePublish.bind(this);

        this.state = {
            date: this.props.data.createDate,
            tags: this.props.data.tags,
            title: this.props.data.title,
            content: this.props.data.content,
            introduction: this.props.data.introduction,
            key: this.props.data.key,
            published: this.props.data.published,
            translateY: 50,
            translateX: `${5 * 100 / 28}%`
        }
    }

    componentWillMount() {
        eventProxy.on('updateArticleData', function (data) {
            data.key === this.state.key &&
                this.setState(data)
        }.bind(this));
    }

    componentDidMount() {
        eventProxy.on(`translateY-${this.props.index}`, function (value) {
            this.setState({ translateY: value });
            const nextValue = this.refs.article.offsetHeight + value + 50;
            eventProxy.trigger(`translateY-${this.props.index + 3}`, nextValue)
        }.bind(this));
        setTimeout(function () {
            if (this.props.index < 3)
                eventProxy.trigger(`translateY-${this.props.index + 3}`,
                this.refs.article.offsetHeight + 50 + 50);
            const index = this.props.index % 3;
            index !== 0 && this.setState({
                translateX: index === 1 ?
                    `${(28 + 5 + 4) * 100 / 28}%` : `${(28 + 5 + 4 + 28 + 4) * 100 / 28}%`
            });
        }.bind(this), 1);
    }

    handleEditArticle() {
        eventProxy.trigger('editArticle', Object.assign(
            {}, this.props.data, this.state
        ));
    }

    handleConfirm(flag) {
        this.refs.confirm.className =
            `articleConfirm${flag === 'on' ? ' activated' : ''}`
    }

    async handleDelete() {
        await this.props.db.deleteArticle(this.state.key);
        this.refs.article.className = 'articleContainer deleted';
        setTimeout(function () {
            this.refs.article.style.display = 'none';
        }.bind(this), 600);
        const path =  await this.props.dataToHTML.dataToHome();
        this.props.dataToHTML.dataToArticle(this.state);
        this.props.dataToHTML.dataToTags();
        this.props.dataToHTML.dataToArchives();
        eventProxy.trigger('refreshPreview', path);
    }

    handlePreview() {
        const path = this.props.dataToHTML.getArticlePath(this.state.key);
        this.props.openWindow(path, {
            width: 1000,
            height: 700
        });
    }

    async handlePublish() {
        this.setState((prevState) => ({
            published: !prevState.published
        }));
        await this.props.db.togglePublish(this.state.key);
        const path =  await this.props.dataToHTML.dataToHome();
        this.props.dataToHTML.dataToArticle(this.state);
        this.props.dataToHTML.dataToTags();
        this.props.dataToHTML.dataToArchives();
        eventProxy.trigger('refreshPreview', path);
    }

    dateToString(date) {
        date = new Date(date);
        const daysZh = ['日', '一','二','三','四','五','六'];
        const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'];
        const [year, month, dateString, hours, minutes, day] = [
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate(),
            date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
            date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
            date.getDay()
        ];
        return this.props.config.get().language === 'zh' ?
            `${year}年${month}月${dateString}日\xa0\xa0\xa0\xa0\xa0\xa0${hours}:${minutes}\xa0\xa0\xa0\xa0\xa0\xa0星期${daysZh[day]}` :
            `${year}/${month}/${dateString}\xa0\xa0\xa0\xa0\xa0\xa0${hours}:${minutes}\xa0\xa0\xa0\xa0\xa0\xa0${daysEn[day]}`
    }

    render() {return(
        <div
            style={this.style().container}
            className="articleContainer"
            ref="article"
        >

            <div
                ref="contentContainer"
                style={this.style().contentContainer}
            >
                <p style={this.style().date}>{this.dateToString(this.state.date)}</p>
                {this.state.tags && this.state.tags.map((tag, index) => (
                    <p
                        style={Object.assign(this.style().tags, {
                            marginLeft: index === 0 ? '40px': 0
                        })}
                        key={index}
                    >#{tag}</p>
                ))}
                <p style={this.style().title}>
                    {this.state.title === '' ?
                        'Untitled Article' : this.state.title}
                </p>
                <div>{this.state.introduction}</div>
            </div>
        </div>
    )}

    style() {return reactCSS({
        default: {
            container: {
                position: 'absolute',
                boxShadow: '0px 3px 15px 0px rgba(0,0,0,0.50)',
                left: 0, top: 0,
                width: '28%',
                marginBottom: '100px',
        // transition: 'all ease 400ms',
                transform: `translateX(${this.state.translateX}) translateY(${this.state.translateY}px)`,
                // transitionDelay: `${this.props.index * 50}ms`
            },
            contentContainer: {
                width: 'calc(100% - 30px)',
                height: 'calc(100% - 30px)',
                backgroundColor: 'white',
                boxShadow: '0px 14px 21px 0px rgba(0,0,0,0.10)',
                padding: '15px',
                color: '#413F3F',
                letterSpacing: '0.1em'
            },
            date: {
                display: 'inline-block',
                marginRight: '30px'
            },
            tags: {
                display: 'inline-block',
                marginRight: '20px'
            },
            title: {
                fontSize: '2em',
                fontWeight: 'bold',
                margin: '10px 0',
                letterSpacing: '0.01em'
            },
            operateContainer: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0, left: 0,
                backgroundImage: 'linear-gradient(-225deg, rgba(85, 203, 242, 0.87) 0%, rgba(61, 144, 239, 0.92) 100%)',
            },
            operateButton: {
                width: '16%',
                height: '100%',
                display: 'inline-flex',
                margin: '0 2%',
                flexDirection: 'column',
                justifyContent: 'space-around',
                justifyItems: 'center',
                cursor: 'pointer'
            },
            operateButtonImg: {
                width: 'auto',
                height: '35px',
                cursor: 'pointer'
            },
            operateButtonText: {
                fontSize: '1.2em',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer'
            },
            confirmContainer: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0, left: 0,
                backgroundImage: 'linear-gradient(-225deg, rgba(85, 203, 242, 1) 0%, rgba(61, 144, 239, 1) 100%)',
                color: 'white',
                textAlign: 'center',
                letterSpacing: '0.1em',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                justifyItems: 'center',
                fontSize: 'normal'
            },
            confirmButton: {
                width: '70px',
                display: 'inline-block',
                padding: '8px 10px',
                margin: '10px 30px 0 30px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '0.3em'
            }
        }
    }, this.props, this.state)}
}
