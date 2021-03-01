module.exports = {
    // default DQ App
    appName: "", 
    
    // default for dev is https://localhost:8443, default for production is null, this is required for production
    domain: '', 
    
     // default https://localhost:8443, example: https://mydomain.com
    appUrl: '',
    
    // default false, if true it will include postgres config
    usePostgres: false, 
    
    // default abcd1234, should be change on initilization
    JWT_secret: '', 

    // default empty, example ENV_PROP=env_value
    additionalBindMounts: [], 

    // if left empty or null values it will use the default postgres values
    postgresConfig: {

        // default postgres
        POSTGRES_PASSWORD: null,

        // default postgres
        POSTGRES_USER: null,

        // default postgres
        POSTGRES_DB: null
    } 
}