const Pusher = require("pusher");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '..', 'config.env')})

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  port: 443,
  useTLS: true
});

module.exports = pusher;