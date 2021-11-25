const {
  registerUser,
  verifyUser,
  loginUser,
  logOutUser,
  getNewAccessToken,
} = require("../controllers/auth.controller");
const { verifyRegister } = require("../middlewares");

const router = require("express").Router();

router.post("/register", verifyRegister, registerUser);
router.get("/verify/:verificationToken", verifyUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/refreshtoken", getNewAccessToken);
module.exports = router;
