const router = require('express').Router()
const db = require('../../postgres/db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../../utils/jwt-generator')
const validateInfo = require('../../middleware/validateInfo')
const authorization = require('../../middleware/authorization')
const bodyParser = require('body-parser')
router.use(bodyParser.json({ extended: false }))
// const encryption = require('../../../encryption-b')

router.post("/register", async (req,res) => {
    try{
        console.log('\n\n* auth.js')
        // 1. destructure the req.body
        const {name, email, password, country, city, postalCode} = req.body

        // 2. check if user exist (if user exist then throw error)
        const user = await db.query("SELECT * FROM users WHERE user_email = $1", [email])
        if(user.rows.length !==0) {
            console.log('************* /register -- user already exist')
            return res.status(401).send('user already exist')
        }
        // 3. Bcrypt the user password
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt)

        // 4. add or insert the user inside database
        const newUser = await db.query(
            "INSERT INTO users (user_name, user_email, user_password, country, city, postal_code) VALUES ($1, $2, $3, $4, $5, $6) returning *",
            [name, email, bcryptPassword, country, city, postalCode]
        )

        // 5. generating out jwt token then send to client
        const token = jwtGenerator(newUser.rows[0].use_id,process.env.JWT_SECRET)
        res.json({token})

    }catch(err) {
        console.log('************* /register -- ')
        res.status(200).json({
            message: 'Server Error!'
        })
    }
})

router.post('/login', async (req,res) => {
    console.log('************* /login')
    try {
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
            const token = jwtGenerator(user.rows[0].user_id, process.env.JWT_SECRET)
            return res.status(200).json({ token })
        } else {
            console.log('************* /login -- invalid password')
            return res.status(401).send('Password or email is incorrect')
        }
    } catch(err) {
        console.log(err)
        res.status(401).send('Password or email is incorrect')
    }
})

router.get('/verify', authorization, (req,res) => {
    try{
        console.log('************* /verify')
        res.json({
            authorized: true
        })
    } catch(err) {
        console.log('************* /verify -- Error')
        console.log(err)
    }
})

module.exports = {
    path: '/auth',
    handler: router
}