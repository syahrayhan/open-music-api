class ExportsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async postExportMusicHandler (request, h) {
    this._validator.validateExportMusicPayload(request.payload)
  }
}

module.exports = ExportsHandler
