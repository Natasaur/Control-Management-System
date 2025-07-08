const express = require("express");
const authController = require("../controllers/auth");

const api = express.Router();

api.post("/auth/login", authController.login);

module.exports = api;