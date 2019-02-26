let request = require('request-promise');
let cheerio = require('cheerio');

// 获取标签数组
async function tags (url) {
    let html = await request(url);
    let $ = cheerio.load(html);
    let infos = $('div.info-box');
    let tags = [];
    infos.each(function(index, item){
        let that = $(item);
        // 取出标签的超链接
        let href = that.children('a').first().attr('href');
        href = decodeURIComponent(href);
        // 取出此标签对应的图片
        let image = that.find('div.lazy').first().data('src');
        image = image.split('?')[0];
        let title = that.find('div.title').first().text();
        let subscribe = that.find('div.subscribe').first().text();
        let article = that.find('div.article').first().text();
        subscribe = subscribe.match(/(\d+)/)[1];
        article = article.match(/(\d+)/)[1];
        tags.push({
            href,
            image,
            title,
            subscribe,
            article
        });
    });
    console.log(tags);
    return tags;
}

// 读取标题的列表
async function articles () {
    
}
tags('https://juejin.im/subscribe/all').then(ret=>console.log(ret))

module.exports = {
    tags,
    articles
};