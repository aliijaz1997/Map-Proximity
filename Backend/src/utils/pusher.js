const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1668643",
  key: "4680ecbf129cdd4c9d4a",
  secret: "aef7aa404afc2bede9df",
  cluster: "ap2",
  useTLS: true,
});

module.exports = pusher;
