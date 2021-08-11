const InvariantError = require('../../exceptions/InvariantError')
const { PlaylistPayloadSchema, PlaylistsongPayloadSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validPlaylistSongPayload: (payload) => {
    const validationResult = PlaylistsongPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = PlaylistsValidator
