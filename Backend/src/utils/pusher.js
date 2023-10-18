const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.AppId,
  key: process.env.Key,
  secret: process.env.Secret,
  cluster: "ap2",
  useTLS: true,
});

module.exports = pusher;
