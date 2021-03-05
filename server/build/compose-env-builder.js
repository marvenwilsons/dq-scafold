// https://www.convertonline.io/convert/json-to-js
// https://beautifier.io/

const conf = require('../config/startup.js')
const defaults = require('../config/defaults.json')
require('colors');

function composeBuilder(config) {
    // postgres service
    const postgres = {
        container_name: "postgres",
        image: "postgres",
        restart: "always",
        ports: ["5432"],
        environment: {
            POSTGRES_PASSWORD: config.postgresConfig.POSTGRES_PASSWORD || 'postgres',
            POSTGRES_USER: config.postgresConfig.POSTGRES_PASSWORD || 'postgres',
            POSTGRES_DB: config.postgresConfig.POSTGRES_DB || 'postgres',
            PGHOST: 'postgres'
        },
        volumes: ["./pgdata:/var/lib/postgresql/data"],
        depends_on: ["site"]
    }
    // pgAdmin service
    const pgadmin = {
        container_name: 'pgadmin',
        image: "dpage/pgadmin4",
        environment: [
            `PGADMIN_DEFAULT_EMAIL=${config.PGADMIN_DEFAULT_EMAIL || 'user@domain.com'}`,
            `PGADMIN_DEFAULT_PASSWORD=${config.PGADMIN_DEFAULT_PASSWORD || 'password'}`,
            `PGADMIN_CONFIG_ENHANCED_COOKIE_PROTECTION=True`,
            `PGADMIN_CONFIG_LOGIN_BANNER="Authorised users only!"`,
        ],
        volumes: [
            "./pgadmin:/var/lib/pgadmin",
            "./pgadmin:/pgadmin4/servers.json",
            "./pgadmin:/pgadmin4/config_local.py"
        ],
        ports: [
            `${defaults.pgAdminPort}:80`
        ],
        restart: "unless-stopped"
    }
    //
    const defaultCompose = {
        version: "3",
        services: {
            site: {
                build: {
                    context: ".",
                    target: config.buildFor == 'production' || config.buildFor == 'prod_test_local' ? 'production' : config.buildFor
                },
                container_name: "site-container",
                restart: "unless-stopped",
                working_dir: "/usr/src/nuxt-app",
                environment: [
                    // site env
                    `APP_URL=${config.buildFor == 'dev' || config.buildFor == 'prod_test_local' ? 'https://localhost:8443' : config.appUrl}`,
                    `APP_TITLE=${config.appName || 'DQ App'}`,
                    `JWT_SECRET=${config.JWT_secret || 'abcd1234'}`,
                    `APP_HOST=${config.buildFor == 'dev' || config.buildFor == 'prod_test_local' ? `${defaults.devHost}` : `${defaults.prodHost}` }`,
                    "APP_PORT=5000",
                    // postgres env
                    `PGPASSWORD=${config.postgresConfig.POSTGRES_PASSWORD || 'postgres'}`,
                    `USER=${config.postgresConfig.POSTGRES_PASSWORD || 'postgres'}`,
                    `PGHOST=postgres`,
                    `PGDATABASE=${config.postgresConfig.POSTGRES_DB || 'postgres'}`
                ],
                ports: ["5000:5000"],
                volumes: [
                    "./assets:/usr/src/nuxt-app/assets", 
                    "./components:/usr/src/nuxt-app/components", 
                    "./layouts:/usr/src/nuxt-app/layouts", 
                    "./middleware:/usr/src/nuxt-app/middleware", 
                    "./pages:/usr/src/nuxt-app/pages", 
                    "./plugins:/usr/src/nuxt-app/plugins", 
                    "./server:/usr/src/nuxt-app/server", 
                    "./store:/usr/src/nuxt-app/store", 
                    "./static:/usr/src/nuxt-app/static", 
                    "./m.js:/usr/src/nuxt-app/m.js", 
                    "./nuxt.config.js:/usr/src/nuxt-app/nuxt.config.js"
                ]
            },
            nginx: {
                image: "nginx",
                depends_on: ["site"],
                container_name: "nginx-container",
                volumes: ["./nginx:/etc/nginx/templates", "./nginx/certs:/etc/nginx/certs"],
                ports: [
                    `${config.buildFor == 'dev' || config.buildFor == 'prod_test_local' ? '8443:8443' : '443:443'}`, 
                    "80:80"
                ],
                environment: [
                    //  nginx env
                    `NGINX_HTTPS_PORT=${config.buildFor == 'dev' || config.buildFor == 'prod_test_local' ? '8443' : '443'}`, 
                    `NGINX_HOST=${config.buildFor == 'dev' || config.buildFor == 'prod_test_local' ? 'localhost' : config.domain}`, 
                    "NGINX_PORT=80", 
                    `APP_SERVER=${config.buildFor == 'dev' || config.buildFor == 'prod_test_local' ? `${defaults.devHost}:5000` : `${defaults.prodHost}:5000`}`
                ]
            }
        }
    }
    //

    if(config.usePostgres == true) {

        if(config.usePgAdmin == true) {
            defaultCompose.services.postgres = postgres
            defaultCompose.services.pgadmin = pgadmin
            defaultCompose.services.nginx.depends_on.push('pgadmin')
            defaultCompose.services.nginx.environment.push(`PGADMIN_URL=${config.postgresConfig.PGADMIN_URL || 'pgadmin'}`)
            return defaultCompose
        } else {
            defaultCompose.services.postgres = postgres
            return defaultCompose
        }
    } else {
        return defaultCompose
    }
}

function configValidator(config) {
    // check build for value
    if(config.buildFor != 'dev' && config.buildFor != 'production' && config.buildFor != 'prod_test_local') {
        throw new Error(`Invalid buildFor value "${config.buildFor}"`)
    }

    /**
     * if build for production
     * 1. domain property should not be the default value.
     * 2. appUrl property should not be the default value.
     * 3. usePostgres if true, postgresConfig should not be the default value.
     * 4. JWT_secret should not be the default value.
     */
    if(config.buildFor == 'production') {
        const { domain, appUrl, JWT_secret } = config
        
        // validate domain
        if(domain == null || domain == undefined || !domain) {
            return console.log(`\n Error: Invalid domain name value: ${domain} \n Please provide correct domain name located in config folder startup.js`.black.bgBrightRed)
        } else if(domain.includes('localhost')) {
            return console.log(`\n Error: Invalid domain name value: ${domain} \n Please provide correct domain name located in config folder startup.js \n\n  example of correct domains: https://sample.com`.black.bgBrightRed)
        }

        // validate appUrl
        if(appUrl == null || appUrl == undefined || !appUrl) {
            return console.log(`\n Error: Invalid appUrl value: ${appUrl} \n Please provide correct appUrl located in config folder startup.js`.black.bgBrightRed)
        } else if(appUrl.includes('localhost')) {
            return console.log(`\n Error: Invalid appUrl value: ${appUrl} \n Please provide correct appUrl located in config folder startup.js \n\n  example of correct domains: https://sample.com`.black.bgBrightRed)
        }

        // validate JWT_secret
        if(JWT_secret == null || JWT_secret == undefined || !JWT_secret) {
            return console.log(`\n Error: Invalid JWT_secret ${JWT_secret}`.black.bgBrightRed)
        } else if(config.JWT_secret == 'abcd1234') {
            return console.log(`\n Error: Invalid JWT_secret, "${JWT_secret}" is a default value \n please provide different JWT_secret`.black.bgBrightRed)
        }else {
            return JSON.stringify(composeBuilder(config), null , 4)
        }

    } else if(config.buildFor == 'dev') {
        return JSON.stringify(composeBuilder(config), null , 4)
    } else if(config.buildFor == 'prod_test_local') {
        config.buildFor = 'prod_test_local'
        return JSON.stringify(composeBuilder(config), null , 4)
    }
}

if(process.argv[2] == '--log') {
    console.log(configValidator(conf))
}

module.exports = configValidator