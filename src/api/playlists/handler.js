class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this)
    this.delSongInPlaylistHandler = this.delSongInPlaylistHandler.bind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePlaylistPayload(request.payload)
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials
    const playlistId = await this._service.addPlaylist({ name, owner: credentialId })

    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201)
  }

  async getPlaylistsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    console.log(credentialId)
    const playlists = await this._service.getPlaylists(credentialId)

    return {
      status: 'success',
      data: {
        playlists,
      },
    }
  }

  async deletePlaylistHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._service.verifyPlaylistOwner(id, credentialId)
    await this._service.deletePlaylist(id)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    }
  }

  async postSongToPlaylistHandler (request, h) {
    console.log(request.payload)
    this._validator.validPlaylistSongPayload(request.payload)
    const { songId } = request.payload
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(id, credentialId)
    await this._service.addSongToPlaylist({ playlistId: id, songId })

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201)
  }

  async getSongsInPlaylistHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._service.verifyPlaylistAccess(id, credentialId)
    const songs = await this._service.getSongsInPlaylist(id)

    return {
      status: 'success',
      data: {
        songs,
      },
    }
  }

  async delSongInPlaylistHandler (request) {
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(id, credentialId)
    await this._service.delSongInplaylist({ playlistId: id, songId })

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    }
  }
}
module.exports = PlaylistsHandler
