const path = require("path");

var config = {
  module: {},
};

var index = Object.assign({}, config, {
  name: "index",
  entry: "./build/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "index.js",
  },
});

var login = Object.assign({}, config, {
  name: "login",
  entry: "./build/login.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "login.js",
  },
});

var desk = Object.assign({}, config, {
  name: "desk",
  entry: "./build/desk.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "desk.js",
  },
});

module.exports = [index, login, desk];
