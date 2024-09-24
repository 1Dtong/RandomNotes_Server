const router = require('koa-router')();
const { findNoteListByType, findNoteById, notePublish } = require('../controllers/index.js');
const jwt = require('../utils/jwt.js');

router.get('/findNoteListByType', jwt.verify(), async (ctx) => {
    // 获取前端传递的 note_type, 去数据库中以该note_type字段，读取数据，返回给前端
    // console.log(ctx.request.query.note_type);
    const { note_type } = ctx.request.query;
    // console.log(ctx.userId);
    try {
        const res = await findNoteListByType(note_type, ctx.userId);
        console.log(res);
        if (res.length) {
            ctx.body = {
                code: '8000',
                msg: '查询成功',
                data: res
            }
        } else {
            ctx.body = {
                code: '8000',
                msg: '当前分类下没有数据',
                data: 'success'
            }
        }
    } catch (error) {
        ctx.body = {
            code: '8005',
            msg: '服务器异常',
            data: error // 不用打引号，因为error是Object
        }
    }

})

router.get('/findNoteById', jwt.verify(), async (ctx) => {
    const { id } = ctx.request.query;
    console.log(id);
    try {
        const res = await findNoteById(id);
        console.log(res);
        if (res.length) {
            ctx.body = {
                code: '8000',
                msg: '查询成功',
                data: res
            }
        } else {
            ctx.body = {
                code: '8000',
                msg: '当前分类下没有数据',
                data: 'success'
            }
        }
    } catch (error) {
        ctx.body = {
            code: '8005',
            msg: '服务器异常',
            data: error // 不用打引号，因为error是Object
        }
    }
})

router.post('/note-publish', jwt.verify(), async (ctx) => {
    // console.log(ctx.userId, '///');
    const UserId = ctx.userId;
    const { title, note_type, head_img, note_content, nickname } = ctx.request.body;
    // if (!title || !note_type || !note_content || !nickname) {
    //     ctx.body = {
    //         code: '8004',
    //         msg: '数据不能为空',
    //         data: error
    //     }
    //     return;
    // }
    try {
        const values = { title, note_type, head_img, note_content, nickname, UserId };
        const publishMsg = await notePublish(values);
        if (publishMsg.affectedRows) {
            ctx.body = {
                code: '8000',
                msg: '发布成功',
                data: 'success'
            }
        } else {
            ctx.body = {
                code: '8004',
                msg: '发布失败',
                data: 'error'
            }
        }
    } catch (error) {
        ctx.body = {
            code: '8005',
            msg: '服务器异常',
            data: error
        }
    }

    // if (!title || !note_type || !note_content || !nickname) {
    //     ctx.body = {
    //         code: '8004',
    //         msg: '数据不能为空',
    //         data: error
    //     }
    //     return console.log('/////////');;
    // }
    // try {
    //     const publishMsg = await notePublish(title, note_type, head_img, note_content, nickname, ctx.userId);
    //     console.log(publishMsg, '///');
    //     if (publishMsg.affectedRows) {
    //         ctx.body = {
    //             code: '8000',
    //             msg: '发布成功',
    //             data: 'success'
    //         }
    //     } else {
    //         ctx.body = {
    //             code: '8004',
    //             msg: '发布失败',
    //             data: 'error'
    //         }
    //     }

    // } catch (error) {
    //     ctx.body = {
    //         code: '8005',
    //         msg: '服务器异常',
    //         data: error
    //     }
    // }

})

module.exports = router;