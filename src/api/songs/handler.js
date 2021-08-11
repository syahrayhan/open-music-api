class OpenMusicHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postMusicHandler = this.postMusicHandler.bind(this)
    this.getAllMusicHandler = this.getAllMusicHandler.bind(this)
    this.getDetailMusicByIdHandler = this.getDetailMusicByIdHandler.bind(this)
    this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this)
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this)
  }

  async postMusicHandler (request, h) {
    this._validator.validateMusicPayload(request.payload)
    const { title, year, performer, genre, duration } = request.payload
    const data = {
      title,
      year,
      performer,
      genre,
      duration,
    }
    const songId = await this._service.addMusic(data)

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    }).code(201)
  }

  async getAllMusicHandler () {
    const songs = await this._service.getAllMusic()
    return {
      status: 'success',
      data: {
        songs,
      },
    }
  }

  async getDetailMusicByIdHandler (request) {
    const { id } = request.params
    const song = await this._service.getDetailMusicById(id)
    return {
      status: 'success',
      data: {
        song,
      },
    }
  }

  async putMusicByIdHandler (request) {
    this._validator.validateMusicPayload(request.payload)
    const { title, year, performer, genre, duration } = request.payload
    const { id } = request.params
    const data = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
    }

    await this._service.editMusicById(data)

    return {
      status: 'success',
      message: 'lagu berhasil diperbarui',
    }
  }

  async deleteMusicByIdHandler (request) {
    const { id } = request.params
    await this._service.deleteMusicById(id)

    return {
      status: 'success',
      message: 'lagu berhasil dihapus',
    }
  }
}

module.exports = OpenMusicHandler
