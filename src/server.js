/* eslint-disable linebreak-style */
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const songs = require('./api/songs')
const OpenMusicService = require('./services/postgres/OpenMusicService')
const openMusicValidator = require('./validator/songs')

const init = async () => {
  const openMusicService = new OpenMusicService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register({
    plugin: songs,
    options: {
      service: openMusicService,
      validator: openMusicValidator,
    },
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

init()
