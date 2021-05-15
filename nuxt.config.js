// import colors from 'vuetify/es5/util/colors'
const colors = require('vuetify/es5/util/colors').default
const bodyParser = require('body-parser')


module.exports = {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: process.env.APP_TITLE,
    title: process.env.APP_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lobster&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rochester&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Ultra&display=swap",
      }
    ],
    script: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.0/socket.io.js'
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js'
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/dq-css/main.css',
    '@/assets/dq-css/normalize.css',
    '@/assets/dq-css/theme/main.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/client-only.js', mode: 'client' },
    { src: '~/plugins/widget.js', mode: 'client' },
    { src: '~/plugins/un-sorted-comps.js', mode: 'client' },
    // { src: '~/plugins/element-ui.js', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
    '@nuxtjs/color-mode'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'vue-scrollto/nuxt',
    'nuxt-socket-io',
    '@nuxtjs/axios',
  ],
  env: {
      baseUrl: process.env.APP_URL
  },
  axios: {
    baseURL: process.env.APP_URL
  },
  io: {
    sockets: [
      { // At least one entry is required
        name: 'home',
        url: process.env.APP_URL,
        default: true,
        cookie: false
      }
    ]
  },
  elementUI: {
    components: ['Button', 'DatePicker'],
    locale: 'fr',
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    fontSize:'11px',
    font: {
      size:'11px'
    },
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  serverMiddleware: [
    '~/server/express/statement/statement.js',
    '~server/express/authentication/auth.js',
    '~/server/express/user/user.js',
    '~/server/express/user/saved_transaction.js',
    '~/server/express/sample/index.js'
  ],
  telemetry: false,
  server: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT
  }
}
