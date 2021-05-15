const router = require('express').Router()
const authorization = require('../../middleware/authorization')
const bodyParser = require('body-parser')
router.use(bodyParser.json({ extended: false }))

router.get('/schema', authorization, (req,res) => {
    res.status(200).json({
        config:{
            list_key: 'month'
        },
        results: {
            month: {
                type: 'string',
                mode: '', // password or search
                minChar: 3, // minimum character allowed
                maxChar: 20, // maximum character allowed
                allowSpecialChars: false, // special character allowed or not
                allowWhiteSpace: false, // allow white space
            },
            total: {
                type: 'number',
            },
            priority_level: {
                type: 'select',
                options: ['low','average','high']
            },
            options: {
                type: 'multiselect',
                options: ['foo','bar','baz']
            }
        }
    })
})
router.get('*', authorization, (req,res) => {
    console.log('** TEST GET Request')
    res.status(200).json({
        results: [
            {month: 'January', total: 1000, priority_level: 'average', options: ['foo']},
            {month: 'February', total: 800, priority_level: 'average', options: ['foo','bar']},
            {month: 'April', total: 3000, priority_level: 'average', options: ['bar']},
            {month: 'May', total: 569, priority_level: 'average', options: ['foo']},
            {month: 'June', total: 3000, priority_level: 'low', options: ['foo']},
            {month: 'July', total: 251, priority_level: 'high', options: ['foo']},
            {month: 'August', total: 456, priority_level: 'average', options: ['foo','bar','baz']},
            {month: 'September', total: 853, priority_level: 'high',options: ['baz','foo']},
            {month: 'November', total: 943, priority_level: 'average',options: ['foo']},
            {month: 'December', total: 323, priority_level: 'average',options: ['baz','bar']}
        ]
    })
})

router.post('*', authorization, (req,res) => {
    console.log('** POST Request')
    /**
     *  UPDATE <table_name> 
        SET colname = 'new val', colname = 2 
        WHERE ID = <id> AND column_name = 'value';
     */
    console.log(req.body)
    res.status(200).json({result: true})
})

router.delete('*', authorization, (req,res) => {
    console.log('** DELETE Request')
    res.status(200).json({result: true})
})

module.exports = {
    handler: router,
    path: '/test'
}