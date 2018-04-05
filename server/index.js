require('./models');

const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const mongoose = require('mongoose');

const config = require('./config');
const router = require('./routes');
const io = require('socket.io');

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
//app.listen(3001);
mongoose.connect(config.db, {
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
}).then(() => {
  console.log("Database connected, listening on port 8000");
  app.listen(8000);
  
  //const port = 3001;
  io.listen(app);
});
