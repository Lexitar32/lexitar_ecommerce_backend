const { getUser, resetUserPassword} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares");

const router = require("express").Router();

router.get("/", verifyToken, getUser);
router.post("/resetpassword", verifyToken, resetUserPassword)

module.exports = router;
