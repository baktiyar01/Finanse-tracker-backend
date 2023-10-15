const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/auth.config");
const { verifyToken } = require("../JWT");
const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("inside signup");

  const { user, pwd, confirmPassword } = req.body;
  if (pwd !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  // Check if the user already exists
  User.findOne({ where: { user: user } })
    .then((existingUser) => {
      if (existingUser) {
        // User already exists
        return res.json({ Message: "This user already exists" });
      }
      // Hash the password
      bcrypt.hash(pwd, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error hashing password" });
        }
        // Create the new user
        User.create({
          user: user,
          pwd: hash,
        })
          .then(() => {
            res.json("User registered successfully");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error creating user" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error checking existing user" });
    });
});

// User login
router.post("/login", async (req, res) => {
  console.log("inside login");
  const { user, pwd } = req.body;

  const users = await User.findOne({ where: { user: user } });
  if (!users) res.status(400).json({ error: "User Doesnt exist" });
  // fix
  const dbPassword = users.pwd;
  bcrypt.compare(pwd, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const token = jwt.sign(
        { user: users.user, id: users.id },
        config.secret,
        {
          allowInsecureKeySizes: true,
          expiresIn: 24 * 60 * 60 * 1000, // 24h
        }
      );
      res.status(200).json({ message: "Authentication successful", token });
    }
  });
});

module.exports = router;
