/* eslint-disable linebreak-style */
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const songs = require('./api/songs')
const users = require('./api/users')
const ClientError = require('./exceptions/ClientError')
const OpenMusicService = require('./services/postgres/OpenMusicService')
const UsersService = require('./services/postgres/UsersService')
const openMusicValidator = require('./validator/songs')
const UsersValidator = require('./validator/users')

const init = async () => {
  const openMusicService = new OpenMusicService()
  const usersService = new UsersService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.ext('onPreResponse', (request, h) => {
    // get response context from request
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        // membuat response baru dari response toolkit sesuai kebutuhan error handling
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode)
      }

      return h
        .response({
          status: 'fail',
          message: 'Sorry, there was a failure on our server',
        })
        .code(500)
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)

    return response.continue || response
  })

  await server.register([
    {
      plugin: songs,
      options: {
        service: openMusicService,
        validator: openMusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    }
  ])

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

init()
