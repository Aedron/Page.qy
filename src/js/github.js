const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').execSync;
const platform = require('os').platform();
const GitHub = require('github-api');
const Git = require('simple-git');
const config = require('./config').get();
const setConfig = require('./config').set;
const db = require('./db');


module.exports.pushRepo = pushRepo;


if (platform === 'win32') {
    exec('set GIT_CURL_VERBOSE=1');
    exec('set GIT_TRACK_PACKET=2');
}


const userPath = path.join(__dirname, '../../user/');
const gh = new GitHub({
    username: config.username,
    password: config.password
});


async function pushRepo(message) {
    const path = await _getRepoPath();
    return Git(path)
        .pull('origin', 'master', (error) => {
            if (error) return message('error');
            message('pull done');
            console.log('Pull repo success.');
            _copyFile();
        })
        .raw([
            'add',
            '--all'
        ], (error) => {
            if (error) return message('error');
            message('add done');
            console.log('Add files success.')
        })
        .commit(`Update on ${(new Date()).toLocaleString()}`, (error) => {
            if (error) return message('error');
            message('commit done');
            console.log('Pushing repo...');
        })
        .push(['-u', 'origin', 'master'], (error) => {
            if (error) return message('error');
            message('done');
            console.log('Push repo success.')
        });
}


async function _getUserInfo() {
    const info = (await gh.getUser().getProfile()).data;
    const [avatar, name, mail, username] = [
        info.avatar_url,
        info.name,
        info.email,
        info.login
    ];
    setConfig({
        avatar: avatar,
        name: name,
        mail: mail,
        username: username
    });
    await _getRepoPath();
    console.log('Get user info success.')
}


async function _getRepoPath() {
    const name = config.username;
    if (!fs.readdirSync(userPath).includes(`${name}.github.io`)) {
        if (await _isRepoExist()) {
            console.log('Cloning repo ...');
            await Git(userPath).clone(
                `https://github.com/${name}/${name}.github.io`,
                path.join(userPath, `/${name}.github.io`)
            );
            console.log('Clone repo success.')
        }
        else {
            await gh.getUser().createRepo({name: `${name}.github.io`});
            console.log('Create an new repo success.')
        }
    }
    return `${userPath}${name}.github.io`;
}


function _isRepoExist() {
    return new Promise((resolve, reject) => {
        gh.getUser().listRepos().then(repos => {
            let exist = false;
            for (repo of repos.data)
                if (repo.name.toLowerCase() ===
                    `${config.username}.github.io`.toLowerCase())
                    exist = true;
            resolve(exist);
        }).catch(error => reject(error))
    })
}


function _copyFile() {
    const name = config.username;
    const from = path.join(__dirname, '../../user/temp/');
    const to = `${userPath}${name}.github.io`;
    fs.existsSync(path.join(to, './articles')) &&
    fs.removeSync(path.join(to, './articles'));
    fs.existsSync(path.join(to, './statics')) &&
    fs.removeSync(path.join(to, './statics'));
    for (each of fs.readdirSync(from))
        fs.copySync(
            path.join(from, `./${each}`),
            path.join(to, `./${each}`)
        )
    db.backup();
}
