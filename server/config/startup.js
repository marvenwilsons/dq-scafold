module.exports = {
    // default DQ App
    appName: "FT-X", 
    
    // default for dev is https://localhost:8443, default for production is null, this is required for production
    domain: '', 
    
     // default http://localhost:8443, example: https://mydomain.com
    appUrl: '',
    
    // default false, if true buil will include postgres config
    usePostgres: true,
    
    // default false, if true build will include pgAdmin config
    usePgAdmin: true,
    
    // default abcd1234, should be change on initilization
    JWT_secret: 'k@zsdfi23945kjadf', 

    // default empty, example ENV_PROP=env_value
    additionalBindMounts: [], 

    // if left empty or null values it will use the default postgres values
    postgresConfig: {

        // default POSTGRES_PASSWORD is "postgres" if null
        POSTGRES_PASSWORD: null,

        // default POSTGRES_USER is "postgres" if null
        POSTGRES_USER: null,

        // default POSTGRES_DB is "postgres" if null
        POSTGRES_DB: 'money',

        // More on pgAdmin: https://www.pgadmin.org/docs/pgadmin4/latest/container_deployment.html
        // default PGADMIN_DEFAULT_EMAIL is "user@domain.com" if null
        PGADMIN_DEFAULT_EMAIL: null,

        // default password is password if null
        PGADMIN_DEFAULT_PASSWORD: null,

        // default PGADMIN_URL is pgadmin
        PGADMIN_URL:'mydb'
    } 
}