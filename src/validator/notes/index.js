const InvariantError = require('../../exceptions/InvariantError')
const { OpenMusicPayloadSchema } = require('./schema')

const MusicValidator = {
  validateMusicPayload: (payload) => {
    const validationResult = OpenMusicPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = MusicValidator
