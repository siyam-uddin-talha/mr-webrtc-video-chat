/*
author:'Arnob Islam'
created date:'01-01-2021'
description:''
*/

const USER = require("../Models/User");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const RESET_PASSWORD = async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  try {
    if (!password) {
      return res.status(406).json({ message: "please fill the input" });
    }
    const newPassword = await bcryptjs.hash(password, 12);

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await USER.findOneAndUpdate(
      { resetPasswordToken, resetPasswordTokenExpireDate: { $gt: Date.now() } },
      {
        password: newPassword,
        resetPasswordToken: "",
        resetPasswordTokenExpireDate: "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.json({
        success: false,
        message: `Invalid token or reset time is out`,
      });
    }

    return res
      .status(201)
      .json({ success: true, message: `Password reset successfully.` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = RESET_PASSWORD;
