const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secureConnection: true,
    auth: {
        user: '741953435@qq.com',
        pass: 'qlloveyan3279'
    }
});


module.exports = function(to,title, href){
    let mailOptions = {
        from: '741953435@qq.com',
        to: to,
        subject: '你订阅的标签有新的文章了',
        html: `<div>
            <a href="${href}">${title}</a>
        </div>`
    };
    return new Promise(function(resolve, reject){
        transporter.sendMail(mailOptions, (err, info)=>{
            console.log(err);
            logger(`发送邮件 发件人：741953435@qq.com,收件人：${to}`, err, info);
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
}
