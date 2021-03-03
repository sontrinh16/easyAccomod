const Pusher = require("pusher");

const pusher = new Pusher({
  appId: '1165166',
  key: '7d2ff12889bbde94065e',
  secret: 'bacf1c8fa38abbd34e16',
  cluster: 'ap3',
  port: 443,
  useTLS: true
});

module.exports = pusher;