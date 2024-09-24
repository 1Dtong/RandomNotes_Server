// 引入Koa库，Koa是一个基于Node.js的Web框架
const Koa = require('koa')

// 创建一个Koa应用实例
const app = new Koa()

// 引入cors中间件，用于处理跨域请求
const cors = require('@koa/cors')

// 引入koa-bodyparser中间件，用于处理请求体
const { bodyParser } = require('@koa/bodyparser')

const userRouter = require('./router/user.js')
const noteRouter = require('./router/note.js')

// const main = (ctx) => {
//     if (ctx.url === '/user/login'){
//     }
// }

// app.use(main)

app.use(cors()); // 允许跨域 告诉浏览器不要破坏我的响应
app.use(bodyParser()); // 辅助koa解析post传递的参数

app.use(userRouter.routes(), userRouter.allowedMethods());
app.use(noteRouter.routes(), noteRouter.allowedMethods());

app.listen(3000, () => {
    console.log('server is running at port 3000')
})