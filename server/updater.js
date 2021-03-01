(() => {
    console.log('Executing Updater ...')
    const { execSync } = require('child_process')
    try {
        execSync('git pull && docker-compose up --build --remove-orphans -d', {
            stdio: 'inherit',
            killSignal: 'SIGINT'
        })
    } catch(e) {
        console.log('Closing Updater')
        process.kill('SIGINT')
        process.exit()
        // console.log('err: ', e)
    }
})()