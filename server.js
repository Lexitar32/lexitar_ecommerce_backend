require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
// Instantiating Express app
const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ["http://localhost:3000", "https://lexitargadgets.netlify.app"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/", express.static("static"));
app.set("view engine", "ejs");

db.sequelize
  .sync()
  .then(() => {
    console.log("Drop and Create tables");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/success", (req, res) => {
  res.render("confirmed");
});

app.listen(PORT, () => {
  console.log(`Listening On port ${PORT}`);
});
