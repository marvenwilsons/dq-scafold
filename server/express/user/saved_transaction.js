const router = require('express').Router()
const bodyParser = require('body-parser')
const authorization = require('../../middleware/authorization')
const db = require('../../postgres/db')
router.use(bodyParser.json({ extended: false }))

router.get('/transaction', authorization, async (req,res) => {
    console.log('* Fetching user account')

    const {user_email} = req.query

    const user_acc = await db.query('SELECT * FROM users WHERE user_email = $1',[user_email])
    const { user_name } = user_acc.rows[0]

    res.status(200).json({
        account: {
            user_name
        }
    })
})


module.exports = {
    handler: router,
    path: '/transaction'
}
