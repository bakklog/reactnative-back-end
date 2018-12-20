const express = require("express");
const router = express.Router(); // Initialize a server

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const isAuthenticated = require("../middleware/isAuthenticated");
const uploadPictures = require("../middlewares/uploadPictures");

const User = require("../models/User.js");
const Thread = require("../models/Thread.js");

router.post("/sign_up", function(req, res, next) {
    const newUser = new User(req.body);
    const password = req.body.password;
    const token = uid2(16);
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    // Account creation: 5 required fields + token/salt/hash
    newUser.lastName = req.body.lastName;
    newUser.firstName = req.body.firstName;
    newUser.email = req.body.email;
    newUser.token = token;
    newUser.hash = hash;
    newUser.salt = salt;

    if (!req.body.password) {
        return res.status(400).json({ error: "password is missing" });
    } else {
        newUser.save(function(err, createdUser) {
            if (err) {
                return next({ error: err.message });
            } else {
                return res.json(createdUser);
            }
        });
    }
});

router.post("/log_in", function(req, res) {
    User.findOne({ email: req.body.email }).exec(function(err, myAccount) {
        if (err) {
            return res.status(400).json({ error: err.message });
        } else if (myAccount === null) {
            // Verification of the existence of the provided email
            return res.status(400).json({ error: "email doesn't exist" });
        } else {
            const userInfo = { account: {} };
            const password = req.body.password;
            const salt = myAccount.salt;
            const reqHash = SHA256(password + salt).toString(encBase64); // Salting and encrypting the provided password
            if (reqHash === myAccount.hash) {
                // Comparison password (encrypted) entry with stored password (encrypted)
                userInfo._id = myAccount._id;
                userInfo.token = myAccount.token;
                userInfo.account.username = myAccount.account.username;
                return res.status(200).json(userInfo);
            } else {
                return res.status(400).json({ error: "Username or password is incorrect." });
            }
        }
    });
});

router.post("/update", isAuthenticated, uploadPictures, function(req, res, next) {
    User.findOne({ token: req.user.token }).exec(function(err, user) {
        console.log(req.user.token);
        if (user) {
            user.email = req.body.email;
            user.account.phone = req.body.phone;
            user.account.photos = req.pictures || user.account.photos;

            user.save(function(err, savedUser) {
                console.log(err, savedUser);
                res.status(200).json(savedUser);
            });
        }
    });
});