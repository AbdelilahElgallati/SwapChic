const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const url = process.env.DATABASE_URL;
const bodyParser = require("body-parser");
const app = express();
const myPort = process.env.PORT;
const Port = 3001;

const CategoryRouter = require("./routes/categoryRouter");
const MessageRouter = require("./routes/messageRouter");
const NotificationRouter = require("./routes/notificationRouter");
const ProductRouter = require("./routes/productRouter");
const RevieweRouter = require("./routes/reviewRouter");
const TransactionRouter = require("./routes/transactionRouter");
const UserRouter = require("./routes/userRouter");

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/category", CategoryRouter);
app.use("/message", MessageRouter);
app.use("/notification", NotificationRouter);
app.use("/product", ProductRouter);
app.use("/review", RevieweRouter);
app.use("/transaction", TransactionRouter);
app.use("/user", UserRouter);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connecting to my database in port : " + Port);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(myPort || Port, () => {
  console.log("the platform is running well");
});
