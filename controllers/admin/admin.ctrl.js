exports.get_products = (_, res) => {
  res.render(
    "admin/products.nunjucks",
    { message: "hello" } // message 란 변수를 템플릿으로 내보낸다.
  );
};

exports.get_products_write = (_, res) => {
  res.render("admin/write.nunjucks");
};

exports.post_products_write = (req, res) => {
  res.send(req.body);
};
