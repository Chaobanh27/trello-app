/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { CONNECT_DB } from '~/config/mongodb'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1/index'
// import { StatusCodes } from 'http-status-codes'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'

// Xử lý socket real-time với gói socket.io
// https://socket.io/get-started/chat/#integrating-socketio
import http from 'http'
import socketIo from 'socket.io'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()

  // Fix cái vụ Cache from disk của ExpressJS
  // https://stackoverflow.com/a/53240717/8324172
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  /*
   Cấu hình Cookie Parser để xử lý và phân tích cú pháp các cookie trong yêu cầu HTTP
   Khi một yêu cầu HTTP được gửi từ trình duyệt đến máy chủ, cookie-parser giúp phân tích và trích xuất
   thông tin từ các cookie đi kèm trong yêu cầu. Nó sẽ tạo ra một đối tượng cookie chứa các thông tin được trích xuất từ các cookie
   và gắn nó vào đối tượng yêu cầu (request object) của ứng dụng Node.js
  */
  app.use(cookieParser())

  app.use(cors(corsOptions))
  //enable req.body json data
  app.use(express.json())

  //User APIs V1
  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo một cái server mới bọc thằng app của express để làm real-time với socket.io
  const server = http.createServer(app)
  // Khởi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    // Gọi các socket tùy theo tính năng ở đây.
    inviteUserToBoardSocket(socket)
    // ...vv
  })

  //Middleware xử lý lỗi tập trung
  // app.use((err, req, res, next) => {
  //   console.error(err.stack)
  //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something broke!')
  // })

  // Môi trường Production (cụ thể hiện tại là đang support Render.com)
  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`3. Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`)
    })
  } else {
    // Môi trường Local Dev
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local DEV: Hi ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`)
    })
  }
}

//chỉ khi kết nối DB thành công thì mới khởi chạy server back-end
(async() => {
  try {
    console.log('1. Connecting to MongoDB CLoud Atlas...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB Cloud Atlas')
    START_SERVER()
  }
  catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => {
//     console.log('Connected to MongoDB Cloud Atlas')
//   })
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })