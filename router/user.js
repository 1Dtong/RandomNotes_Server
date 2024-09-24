const router = require('koa-router')();
const { userLogin, userRegister, userFind } = require('../controllers/index.js');
const jwt = require('../utils/jwt.js');


router.prefix('/user'); // 路由前缀

// 登录
router.post('/login', async (ctx) => {
    // 获取到前端传递的账号密码，去数据库中检验
    const { username, password } = ctx.request.body;
    try {
        // 去数据库中检验
        const result = await userLogin(username, password)
        // console.log(result);
        if (result.length) {
            let data = {
                id: result[0].id,
                nickname: result[0].nickname,
                username: result[0].username,
            }
            // 生成token
            let token = jwt.sign({
                id: result[0].id,
                username: result[0].username,
                admin: true
            });
            // console.log(token);
            ctx.body = {
                code: '8000',
                msg: '登录成功',
                data: data,
                token: token
            }
        }
        else {
            ctx.body = {
                code: '8001',
                msg: '账号或密码错误',
                data: 'error',
            }
        }
    } catch (error) {
        ctx.body = {
            code: '8002',
            msg: '服务器异常',
            data: error,
        }
    }
})

// 注册
router.post('/register', async (ctx) => {
    // 获取到前端传递的账号密码和昵称
    const { username, password, nickname } = ctx.request.body;
    let msg = '';
    // 验证输入是否为空
    if (!username || !password || !nickname) {
        ctx.body = {
            code: '8001',
            msg: '账号密码或昵称不能为空',
        }
        return
    }
    // 检验账号是否存在
    try {
        // 检验账号是否存在
        const findRes = await userFind(username);
        console.log(findRes);

        if (findRes.length) {
            ctx.body = {
                code: '8001',
                msg: '账号已存在',
                data: 'error',
            }
            return
        }
        // 往数据库中写入数据
        const registerRes = await userRegister(username, password, nickname)
        if (registerRes.affectedRows) {
            ctx.body = {
                code: '8000',
                msg: '注册成功',
                data: 'success'

            }
        } else {
            ctx.body = { // 逻辑错误
                code: '8004',
                msg: '注册失败',
                data: 'error',
            }
        }
    } catch (error) {
        ctx.body = {
            code: '8005',
            msg: '服务器异常',
            data: 'error',
        }
    }

})

// 测试token
router.post('/home', jwt.verify(), (ctx) => {
    ctx.body = {
        code: '8000',
        data: '首页数据'
    }
})

module.exports = router;