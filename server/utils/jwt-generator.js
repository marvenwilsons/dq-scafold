const jwt = require('jsonwebtoken')

function jwtGenerator(user_id,JWT_SECRET) {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, JWT_SECRET, {expiresIn: "1hr"})
}

module.exports = jwtGenerator