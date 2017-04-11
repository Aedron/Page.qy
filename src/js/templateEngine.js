const $ = require('cheerio');

module.exports.parse = parse;


function parse(rawData, template) {
    // console.log(rawData);
    with (rawData) {
        let templateDOM = $.load(template);
        let match = templateDOM('template');
        while (match.length > 0) {
            template = template.replace($.html(match[0]), (() => {
                const templateHTML = $.html(match[0].children);
                const attr = match[0].attribs['@for'];
                const a = attr.replace(/\s+of\s+.+/g, '');
                const b = attr.replace(/.+\s+of\s+/g, '');
                const aString = a;
                let temp = '';
                const exec = `for (${a} of ${b}) temp += parse(Object.assign({}, rawData, {${aString}: ${a}}), templateHTML)`
                eval(exec);
                return temp;
            })());

            templateDOM = $.load(template);
            match = templateDOM('template');
        }
    }


    return parseTemplate(rawData, template)
}


function parseTemplate(rawData, template) {
    for (varible in rawData)
        if (rawData.hasOwnProperty(varible))
            this[varible] = rawData[varible];

    const match = template.match(/\{\{(.|\s)+?\}\}/g);
    for (each of match)
        template = template.replace(each, eval(each.replace(/(\{+|\}+)/g, '')));
    return template;
}


function test() {
    const rawData = { statics: '../static/static',
        script: '<script type="text/javascript" rel="script" src="../static/js/common.js"/>\n        <script type="text/javascript" rel="script" src="../static/js/article.js"/>',
        style: '<link type="text/css" rel="stylesheet" href="../static/css/common.css"/>\n        <link type="text/css" rel="stylesheet" href="../static/css/article.css"/>',
        link: { home: '../index.html' },
        data:
            { date:
                { year: 2017,
                    month: '03',
                    date: '02',
                    hours: 22,
                    minutes: 15,
                    day: '星期日' },
                title: 'Welcome! Enjoy you writting!',
                content: '<p>😉You just set up your site.qy successful! It\'s <b><u>quite light</u></b>&nbsp;and&nbsp;<b><u>easy to use</u></b>. Just enjoy writing with it~</p><p>This theme was designed and coded by myself for my own blog @&nbsp;<a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/">http://www.codeblocq.com/</a>. It is clean and bright, hopefully you will like it to !</p><p>It only has a dependency on&nbsp;<a href="http://tachyons.io/" target="_blank">tachyons</a>&nbsp;and&nbsp;<a href="http://fontawesome.io/icons/" target="_blank">Font Awesome</a>&nbsp;which makes it really fast and lightweight. No jQuery, no other JS libraries.</p><h2>Features Overview</h2><ul><li>Responsive<br></li><li>Disqus comments</li><li>Google Analytics</li><li>Tags Support</li><li>Responsive Images</li><li>Responsive YouTube and Vimeo videos</li><li>Social Accounts configuration</li><li>Pagination</li><li>Pages</li><li>Categories Support (widget)</li><li>About widget</li><li>Recent posts widget</li><li>Stylus CSS preprocessor</li><li>ejs HTML templates</li></ul><p>Note: No Image Gallery. Useless and too heavyweight. Feel free to develop one and send me a PR if you feel like this is a must.</p><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#External-libraries-used"></a>External libraries used</h2><ul><li><a href="http://tachyons.io/" target="_blank">tachyons</a></li><li><a href="http://fontawesome.io/icons/" target="_blank">Font Awesome</a></li></ul><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Installation"></a>Installation</h2><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Install-the-theme"></a>Install the theme</h3><p>Install the theme by using:</p><figure><table class="clicked"><tbody><tr><td><pre>$ git clone https://github.com/klugjo/hexo-theme-anodyne themes/anodyne<br></pre></td></tr></tbody></table></figure><p>Then update your blog’s main&nbsp;_config.yml&nbsp;to set the theme to&nbsp;anodyne:</p><p>i.e:</p><figure><table><tbody><tr><td><pre># Extensions<br>## Plugins: http://hexo.io/plugins/<br>## Themes: http://hexo.io/themes/<br>theme: anodyne<br></pre></td></tr></tbody></table></figure><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Post-Configuration"></a>Post Configuration</h2><p>Each post supports the standard&nbsp;title,&nbsp;date,&nbsp;categories,&nbsp;tags.</p><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Post-Icon"></a>Post Icon</h3><p>On top of that, you can specify a custom font-Awesome icon in the front matter:</p><p>Example:</p><figure><table class=""><tbody><tr><td><pre>title: Welcome to Anodyne<br>tags: ["ThisIsATag", "Intro", "Welcome", "Anodyne"]<br>categories: ["Configuration", "Hexo"]<br>icon: fa-handshake-o<br>---<br></pre></td></tr></tbody></table></figure><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Theme-Configuration"></a>Theme Configuration</h2><p>The theme’s global configuration is done in&nbsp;/themes/hexo-theme-anodyne/_config.yml.</p><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Menu"></a>Menu</h3><p>The menu is configured in the theme’s&nbsp;_config.yml.</p><figure><table><tbody><tr><td><pre># Header<br>menu:<br>  Home: /<br>  Archives: /archives<br>  About: /about.html<br></pre></td></tr></tbody></table></figure><p>The object key is the label and the value is the path.</p><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Blog’s-Logo-Image-Source"></a>Blog’s Logo Image Source</h3><p>The blog’s logo is configured in the theme’s&nbsp;_config.yml.</p><p>It should be an image or svg</p><figure><table><tbody><tr><td><pre># Logo<br>logo_image_source: /assets/anodyne.svg<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Footer-About-Section-Text"></a>Footer About Section Text</h3><p>The About section’s text in the footer is configured in the theme’s&nbsp;_config.yml. HTML allowed.</p><figure><table><tbody><tr><td><pre># Footer about<br>footer_about: "@Untitled. All right reserved"<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Default-post-title"></a>Default post title</h3><p>The default post title (used when no title is specified) is configured in the theme’s&nbsp;_config.yml.</p><figure><table><tbody><tr><td><pre>default_post_title: Untitled<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Default-post-icon"></a>Default post icon</h3><p>The default post icon (used when no icon is specified) is configured in the theme’s&nbsp;_config.yml.</p><figure><table><tbody><tr><td><pre>default_post_icon: fa-file-text-o<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Home-page-configuration"></a>Home page configuration</h3><p>Likewise, you can configure the home page’s title, subtitle and icon in the&nbsp;_config.yml</p><figure><table><tbody><tr><td><pre># Index Page<br>index_banner_text: Welcome to Anodyne<br>index_banner_text_secondary: Create Websites. Make Magic.<br>index_font_awesome_icon_css: fa fa-magic<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Archive-Date-Format"></a>Archive Date Format</h3><p>You can change the date format for the archive page if you so desire</p><figure><table><tbody><tr><td><pre># Archive Date Format<br>archive_date_format: MMM YYYY<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Disqus-Comments"></a>Disqus Comments</h3><p>The disqus shortname is specified in the theme’s&nbsp;_config.yml.</p><figure><table><tbody><tr><td><pre># Comments.<br>comments:<br>  # Disqus comments<br>  disqus_shortname: yournametest<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Google-Analytics"></a>Google Analytics</h3><p>The Google Analytics Tracking ID is configured in the theme’s&nbsp;_config.yml.</p><figure><table><tbody><tr><td><pre># Google Analytics Tracking ID<br>google_analytics:<br></pre></td></tr></tbody></table></figure><h3><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Social-Account"></a>Social Account</h3><p>Setup the links to your social pages in the theme’s&nbsp;_config.yml&nbsp;as an array of objects. Links are in the footer.</p><figure></figure><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Creator"></a>Creator</h2><p>This theme was created by Jonathan Klughertz, check out my&nbsp;<a href="https://github.com/klugjo" target="_blank">github</a>&nbsp;and&nbsp;<a href="http://www.codeblocq.com/">blog</a>.</p><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#Bugs"></a>Bugs</h2><p>If you have a question, feature request or a bug you need me to fix, please&nbsp;<a href="https://github.com/klugjo/hexo-theme-anodyne/issues/new" target="_blank">click here</a>&nbsp;to file an issue.</p><h2><a href="http://www.codeblocq.com/assets/projects/hexo-theme-anodyne/2016/10/03/Welcome-to-Alpha-Dust/#License"></a>License</h2><p>MIT</p><p>Enjoy :)</p><p><br></p>',
                tags: [ 'Hello ', 'Tutorials' ],
                archives: undefined,
                avatar: 'https://avatars2.githubusercontent.com/u/23466520?v=3',
                name: '胡青杨',
                username: 'HuQingyang',
                selfIntroduction: 'Create something awesome.' }
    };

    for (varible in rawData)
        if (rawData.hasOwnProperty(varible))
            this[varible] = rawData[varible];
    console.log(data)
}

// console.log(test());
