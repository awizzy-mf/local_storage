const { User } = require("../db/models");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const passport = require("../utils/passport")

module.exports = {
  registerPage: (req, res) => {
    return res.render("auth/register", {
      errors: { name: "", email: "", password: "" },
    });
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const error = { errors: {} };
      if (!name) {
        error.errors.name = "name is required";
      }
      if (!email) {
        error.errors.email = "email is required";
      }
      if (!password) {
        error.errors.password = "password is required";
      }
      if (!name || !email || !password) {
        return res.render("auth/register", error);
      }

      const exist = await User.findOne({ where: { email } });
      if (exist) {
        error.errors.email = "email is already used!";
        return res.render("auth/register", error);
      }

      const hashPassword = await bcryp.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashPassword,
      });

      return res.redirect("/home");
    } catch (error) {
      throw error;
    }
  },
  loginPage: (req, res) => {
    return res.render("auth/login", { errors: { email: "", password: "" } });
  },

  login: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }),
  // login: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;

  //     const error = { errors: {} };

  //     if (!email) {
  //       error.errors.email = "email is required";
  //     }
  //     if (!password) {
  //       error.errors.password = "password is required";
  //     }
  //     if (!email || !password) {
  //       return res.render("auth/login", error);
  //     }

  //     const user = await User.findOne({ where: { email } });
  //     if (!user) {
  //       error.errors.email = "email is not register!";
  //       return res.render("auth/login", error);
  //     }

  //     const passwordCorrect = await bcryp.compare(password, user.password);
  //     if (!passwordCorrect) {
  //       error.errors.password = "password is not valid!";
  //       return res.render("auth/login", error);
  //     }

  //     return res.redirect("/home");
  //     // const payload = {
  //     //   id: user.id,
  //     //   name: user.name,
  //     //   email: user.email,
  //     // };

  //     // const token = await jwt.sign(payload, JWT_SECRET_KEY);
  //     // return res.status(200).json({
  //     //   status: true,
  //     //   message: "login success!",
  //     //   data: {
  //     //     token: token,
  //     //   },
  //     // });
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  whoami: async (req, res) => {
    try {
      return res.status(200).json({
        status: true,
        message: "fetch user success!",
        data: req.user,
      });
    } catch (error) {
      throw error;
    }
  },
};
