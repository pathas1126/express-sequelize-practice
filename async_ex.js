const models = require("./models");

const getProducts = async () => {
  const product1 = await models.Products.findAll({});
  console.log(product1[0].dataValues);
};

getProducts();
