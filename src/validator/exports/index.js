const InvariantError = require('../../exceptions/InvariantError')
const ExportMusicPayloadSchema = require('./schema')

const ExportsValidator = {
  validateExportMusicPayload: (payload) => {
    const validationResult = ExportMusicPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = ExportsValidator
