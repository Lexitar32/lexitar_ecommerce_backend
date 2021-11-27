const { hash, compare } = require("bcrypt");
const { sendVerificationMail } = require("../config/nodemailer");
const {
  createEmailVerificationToken,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../config/tokens");
const { verify } = require("jsonwebtoken");
const db = require("../models");
const users = db.users;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.user;
    const hashedPassword = await hash(password, 10);
    const user = await users.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    if (!user) {
      throw new Error("Something went wrong");
    }
    const emailVerificationToken = await createEmailVerificationToken(user);
    const mailResponse = await sendVerificationMail(
      user,
      emailVerificationToken
    );
      res.status(201).send({
        message: "User Created, check your mail to verify account",
      });
  } catch (err) {
    res.status(400).send({
      message: err.message || "Email Taken By Another User",
    });
  }
};

exports.verifyUser = async (req, res) => {
  const verificationToken = req.params.verificationToken;

  if (!verificationToken) {
    res.status(403).send({
      message: "Bad Request",
    });
    return;
  }

  try {
    const payload = verify(
      verificationToken,
      process.env.EMAIL_VERIFICATION_TOKEN_SECRET
    );

    const user = await users.findOne({ where: { id: payload.id } });

    if (!user) {
      throw new Error("This User Does Not Exist");
    }

    const response = await users.update(
      { status: "Active" },
      { where: { id: payload.id } }
    );

    if (response.length === 1) {
      res.redirect(200, "http://localhost:3000/login");
    }
  } catch (err) {
    res.status(403).send({
      message: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(403).send({
      message: "Invalid Request",
    });
    return;
  }
  try {
    const user = await users.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid Email/Password");
    }

    const isPassword = await compare(password, user.password);
    if (!isPassword) throw new Error("Invalid Email/Password");

    if (user.status === "Pending")
      throw new Error("Verify Account Before Login");

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const response = await users.update(
      { token: refreshToken },
      { where: { id: user.id } }
    );

    if (response.length === 1) {
      sendRefreshToken(refreshToken, res);
      sendAccessToken(accessToken, res);
    }
  } catch (err) {
    res.status(403).send({
      message: err.message,
    });
  }
};

exports.getNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;

  try {
    if (!refreshToken) throw new Error();

    const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await users.findOne({ where: { id: payload.id } });
    if (!user) throw new Error();

    if (user.token !== refreshToken) throw new Error();
    const accessToken = createAccessToken(user);
    sendAccessToken(accessToken, res);
  } catch (err) {
    sendAccessToken("", res);
  }
};

exports.logOutUser = (req, res) => {
  res.clearCookie("refreshtoken", {
    path: "/api/auth/refreshtoken",
  });
  res.status(200).send({
    message: "User Cookie cleared, proceed to log user out",
  });
};

exports.forgotPassword = async (req, res) => {

  const email = req.body.email;
  try {

    if(!email) throw new Error('Invalid Request');

    const user = await db.users.findOne({ where: { email } });

    if(!user) throw new Error('This email does not exist');

     const token = createEmailVerificationToken(user);
      



  }
  catch(err){
     res.status(404).send({
       message: err.message
     })
  }


}