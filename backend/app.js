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
const socketIo = require("socket.io");
const Port = 3001;
const Message = require("./models/messageModel");

const CategoryRouter = require("./routes/categoryRouter");
const MessageRouter = require("./routes/messageRouter");
const NotificationRouter = require("./routes/notificationRouter");
const ProductRouter = require("./routes/productRouter");
const LikeRouter = require("./routes/likeRouter");
const TransactionRouter = require("./routes/transactionRouter");
const UserRouter = require("./routes/userRouter");

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connecting to my database in port : " + Port);
  })
  .catch((err) => {
    console.log(err);
  });

const userConnections = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("registerUser", (userId) => {
    userConnections.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on("sendMessage", async (messageData) => {
    try {
      const { senderId, receiverId, text, productId } = messageData;
      const roomId = `chat_${productId}_${[senderId, receiverId]
        .sort()
        .join("_")}`;

      const newMessage = new Message({
        senderId,
        receiverId,
        productId,
        text: text,
        status: "pending",
      });

      await newMessage.save();

      io.to(roomId).emit("newMessage", {
        _id: newMessage._id,
        senderId,
        receiverId,
        text: newMessage.text,
        productId,
        createdAt: newMessage.createdAt,
      });

      if (userConnections.has(receiverId)) {
        await Message.findByIdAndUpdate(newMessage._id, {
          status: "delivered",
        });
        io.to(roomId).emit("messageDelivered", newMessage._id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userConnections.entries()) {
      if (socketId === socket.id) {
        userConnections.delete(userId);
        break;
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/category", CategoryRouter);
app.use("/message", MessageRouter);
app.use("/notification", NotificationRouter);
app.use("/product", ProductRouter);
app.use("/like", LikeRouter);
app.use("/transaction", TransactionRouter);
app.use("/user", UserRouter);

server.listen(Port, () => {
  console.log(`Server is running on ${Port}`);
});
