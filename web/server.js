const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { query }= require('../mysql');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    resave: true,
    secret: 'zfpx',
    saveUninitialized: true
}));
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

app.get('/detail/:id', async function(req, res){
    let id = req.params.id;
    let articles = await query(`SELECT * FROM articles WHERE id=?`, [id]);
    res.render('detail', {
        title: '文章详情',
        article: articles[0]
    });
});
app.get('/login', async function(req, res){
    res.render('login', {
        title: '登录'
    });
});
app.post('/login', async function(req, res){
    let { email } = req.body;
    let oldUsers = await query(`SELECT * FROM users WHERE email=?`,[email]);
    if(Array.isArray(oldUsers) && oldUsers.length >0){
        req.session.user = oldUsers[0];
        res.redirect('/');
    } else {
        let result = await query(`INSERT INTO users(email) VALUES(?)`,[email]);
        let oldUsers = await query(`SELECT * FROM users WHERE email=?`,[email]);
        req.session.user = {
            id: result.insertId,
            email
        };
    }
});

app.get('/subscribe', async function(req,res){
    let tags = await query(`SELECT * FROM tags`);
    let user = req.session.user;
    let selectedTags = await query(`SELECT tag_id from user_tag WHERE user_id=?`,[user.id]);
    let selectTagIds = selectedTags.map(item=>item['tag_id']);
    tags.forEach(item=>{
        item.checked = selectTagIds.indexOf(item.id) != -1 ? 'true' : 'false';
    });
    res.render('subscribe',{
        title: '请订阅你感兴趣的标签',
        tags
    });
});

app.post('/subscribe', async function(req,res){
    let { tags } = req.body;//[ '1', '2', '9' ] }
    let user = req.session.user;//{id,name}
    await query(`DELETE FROM user_tag WHERE user_id=?`, [user.id]);
    for (let i = 0; i < tags.length; i++) {
        await query(`INSERT INTO user_tag(user_id,tag_id) VALUES(?,?)`, [user.id, parseInt(tags[i])])
    }
    res.redirect('/');
});

app.listen(8080);

/**
 * 1.权限中间件
 * 2.如果拉到了新的文章，要把此文章推送给订阅了此标签的用户，发邮件
 * 3.搜索
 * 4.部署上线
 */