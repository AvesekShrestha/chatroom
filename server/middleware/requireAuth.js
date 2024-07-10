const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const checkValidation = async (req, res, next) => {
  const authentication = req.headers["authorization"];
  if (!authentication) return res.redirect("/login");

  const token = authentication.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.SECRETE_KEY);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
    return res.redirect("/login");
  }
};

module.exports = checkValidation;
