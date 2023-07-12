'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./ioc-boilerplate-generator.cjs.prod.js");
} else {
  module.exports = require("./ioc-boilerplate-generator.cjs.dev.js");
}
