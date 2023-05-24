const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { User } = require("../db/models");
const bcryp = require("bcrypt")

async function authenticate(email, password, done) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, { message: "email is not register!" });
    }
    const passwordCorrect = await bcryp.compare(password, user.password);
    if (!passwordCorrect) {
      error.errors.password = "password is not valid!";
      return done(null, false, { message: "password is not valid" });
    }
    return done(null, user);
  } catch (err) {
    return done(null, false, { message: err.message });
  }
}
passport.use(
  new localStrategy({ usernameField: "email", passportField: "password" })
);

//serialize => menyimpan sesi
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
//deserialize => membaca sesi
passport.deserializeUser(async (id, done) => {
  return done(null, await User.findOne({ where: { id } }));
});

module.exports = passport;
