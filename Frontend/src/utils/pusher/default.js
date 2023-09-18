import Pusher from "pusher-js";

export const PusherInstance = new Pusher(process.env.REACT_APP_PUSHER_API_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
});
