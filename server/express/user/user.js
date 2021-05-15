const router = require('express').Router()
const bodyParser = require('body-parser')
const authorization = require('../../middleware/authorization')
const db = require('../../postgres/db')
router.use(bodyParser.json({ extended: false }))

router.get('/account', authorization, async (req,res) => {
    console.log('* Fetching user account')


    const user_acc = await db.query('SELECT * FROM users WHERE user_id = $1',[req.user])
    const { user_name, user_settings, user_notes, user_activity } = user_acc.rows[0]

    res.status(200).json({
        account: {
            user_name,
            user_settings,
            user_notes,
            user_activity
        }
    })
})


module.exports = {
    handler: router,
    path: '/user'
}
