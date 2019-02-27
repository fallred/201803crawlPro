const express = require('express');
const path = require('path');
const { query }= require('../mysql');
const app = express();
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.get('/', async function (req, res) {
    let { tagId } = req.query;
    let tags = await query(`SELECT * FROM tags`);
    if (!tagId) {
        tagId = tags[0].id;
    }
    let articles = await query(`SELECT articles.* FROM article_tag at INNER JOIN articles on at.article_id = articles.id WHERE at.tag_id=?`, [tagId]);
    res.render('index', { title: '主页', tags, articles });
});
app.listen(8080);