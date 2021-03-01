const router = require('express').Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('./utils/jwt-generator')
const validateInfo = require('./middleware/validateInfo')
const authorization = require('./middleware/authorization')

router.post("/register", validateInfo, async (req,res) => {
    try{
        console.log('\n\n* JWTAuth.js')
        // 1. destructure the req.body
        const {name, email, password} = req.body

        // 2. check if user exist (if user exist then throw error)
        const user = await db.query("SELECT * FROM users WHERE user_email = $1", [email])
        if(user.rows.length !==0) {
            console.log(user.rows)
            return res.status(401).send('user already exist')
        }
        // 3. Bcrypt the user password
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt)

        // 4. add or insert the user inside database
        const newUser = await db.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) returning *",
            [name, email, bcryptPassword]
        )

        // 5. generating out jwt token then send to client
        const token = jwtGenerator(newUser.rows[0].use_id)
        res.json({token})

    }catch(err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
})

router.post('/login', validateInfo, async (req,res) => {
    // 1. destruct the req.body
    const {user_email, user_password} = req.body
    // 2. check if user doens't exist (if not throw error)
    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [user_email])
    // 3. check if incoming password is the same the database password
    if(user.rows.length === 0) {
        return res.status(401).send("Could not find this account")
    }
    // 4. give JWT token
    const validPassword = await bcrypt.compare(user_password, user.rows[0].user_password)
    if(validPassword) {
        const token = jwtGenerator(user.rows[0].user_id)
        return res.status(200).json({token})
    } else {
        return res.status(401).send('Password or email is incorrect')
    }
})

router.get('/verify', authorization, (req,res) => {
    try{
        res.json(true)
    } catch(err) {
        console.log(err)
    }
})

module.exports = router