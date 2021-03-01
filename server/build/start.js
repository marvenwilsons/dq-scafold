const prompts = require('prompts'); // https://github.com/terkelg/prompts#readme
const config = require('../config/startup')
const composeEnvBuilder = require('./compose-env-builder')
const composeWriter = require('./compose-writer')
const { exec, execSync, spawn } = require('child_process')

const questions = [
    {
        type: 'select',
        name: 'startUpEnv',
        message: 'Select startup environment',
        choices: [
            'build for development (run app locally)', 
            'build for production (to be deployed remotely)',
            'build for production test locally'
        ],
        initial: null
    }
]
prompts(questions).then(response => {
    const {startUpEnv} = response
    if(startUpEnv == 0) {
        config.buildFor = 'dev'
        const devConf = composeEnvBuilder(config)
        composeWriter('dev',devConf)
    } else if(startUpEnv == 1) {
        config.buildFor = 'production'
        const prodConf = composeEnvBuilder(config)
        composeWriter('production',prodConf)
    } else if(startUpEnv == 2) {
        config.buildFor = 'prod_test_local'
        const prodTestConf = composeEnvBuilder(config)
        composeWriter('production',prodTestConf)
    }   
})
