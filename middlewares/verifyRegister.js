const { isEmail, isStrongPassword, trim } = require("validator");

const verifyRegister = (req, res, next) => {
  let { name, password, phoneNumber, email } = req.body;

  if (!name || !password || !phoneNumber || !email) {
    res.status(403).send({
      message: "Fields Cannot Be Empty",
    });
    return;
  }

  name = trim(name);
  password = trim(password);
  phoneNumber = trim(phoneNumber);
  email = trim(email);

  if (!isEmail(email)) {
    res.status(403).send({
      message: "Email Not Valid",
    });
    return;
  }

  if (!isStrongPassword(password)) {
    res.status(403).send({
      message:
        "Password must be atleast 8 chars and minimum of one lowercase, uppercase, number and symbol",
    });
    return;
  }
  req.user = { name, email, password, phoneNumber };
  next();
};

module.exports = verifyRegister;
