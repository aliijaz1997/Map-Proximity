import Pusher from "pusher-js";

export const PusherInstance = ({ user_id }) => {
  return new Pusher(process.env.REACT_APP_PUSHER_API_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    userAuthentication: {
      endpoint: "http://localhost:4000/api/pusher/user-auth",
    },
    channelAuthorization: {
      endpoint: "http://localhost:4000/api/pusher/channel-auth",
      params: { user_id },
    },
    logToConsole: true,
  });
};
