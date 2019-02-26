let request = require('request-promise');
let cheerio = require('cheerio');
let logger = require('debug')('juejin:read');
// 获取标签数组
async function tags (url) {
    logger('开始读取标签列表');
    let html = await request(url);
    let $ = cheerio.load(html);
    let infos = $('div.info-box');
    let tags = [];
    infos.each(function(index, item){
        let that = $(item);
        // 取出标签的超链接
        let href = that.children('a').first().attr('href');
        // url = decodeURIComponent(url);
        // 取出此标签对应的图片
        let image = that.find('div.lazy').first().data('src');
        image = image.split('?')[0];
        let name = that.find('div.title').first().text();
        let subscribe = that.find('div.subscribe').first().text();
        let article = that.find('div.article').first().text();
        subscribe = parseInt(subscribe.match(/(\d+)/)[1]);
        article = parseInt(article.match(/(\d+)/)[1]);
        logger('读到标签：'+name);
        tags.push({
            url: `https://juejin.im${href}`,
            image,
            name,
            subscribe,
            article
        });
    });
    // console.log(tags);
    return tags;
}

// 这里用来获取标签下面的文章列表
async function articles (url) {
    logger('开始读取标签下的文章列表');
    let html = await request(url);
    let $ = cheerio.load(html);
    let list = $('.info-row.title-row > a.title');
    // console.log(list.length);
    let articles = [];
    // list.each(async function(index, item){
        for(let i = 0; i < list.length; i++){
            let _this = $(list[i]);
            // 取得超链接  /post/5c6e71acf265da2dda694b27
            let href= `https://juejin.im${_this.attr('href')}`;
            let lastIndex = href.lastIndexOf('/');
            let id = href.slice(lastIndex + 1);
            // 获取文章id
            // let id = href.match(/https://juejin.im/);
            // let id = href.slice(23);
            // 获取文章标题
            let title = _this.text();
            let {content, tags} = await readArticle(id, href);
            logger('读取文章:' + title);
            articles.push({
                id, //从网站爬到的id
                title,//标题
                href,// 超链接
                content,//文章内容
                tags//标签数组
            });
        }
    // });
    return articles;
}

// 参数是文章的id和超链接， 返回的是文章内容和所拥有的标签的数组
async function readArticle(id, href){
    // 必须加await
    let html = await request(href);
    let $ = cheerio.load(html);
    let content = $('.article-content').first().html();
    if (content) {
        content = content.replace(/&#x(\w+?);/g, function(matched, point){
            // 转化为中文
            return String.fromCodePoint(`0x${point}`);
        });
    }
    let tagTitles = $('.tag-title');
    let tags = [];
    tagTitles.each(function (index, item) {
        let _this = $(item);
        tags.push(_this.text());
    });
    return { content, tags };
}

// tags('https://juejin.im/subscribe/all').then(ret=>console.log(ret))
// articles('https://juejin.im/tag/%E5%89%8D%E7%AB%AF').then(ret=>console.log(ret))
// readArticle('5c6e71acf265da2dda694b27','https://juejin.im/post/5c6e71acf265da2dda694b27').then(ret=>console.log(ret))

module.exports = {
    tags,
    articles
};