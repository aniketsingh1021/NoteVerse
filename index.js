require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const connectToDatabase = require("./db"); // Renamed to reflect the purpose
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const path = require('path')
// Connect to the database
console.log("Before connecting to the database...");
connectToDatabase()
  .then(() => {
    // Middlewares
    app.use(express.json());
    app.use(cors());

    // Routes
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);

    const port = process.env.PORT || 8080;

    // Use http server to listen for both Express and Socket.IO
    http.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
// static files

app.use(express.static(path.join(__dirname, './main/build')));

app.get("*",function (req, res){
  res.sendFile(path.join(__dirname, "./main/build/index.html"));
})
    // Socket.IO server logic
    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('message', (msg) => {
        console.log('Message received:', msg.user);
        socket.broadcast.emit('message', msg);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if connection fails
  });
