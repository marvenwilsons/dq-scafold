const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const fkill = require('fkill')

const socket = require('socket.io')
const socketRoutes = require('./socket.io/main')

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  try {
    await fkill(process.env.APP_PORT)
  } catch {}
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server =  app.listen(port, host)

  const IO_Instance = socket(server, {
    cookie: false
  })

  IO_Instance.on('connection', socket => {
    for (const methodName in socketRoutes) {
      socketRoutes[methodName](socket)
    }
  })


  consola.ready({
    message: `\n ${process.env.APP_TITLE} is ready | ${process.env.APP_URL}`,
    badge: true
  })
}
start()