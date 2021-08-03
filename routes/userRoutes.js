const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
passport = require('passport');
const { google, facebook } = require('../passport');

const router = express.Router();

//google auth routes
router.get('/auth/google', google.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/auth/google/callback', google.authenticate(
  'google',
  { failureRedirect: 'http://localhost:3000/api/users/login' }
),
(req, res) => {
  res.sendFile(__dirname + "/index.html")
});

router.get("/auth/google/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

// facebook auth routes
router.get('/auth/facebook', facebook.authenticate('facebook'));
router.get('/auth/facebook/callback', facebook.authenticate(
  'facebook',
  { failureRedirect: 'http://localhost:3000/api/users/login' }
),
(req, res) => {
    // Successful authentication, redirect home.
    res.sendFile(__dirname + "/index.html");
});

router.get("/auth/facebook/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

// all Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// Admin Specific
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
