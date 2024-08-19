var vows = require("vows");
var assert = require("assert");
var util = require("util");
var AdfsStrategy = require("../");

vows
  .describe("AdfsStrategy")
  .addBatch({
    strategy: {
      topic: function () {
        return new AdfsStrategy(
          {
            clientID: "ABC123",
            clientSecret: "secret",
            adfsURL: "https://adfs.example.com/adfs",
            resource: "https://example.com",
          },
          function () {}
        );
      },

      "should be named adfs": function (strategy) {
        assert.equal(strategy.name, "adfs");
      },
    },
  })
  .export(module);
