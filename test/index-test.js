var vows = require("vows");
var assert = require("assert");
var util = require("util");
var adfs = require("../");

vows
  .describe("passport-adfs")
  .addBatch({
    module: {
      "should export AD FS strategy": function (x) {
        assert.isFunction(adfs);
      },
      "should make AD FS strategy available at .Strategy": function (x) {
        assert.isFunction(adfs.Strategy);
      },
    },
  })
  .export(module);
