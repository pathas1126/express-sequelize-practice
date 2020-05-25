const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Contacts 페이지");
});

router.get("/list", (req, res) => {
  res.send("Contacts List 페이지");
});

module.exports = router;
