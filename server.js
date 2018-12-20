require("dotenv").config();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true
    },
    function(err) {
        if (err) console.error("Could not connect to MongoDB.");
    }
);
const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const app = express();

const helmet = require("helmet");
app.use(helmet());

const compression = require("compression");
app.use(compression());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));

// Initialization of modules

// TODO: Add modules
const User = require("./models/User");
const Thread = require("./models/Thread");
const Message = require("./models/Message");

app.get("/", function(req, res) {
    res.send("Welcome to the React Native API.");
});

const cors = require("cors");
app.use("/api", cors());

// TODO: Add routes
const coreRoutes = require("./routes/core.js");
const userRoutes = require("./routes/user.js");
const tchatRoutes = require("./routes/tchat.js");

app.use("/api", coreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tchat", tchatRoutes);

// tchat routes with WS
// TODO: add tchat routes using WS

// All HTTP methods (GET, POST, etc.) for pages that can't be found to display a 404 error
app.all("*", function(req, res) {
    res.status(404).json({ error: "Not Found" });
});

appuse(function(err, req, res, next) {
    if (res.statusCode === 200) res.status(400);
    console.error(err);

    // if (process.env.NODE_ENV === "production") err = "An error has occurred.";
    res.json({ error: err });
});

server.listen(process.env.PORT, function() {
    console.log(`React Native API is running on port ${process.env.PORT}`);
});