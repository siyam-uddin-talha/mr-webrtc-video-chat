/*
author:'Arnob Islam'
created date:'01-01-2021'
description:'this file will provide the user functions'
*/

const USER = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

// registratin function
const REGISTER_NEW_USER = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const IsTheUserExist = await USER.findOne({ email });
    if (IsTheUserExist) {
      res.json({ success: false, message: `user exist! try to login` });
    }
    if (!IsTheUserExist) {
      const response = await USER.create({
        firstName,
        lastName,
        email,
        password,
      });
      const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
      });
      res
        .status(201)
        .json({ message: `Register success!`, success: true, response });
    }
  } catch (error) {
    res.json({ message: `${error.message}`, success: false });
  }
};

// registratin function
const ONCLICK_REGISTER = async (req, res) => {
  try {
    const fkmail = new FakeMail();
    const email = fkmail.email();
    const firstName = fkmail.firstName;
    const lastName = fkmail.lastName;
    const password = generatePassword();
    const response = await USER.create({
      email,
      firstName,
      lastName,
      password,
    });
    if (!response) {
      res.json({ success: false, message: `Unable to procced. Try again.` });
    }
    const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 604800000),
      httpOnly: true,
    });
    const { password: uPass, ...others } = response;
    res.status(201).json({
      message: `One Tap register success. Password: ${password}`,
      success: true,
      response: others,
    });
  } catch (error) {
    res.json({ message: `${error.message}`, success: false });
  }
};

// login function
const LOGIN = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({ message: "please fill the input", success: false });
    }

    const response = await USER.findOne({ email: email });

    if (!response) {
      return res.json({
        message: "User is not registered. Create a new account.",
        success: false,
      });
    }
    const byres = await bcryptjs.compare(password, response.password);

    if (!byres) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid password", response });
    }

    const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 604800000),
      httpOnly: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "login success", response });
  } catch (error) {
    res.json({ message: `${error.message}`, success: false });
  }
};

// log out fuction
const LOG_OUT = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "logout success" });
  } catch (error) {
    res.json({ message: `${error.message}`, success: false });
  }
};

module.exports = { REGISTER_NEW_USER, LOGIN, LOG_OUT, ONCLICK_REGISTER };

class FakeMail {
  adjectives = [
    "silly",
    "wacky",
    "zany",
    "goofy",
    "quirky",
    "loopy",
    "bonkers",
    "kooky",
    "nutty",
    "daffy",
    "whimsical",
    "bizarre",
    "peculiar",
    "absurd",
    "ludicrous",
    "hilarious",
    "comical",
    "dorky",
    "giddy",
    "madcap",
    "eccentric",
    "jolly",
    "wacko",
    "oddball",
    "batty",
    "zapped",
    "loony",
    "dizzy",
    "dopey",
    "gaga",
  ];
  nouns = [
    "banana",
    "unicorn",
    "pickle",
    "noodle",
    "penguin",
    "moustache",
    "socks",
    "teapot",
    "flamingo",
    "raccoon",
    "spatula",
    "kazoo",
    "hamburger",
    "toaster",
    "llama",
    "coconut",
    "waffle",
    "platypus",
    "cupcake",
    "sombrero",
    "accordion",
    "pineapple",
    "bubbles",
    "gizmo",
    "noodle",
    "pancake",
    "squirrel",
    "turnip",
    "marshmallow",
    "doodle",
  ];
  domains = [
    "laughmail.com",
    "giggles.net",
    "sillyweb.org",
    "funkymail.io",
    "chucklebox.com",
    "goofypost.com",
    "wackyweb.net",
    "zanyzone.org",
    "quirkycorner.io",
    "nuttynook.com",
    "bizarromail.net",
    "kookycomms.org",
    "sillysender.com",
    "madcapmail.io",
    "laughalot.net",
    "wackyworldweb.com",
    "gigglegram.org",
    "funnybonemail.net",
    "chucklenetwork.io",
    "zanypants.com",
    "hohohomail.org",
    "teeheetech.net",
    "jokerpost.com",
    "hilarioushost.io",
  ];

  firstName = "";
  lastName = "";

  email() {
    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const adjective = getRandomElement(this.adjectives);
    const noun = getRandomElement(this.nouns);
    const domain = getRandomElement(this.domains);

    this.firstName = adjective;
    this.lastName = noun;

    const randomNumber = Math.floor(Math.random() * 1000); // Increased to 3 digits

    return `${this.firstName}${this.lastName}${randomNumber}@${domain}`;
  }
  get firstName() {
    return this.firstName;
  }
  get lastName() {
    return this.lastName;
  }
}

const generatePassword = () => {
  var pwdChars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var pwdLen = 10;
  return new Array(pwdLen)
    .fill(0)
    .map((x) =>
      (function (chars) {
        let umax = Math.pow(2, 32),
          r = new Uint32Array(1),
          max = umax - (umax % chars.length);
        do {
          crypto.getRandomValues(r);
        } while (r[0] > max);
        return chars[r[0] % chars.length];
      })(pwdChars)
    )
    .join("");
};
