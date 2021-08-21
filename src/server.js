/* eslint-disable linebreak-style */
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')

const songs = require('./api/songs')
const OpenMusicService = require('./services/postgres/OpenMusicService')
const openMusicValidator = require('./validator/songs')

const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsValidator = require('./validator/authentications')
const TokenManager = require('./tokennize/tokenManager')
const AuthenticationsSerive = require('./services/postgres/AuthenticationsService')

const playlists = require('./api/playlists')
const PlaylistsValidator = require('./validator/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')

const collaborations = require('./api/collaborations')
const CollaborationsValidator = require('./validator/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')

const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

const ClientError = require('./exceptions/ClientError')

const init = async () => {
  const openMusicService = new OpenMusicService()
  const collaborationsService = new CollaborationsService()
  const playlistsService = new PlaylistsService(openMusicService, collaborationsService)
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsSerive()

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
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode)
      }
      if (response.message === 'Missing authentication') {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(401)
      }
      return h
        .response({
          status: 'fail',
          message: 'Sorry, there was a failure on our server',
        })
        .code(500)
    }

    return response.continue || response
  })

  // exsternal plugin
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    }
  ])

  // Jwt authentications Strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  })

  // internal plugin
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
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        service: ProducerService,
        validator: ExportsValidator,
      },
    }
  ])

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

init()
