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
const http = require("http");
const { Server } = require("socket.io");
const Port = 3001;

const CategoryRouter = require("./routes/categoryRouter");
const MessageRouter = require("./routes/messageRouter");
const NotificationRouter = require("./routes/notificationRouter");
const ProductRouter = require("./routes/productRouter");
const RevieweRouter = require("./routes/reviewRouter");
const TransactionRouter = require("./routes/transactionRouter");
const UserRouter = require("./routes/userRouter");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend's URL in production
    methods: ["GET", "POST"],
  },
});

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

// Socket.io for Real-Time Chat
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, content } = data;

    // Save message to DB
    const message = new Message({ senderId, receiverId, content });
    await message.save();

    // Emit message to the receiver
    io.emit(`message:${receiverId}`, message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.listen(Port, () => {
  console.log("the platform is running well");
});
