const path = require('path')
const fs = require('fs')
const YAML = require('./modules/yml-stringify')
const distFile = path.join(__dirname,'../../docker-compose.yml')
require('colors')
const config = require('../config/startup')


const msg = (services) => {
    const text = `\n ✔ Successfully generated compose file \n\n   please run the command: \n   docker-compose up --build --remove-orphans or sh build.sh
    
   Services:
    ${services.map(e=> {
        return ` ✔ ${e}\n `
    })}
    `
    console.log(text.replace(/\,/g,'   ','').green)
}

module.exports = function(mode, conf) {
    const parse = JSON.parse( conf )
    
    if(mode == 'production') {
        const prod_config = YAML.stringify(parse)
        fs.writeFileSync(distFile,prod_config)
        msg(Object.keys(parse.services))
    } 
    else if(mode == 'dev') {
        const dev_config = YAML.stringify(parse)
        fs.writeFileSync(distFile,dev_config)
        msg(Object.keys(parse.services))
    } else if(mode == 'prod_test_local') {
        const prod_test_config = YAML.stringify(parse)
        fs.writeFileSync(distFile,prod_test_config)
        msg(Object.keys(parse.services))
    }
}