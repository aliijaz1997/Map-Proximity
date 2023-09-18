const pusher = require("../utils/pusher");

exports.triggerEvents = async (req, res, next) => {
  try {
    const { eventName, bodyData } = req.body;
    if (eventName && bodyData) {
      pusher.trigger("ride", eventName, bodyData);
      return res.json(req.body);
    } else {
      return res.json("No data was sent");
    }
  } catch (error) {
    next(error);
  }
};
