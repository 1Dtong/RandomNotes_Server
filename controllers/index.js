// 封装一个函数用来连接数据库
const mysql = require('mysql2/promise');
const config = require('../config/index.js');

// 线程池
const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
})

// 封装一个函数用来连接数据库，执行sql语句
const allServices = {
    async query(sql, values) {
        try {
            // 通过线程池连接mysql
            const conn = await pool.getConnection();
            // 对连接执行某些操作
            const [rows, fields] = await conn.query(sql, values);
            // 释放连接
            pool.releaseConnection(conn);
            // 返回结果
            return Promise.resolve(rows);
        } catch (error) {
            return Promise.reject(error); // 抛出错误
        }
    }
}

// 登录
const userLogin = (username, password) => {
    let _sql = `select * from users where username = "${username}" and password = "${password}";`
    return allServices.query(_sql);
}

// 注册
const userRegister = (username, password, nickname) => {
    let _sql = `insert into users set username = "${username}", password = "${password}" , nickname = "${nickname}";`
    // const userRegister = (values)
    // let _sql = `insert into users (username, password, nickname) values ("${values.username}", password = "${values.password}" , nickname = "${values.nickname}");`
    return allServices.query(_sql);
}

// 查找账号
const userFind = (username) => {
    let _sql = `select * from users where username = "${username}";`
    return allServices.query(_sql);
}

// 根据分类查找日记
const findNoteListByType = (type_note, id) => {
    let _sql = `select * from note where note_type="${type_note}" and userId="${id}";`
    return allServices.query(_sql);
}

// 根据日记查找内容
const findNoteById = (id) => {
    let _sql = `select * from note where id="${id}";`
    return allServices.query(_sql);
}

// 向数据库中存入数据
const notePublish = (values) => {
    let _sql = `insert into note (title, note_type, head_img, note_content, nickname, userId) values ("${values.title}", "${values.note_type}", "${values.head_img}", "${values.note_content}", "${values.nickname}", "${values.UserId}");`
    return allServices.query(_sql);
}
// const notePublish = (title, note_type, head_img, note_content, nickname, userId) => {
//     let _sql = `insert into note (title, note_type, head_img, note_content, nickname, userId) values ("${title}", "${note_type}", "${head_img}", "${note_content}", "${nickname}", "${userId}");`
//     return allServices.query(_sql);
// }

module.exports = { 
    userLogin,
    userRegister,
    userFind,
    findNoteListByType,
    findNoteById,
    notePublish
};