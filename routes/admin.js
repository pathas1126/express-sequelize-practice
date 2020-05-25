const express = require("express");
const router = express.Router();

function customMiddleware(req, res, next) {
  console.log("첫 번째 미들웨어");
  next();
}

function secondMiddleware(req, res, next) {
  console.log("두 번째 미들웨어");
  next();
}

router.get("/", customMiddleware, secondMiddleware, (req, res) => {
  res.send("admin 이후 url");
});

router.get("/products", (req, res) => {
  res.render("admin/products.nunjucks", {
    online: "<h1>express</h1>",
    message: "<p>Hello Nunjucks!!!</p>",
  });
});

router.get("/products/write", (req, res) => {
  res.render("admin/write.nunjucks");
});

router.post("/products/write", (req, res) => {
  console.log(req.body);
  res.send("전송되었습니다.");
});

module.exports = router;
