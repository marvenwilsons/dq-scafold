const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
    try {
        // get token from header --> authorization object from client
        const jwtToken = req.get('authorization')

        if(!jwtToken) {
            return res.status(403).json("Could Not Find Token")
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)
        console.log('******** payload \n\n',payload)
        req.user = payload.user // returns the uuid of the user, uuid from database
        next()
    } catch(err) {
        console.log(err)
        return res.status(403).json("Not Authorize")
    }
}