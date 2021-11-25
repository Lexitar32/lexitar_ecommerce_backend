require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const authRouter = require("./routes/auth.route");

// Instantiating Express app
const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/auth", authRouter);

db.sequelize
  .sync()
  .then(() => {
    console.log("Drop and Create tables");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(PORT, () => {
  console.log(`Listening On port ${PORT}`);
});