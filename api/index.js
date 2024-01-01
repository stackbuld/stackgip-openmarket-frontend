const server = require("../dist/stackbuld-ecommerce/server/main");
try {
  console.log("initialize server app");
  module.exports = server.app();
}catch (error){
  console.error(error)
}

