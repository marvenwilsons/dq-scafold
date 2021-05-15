const jwtGenerator = require('../../utils/jwt-generator')
const jwt = require('jsonwebtoken')
const adminMethods = require('../../admin-methods')

const verifyToken = (token) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if(payload.user === user.id) {
        return true
    }
}


module.exports = function(socket) {
    socket.on('login', ({username, password}) => {
        // compare username and password
        if(username == user.username && password == user.password) {
            console.log('login success', process.env.JWT_SECRET)
            const token = jwtGenerator(user.id,process.env.JWT_SECRET)
            socket.emit('login_response', {token})

        } else {
            socket.emit('login_response', {err: true})
        }
    })

    // verifying token every api call
    socket.on('verify_token', (token) => {
        console.log('verifying token')
        console.log(token)
        
        try {
            if(verifyToken(token)) {
                socket.emit('verify_token_response', 'authorized')
            }
        } catch(err) {
            console.log('Unauthorized')
            socket.emit('verify_token_response', 'unauthorized')
        }

    })

    socket.on('request', ({token,request_name, request_payload}) => {
        if(verifyToken(token)) {
            adminMethods[request_name](socket,request_payload)
        }
    })
}