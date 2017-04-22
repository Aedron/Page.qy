const fs = require('node-fs-extra');
const path = require('path');
const templateEngine = require('./templateEngine');
const db = require('./db');


module.exports.dataToArticle = dataToArticle;
module.exports.dataToHome = dataToHome;
module.exports.dataToArchives = dataToArchives;


const config = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../../user/config.json'),
    'utf-8'
));
const theme = path.join(__dirname, `../../user/themes/${config.theme}/`);
const target = path.join(__dirname, '../../user/temp/');



function dataToArticle(rawData) {
    let article = fs.readFileSync(
        path.join(theme, './templates/article.html'),
        'utf-8'
    );

    const templateData = {
        data: {
            date: formatDate(rawData.createDate),
            content: rawData.content,
            tags: rawData.tags,
            archives: rawData.archives,
            avatar: config.avatar,
            name: config.name,
            username: config.username,
            selfIntroduction: config.selfIntroduction,
        },
        link: {
            home: '../index.html',
            tags: '../tags.html',
            archives: '../archives.html',
            about: '../about.html'
        },
        script: `../statics/script`,
        statics: '../statics/statics',
        style: `../statics/style`,
        title: rawData.title,
        user: {
            avatar: config.avatar,
            name: config.name,
            selfIntroduction: config.selfIntroduction,
            username: config.username,
        }
    };
    article = templateEngine.parse(templateData, article);

    const targetPath = path.join(target, `./articles/`);
    !fs.existsSync(targetPath) && fs.mkdirSync(targetPath);
    fs.writeFileSync(path.join(targetPath, `${rawData.key}.html`), article, 'utf-8');
    updateStaticFiles();
    return path.join(targetPath, `${rawData.key}.html`)
}



async function dataToHome() {
    let home = fs.readFileSync(
        path.join(theme, './templates/index.html'),
        'utf-8'
    );

    const templateData = {
        data: (await db.getPublishedArticleList()).map(article => {
            article.date = formatDate(article.createDate);
            article.link = `./articles/${article.key}.html`;
            return article
        }).sort((a, b) => (
            (new Date(b.createDate)).getTime() - (new Date(a.createDate)).getTime()
        )),
        link: {
            home: './index.html',
            tags: './tags.html',
            archives: './archives.html',
            about: './about.html'
        },
        script: `./statics/script`,
        statics: './statics/statics',
        style: `./statics/style`,
        title: 'Home',
        user: {
            avatar: config.avatar,
            name: config.name,
            selfIntroduction: config.selfIntroduction,
            username: config.username,
        }
    };
    home = await templateEngine.parse(templateData, home);

    const targetPath = target;
    fs.writeFileSync(path.join(targetPath, 'index.html'), home, 'utf-8');
    updateStaticFiles();
    return path.join(targetPath, 'index.html')
}


async function dataToArchives() {
    let archives = fs.readFileSync(
        path.join(theme, './templates/archives.html'),
        'utf-8'
    );

    const templateData = {
        data: await getArchiveData(),
        link: {
            home: './index.html',
            tags: './tags.html',
            archives: './archives.html',
            about: './about.html'
        },
        script: `./statics/script`,
        statics: './statics/statics',
        style: `./statics/style`,
        title: 'Archives',
        user: {
            avatar: config.avatar,
            name: config.name,
            selfIntroduction: config.selfIntroduction,
            username: config.username,
        }
    };

    console.log(templateData.data);
    archives = await templateEngine.parse(templateData, archives);

    const targetPath = target;
    fs.writeFileSync(path.join(targetPath, 'archives.html'), archives, 'utf-8');
    updateStaticFiles();
    return path.join(targetPath, 'archives.html')
}


async function getArchiveData() {
    const articles = (await db.getPublishedArticleList())
        .sort((a, b) => (
                (new Date(b.createDate)).getTime() - (new Date(a.createDate)).getTime()
            ));
    const data = [];
    let yearData = {
        year: null,
        monthData: []
    };
    let monthData = {
        month: null,
        articles: []
    };
    for (article of articles) {
        article.date = formatDate(article.createDate);
        article.link = `./articles/${article.key}.html`;

        !monthData.month && (monthData.month = article.date.month);
        if (monthData.month !== article.date.month) {
            yearData.monthData.push(monthData);
            monthData = {
                month: null,
                articles: []
            };
        }
        monthData.articles.push(article);

        !yearData.year && (yearData.year = article.date.year);
        if (yearData.year !== article.date.year) {
            data.push(yearData);
            yearData = {
                year: null,
                monthData: []
            };
        }
    }
    yearData.monthData.push(monthData);
    data.push(yearData);
    return data
}


function updateStaticFiles() {
    fs.copySync(
        path.join(theme, './style/'),
        path.join(target, './statics/style/')
    );
    fs.copySync(
        path.join(theme, './script/'),
        path.join(target, './statics/script/')
    );
    fs.copySync(
        path.join(theme, './statics/'),
        path.join(target, './statics/statics/')
    );
}


function formatDate(date) {
    date = new Date(date);
    const daysZh = ['日', '一','二','三','四','五','六'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'];
    return {
        year: date.getFullYear(),
        month: date.getMonth()+1 < 10 ? '0' + date.getMonth() : date.getMonth(),
        date: date.getDate()+1 < 10 ? '0' + date.getDate() : date.getDate(),
        hours: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minutes: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        day: config.language === 'zh' ?
            `星期${daysZh[date.getDay()]}`:
            daysEn[date.getDay()]
    }
}
