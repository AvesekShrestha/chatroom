const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const checkValidation = async (req, res, next) => {
  const authentation = req.headers["authorization"];
  if (!authentation) return res.redirect("/login");
  const token = authentation.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.SECRETE_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = checkValidation;
