const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.SECRETE_KEY, { expiresIn: "7d" })
    return token
}

module.exports = generateToken;
