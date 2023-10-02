const pusher = require("../utils/pusher");
const User = require("../models/user");

exports.triggerEvents = async (req, res, next) => {
  try {
    const { eventName, bodyData } = req.body;
    if (eventName && bodyData) {
      console.log(eventName, "RIDE RECEIVED");
      pusher
        .trigger("presence-ride", eventName, bodyData)
        .then((response) => {
          return res.json(response);
        })
        .catch((err) => {
          console.log(err, "ERROR in POST EVENT REQUEST");
          return res.json(err);
        });
    } else {
      return res.json("No data was sent");
    }
  } catch (error) {
    next(error);
  }
};
exports.authenticateUser = async (req, res, next) => {
  try {
    const socketId = req.body.socket_id;
    const presenceData = {
      id: req.body.user_id,
      user_info: {
        name: "Ali",
      },
    };

    const authenticateUser = pusher.authenticateUser(socketId, presenceData);
    console.log(authenticateUser, "Authenticated");
    res.send(authenticateUser);
  } catch (error) {
    console.error("Pusher authentication error:", error);
    res.status(403).send("Authentication failed");
  }
};
exports.authorizeChannel = async (req, res, next) => {
  try {
    const socketId = req.body.socket_id;
    const channelName = req.body.channel_name;
    const user_id = req.body.user_id;
    const user_info = await User.findById(user_id);

    if (user_id && user_info) {
      const presenceData = {
        user_id,
        user_info,
      };

      const authorizedChannel = pusher.authorizeChannel(
        socketId,
        channelName,
        presenceData
      );
      console.log(authorizedChannel, "Authorized");
      res.send(authorizedChannel);
    }
  } catch (error) {
    console.error("Pusher authentication error:", error);
    res.status(403).send("Authorization failed");
  }
};

exports.terminateUserConnection = async (req, res) => {
  const { id } = req.params;

  try {
    const terminateUser = await pusher.terminateUserConnections(id);
    res.send(terminateUser);
  } catch (err) {
    res.status(500).send(err);
  }
};
