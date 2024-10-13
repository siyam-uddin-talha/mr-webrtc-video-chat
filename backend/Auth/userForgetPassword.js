/*
author:'Arnob Islam'
created date:'01-01-2021'
description:''
*/

const USER = require("../Models/User");
const SendEmail = require("../controllers/SendEmail");

const userForgetPassword = async (req, res) => {
  try {
    const user = await USER.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: false, message: `wrong email` });
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: true });

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/user/reset-password/${resetToken}`;

    await SendEmail({
      email: user.email,
      subject: "password reset",
      message: `reset your password ${resetLink}`,
      html: ` <div  style="width: 20rem; text-align: center; margin: auto;padding: 2rem 1rem; font-family: sans-serif;" >
        <div>
            <h3> Password reset </h2>
            <br>
            <h3> Reset your password by clicking this link ${resetLink} </h2>
        </div>
    </div>`,
    });

    res
      .status(200)
      .json({ success: true, message: `Reset tokan is sent on ${user.email}` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = userForgetPassword;
