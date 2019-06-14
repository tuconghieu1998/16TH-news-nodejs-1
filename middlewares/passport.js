var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var user_model = require('../models/user.model');
var bcrypt = require('bcrypt');


module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    var ls = new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            user_model.singleByEmail(email)
                .then(rows => {
                    // hieudeptrai@gmail.com
                    if (rows.length === 0) {
                        return done(null, false, { message: 'Tài khoản không tồn tại!' });
                    }

                    var user = rows[0];

                    console.log(password);
                    console.log(user.password);

                    // console.log(bcrypt.hashSync(password, 10));
                    
                    var ret = bcrypt.compareSync(password, user.password);

                    if (ret)
                        return done(null, user);

                    return done(null, false, { message: 'Tài khoản hoặc mật khẩu bị sai.' })
                })
                .catch(err => {
                    return done(err, false);
                })
        }
    );

    passport.use(ls);

    passport.serializeUser((user, done) => {
        return done(null, user);
    });
    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}
