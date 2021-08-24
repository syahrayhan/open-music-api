class ExportsHandler {
  constructor (playlistsService, service, validator) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService

    this.postExportMusicHandler = this.postExportMusicHandler.bind(this)
  }

  async postExportMusicHandler (request, h) {
    this._validator.validateExportMusicPayload(request.payload)
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    }

    await this._service.sendMessage('export:music', JSON.stringify(message))

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201)
  }
}

module.exports = ExportsHandler
