const models = require("../../models");

exports.get_products = (_, res) => {
  // res.render(
  //   "admin/products.nunjucks",
  //   { message: "hello" } // message 란 변수를 템플릿으로 내보낸다.
  // );
  models.Products.findAll({})
    .then((products) => {
      res.render("admin/products.nunjucks", {
        products,
      });
    })
    .catch((error) => {
      throw error;
    });
};

exports.get_products_write = (_, res) => {
  res.render("admin/write.nunjucks");
};

exports.post_products_write = (req, res) => {
  const { name, price, description } = req.body;
  models.Products.create({
    name,
    price,
    description,
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      throw error;
    });
};

exports.get_products_detail = (req, res) => {
  const { id } = req.params;
  models.Products.findByPk(id).then((product) => {
    res.render("admin/detail.nunjucks", { product });
  });
};

exports.get_products_edit = (req, res) => {
  const { id } = req.params;
  models.Products.findByPk(id)
    .then((product) => {
      res.render("admin/write.nunjucks", { product });
    })
    .catch((error) => {
      throw error;
    });
};

exports.post_products_edit = (req, res) => {
  const { name, price, description } = req.body;
  const { id } = req.params;

  models.Products.update(
    {
      name,
      price,
      description,
    },
    {
      where: { id },
    }
  )
    .then(() => res.redirect(`/admin/products/detail/${id}`))
    .catch((error) => {
      throw err;
    });
};

exports.get_products_delete = (req, res) => {
  const { id } = req.params;
  models.Products.destroy({
    where: {
      id,
    },
  })
    .then(() => res.redirect(`/admin/products`))
    .catch((error) => {
      throw error;
    });
};
