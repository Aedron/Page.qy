const fs = require('fs');
const path = require('path');
const GitHub = require('github-api');
const Git = require('simple-git');
const config = require('./config').get();
const setConfig = require('./config').set;


const userPath = path.join(__dirname, '../../user/');

const gh = new GitHub({
    username: config.username,
    password: config.password
});


function isRepoExist() {
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



async function getRepoPath() {
    const name = config.username;
    if (!fs.readdirSync(userPath).includes(`${name}.github.io`)) {
        if (await isRepoExist())
            await Git(userPath).clone(
                `https://github.com/${name}/${name}.github.io`,
                path.join(userPath, `/${name}.github.io`)
            );
        else
            await gh.getUser().createRepo({name: `${name}.github.io`});
    }
    return `${userPath}${name}.github.io`;
}


async function pushRepo() {
    const path = await getRepoPath();
    const URL = `https://github.com/${config.username}/${config.username}.github.io`;
    await Git(path)
        .add(`./*`)
        .commit('Update')
        .push(['-u', 'origin', 'master'])
}


async function getUserInfo() {
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
    })
}

getUserInfo().then(a => console.log(a));
