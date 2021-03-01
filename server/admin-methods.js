const adminMethods = {}
const {exec, fork, spawn} = require('child_process')
const path = require('path')


adminMethods.updateSite = (socket) => {
    console.log('updating ...')

    const runUpdate = socket => {
        const updateScript = fork('./updater.js', {
            silent: true
        })
        updateScript.stdout.on('data', (data) => {
            // console.log('==> ', data.toString())
            const msg = data.toString()
            socket.emit('updateSite_response', msg)

            // if update is requested but git pull returns "Already up to date"
            if(msg.includes('Already up to date.') || msg == 'Already up to date.') {
                socket.emit('updateSite_response', 'Done!')
                updateScript.disconnect()
            }

            // done updating
            if(msg.includes('Successfully tagged')) {
                socket.emit('updateSite_response', 'Done!')
            }

        })
    }

    try {
        const shPath = path.join(__dirname, '../') + 'git.sh'
        const gitpull = exec(`sh ${shPath}`)
        
        gitpull.stdout.setEncoding('utf-8')
        gitpull.stdout.on('data', (chunk) => {
            socket.emit('updateSite_response',chunk)
            console.log(shPath)
            if(chunk.includes('Already up to date.') == false) {
                // runUpdate(socket)
            }
        })

        gitpull.on('close', (code) => {
            socket.emit('updateSite_response',`Git pull process closing with code ${code}`)
        })
        
    } catch(e) {
        // console.log(e)
    }
    
}

module.exports = adminMethods