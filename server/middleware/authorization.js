const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header('token')
        if(!jwtToken) {
            return res.status(403).json("Could Not Find Token")
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)
        console.log('payload \n\n',payload)
        req.user = payload.user // returns the uuid of the user, uuid from database
        next()
    } catch(err) {
        return res.status(403).json("Not Authorize")
    }
}