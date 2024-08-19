/**
 * Module dependencies.
 */
var util = require("util"),
  OAuth2Strategy = require("passport-oauth2"),
  jwt = require("jsonwebtoken"),
  jwksClient = require("jwks-rsa");

/**
 * `Strategy` constructor.
 *
 * The AD FS authentication strategy authenticates requests by delegating to
 * Microsoft AD FS using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Google application's client id
 *   - `clientSecret`  your Google application's client secret
 *   - `callbackURL`   URL to which Google will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new AdfsStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/google/callback',
 *         resource: "https://example.com",
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  if (!options.adfsURL) {
    throw new TypeError("AdfsStrategy requires a adfsURL option");
  }
  if (!options.resource) {
    throw new TypeError("AdfsStrategy requires a resource option");
  }
  options.authorizationURL =
    options.authorizationURL || options.adfsURL + "/adfs/oauth2/authorize";
  options.tokenURL = options.tokenURL || options.adfsURL + "/adfs/oauth2/token";
  options.logoutURL =
    options.logoutURL || options.adfsURL + "/adfs/oauth2/logout";
  options.jwksURL = options.adfsURL + "/adfs/discovery/keys";

  OAuth2Strategy.call(this, options, verify);
  this.name = "adfs";
  this._resource = options.resource;
  this._getKey = function (header, callback) {
    jwksClient({ jwksUri: options.jwksURL }).getSigningKey(
      header.kid,
      function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      }
    );
  };
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function (req, options) {
  options || (options = {});
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

Strategy.prototype.authorizationParams = function (options) {
  return { resource: this._resource };
};
/**
 *  AD FS does not support the `profile` propertly. So we extract user data from the access token
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  jwt.verify(accessToken, this._getKey, {}, function (err, decoded) {
    if (err) {
      return done(err);
    }
    done(null, decoded);
  });
};

/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;
