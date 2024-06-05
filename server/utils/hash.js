const bcrypt = require("bcryptjs")

const encryptPassword = async (rawPassword) => {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
}

const comparePassword = async (hashedPassword, rawPassword) => {
    const validation = await bcrypt.compare(rawPassword, hashedPassword)
    return validation
}

module.exports = { encryptPassword, comparePassword };

