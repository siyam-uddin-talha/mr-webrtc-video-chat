const jwt = require("jsonwebtoken");
const USER = require("../Models/User");

const CHECK_CREDENTIALS = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const response = await USER.findOne({ _id: verify.id });

    if (response) {
      req.token = token;
      req.user = response;
      res.json({ success: true, user: response });
      next();
    } else {
      res.json({ message: "User is not loged in.", success: false });
    }
  } catch (error) {
    if (error.message === "jwt must be provided") {
      res.json({ message: "User is not loged in.", success: false });
    } else {
      res.json({ message: "User is not loged in.", success: false });
    }
  }
};

module.exports = CHECK_CREDENTIALS;
