let { query } = require('../mysql');
let logger = require('debug')('juejin:write');
let sendMail = require('../mail');
//保存标签的数组
async function saveTags(tags) {
    logger('开始保存所有的标签');
    //一个标签在数据库只能保存一份
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        let oldTags = await query(`SELECT * FROM tags WHERE name = ?`, [tag.name]);
        if (Array.isArray(oldTags) && oldTags.length > 0) {
            logger('更新标签:' + tag.name);
            await query(`UPDATE tags SET image=?,url=?,subscribe=?,article=? WHERE name=?`, [tag.image, tag.url, tag.subscribe, tag.article, tag.name]);
        } else {
            logger('插入标签:' + tag.name);
            await query(`INSERT INTO tags(name,image,url,subscribe,article) VALUES(?,?,?,?,?)`, [tag.name, tag.image, tag.url, tag.subscribe, tag.article]);
        }
    }
}
//保存文章的数组
async function saveArticles(articles) {
    logger('开始保存所有的文章');
    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];//tags ["前端","数据库"]
        let oldArticles = await query(`SELECT 1 FROM articles WHERE id=?`, [article.id]);
        if (Array.isArray(oldArticles) && oldArticles.length > 0) {
            logger('开始更新文章:' + article.title);
            await query(`UPDATE articles SET title=?,content=?,href=? WHERE id=?`, [article.title, article.content, article.href, article.id]);
        } else {
            logger('开始插入文章:' + article.title);
            await query(`INSERT INTO articles(id,title,content,href) VALUES(?,?,?,?)`, [article.id, article.title, article.content, article.href]);
        }
        logger('开始处理文章标签关系:' + article.title);
        await query(`DELETE FROM article_tag WHERE article_id=?`, [article.id]);
        //第一步要查找标签名称对应的ID，第二步把标签ID和文章ID关联保存到article_tag表里
        //SELECT id FROM tags WHERE name in ('前端','数据库');
        let tags = article.tags;//['前端','数据库']
        let whereClause = `('` + tags.join(`','`) + `')`;//('前端','数据库')
        // [{id:1},{id:2}]
        let tagIdObj = await query(`SELECT id FROM tags WHERE name in ${whereClause}`);
        for (let i = 0; i < tagIdObj.length; i++) {
            await query(`INSERT INTO article_tag(article_id,tag_id) VALUES(?,?)`, [article.id, tagIdObj[i].id]);
        }
        let tagIdsString = tagIdObj.map(item=>item.id).join(',');// 1,2
        if (tagIdObj.length >0) {
            // let tagIdWhere = tagIds.join(',');
            let emailArray = await query(`SELECT distinct email from user_tag ut INNER JOIN users WHERE tag_id IN (${tagIdsString})`);
            let emails = emailArray.map(item => item.email);
            for (let i =0;i<emails.length;i++) {
                logger(`开始向${emails[i]}发邮件：${article.title}`);
                await sendMail(emails[i], article.title, article.href);
            }
        }
    }
}

//saveTags([{ name: '前端' }]);

module.exports = {
    saveTags,
    saveArticles
}