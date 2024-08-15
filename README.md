# passport-oauth2

AD FS authentication strategy for [Passport](https://www.passportjs.org/).

This module lets you authenticate using AD FS in your Node.js applications.

Note that this strategy provides generic AD FS support. Profile fields due to the lack of support on userinfo endpoint in ADFS are populated from token. If you need any field in profile you must configure coresponding claim for specific resource.

[![npm](https://img.shields.io/npm/v/passport-adfs.svg)](https://www.npmjs.com/package/passport-adfs)
[...](https://github.com/blib/passport-adfs/wiki/Status)

## Install

    $ npm install passport-adfs

## Usage

#### Configure Strategy

The AD FS authentication strategy authenticates users using a Microsoft AD FS server.
The provider's URL as well as
the client identifer and secret, are specified as options. The strategy
requires a `verify` callback, which receives an access token and profile,
and calls `cb` providing a user.

```js
passport.use(
  new AdfsStrategy(
    {
      adfsURL: "https://adfs.example.com",
      clientID: EXAMPLE_CLIENT_ID,
      clientSecret: EXAMPLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/example/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ exampleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'adfs'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get("/auth/example", passport.authenticate("adfs"));

app.get(
  "/auth/example/callback",
  passport.authenticate("adfs", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
```

## Contributing

#### Tests

The test suite is located in the `test/` directory. All new features are
expected to have corresponding test cases. Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage. Patches that
increse test coverage are happily accepted. Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
