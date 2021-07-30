const ClientError = require('../../exceptions/ClientError')

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
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode)
      }

      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, Terjadi kegagalan pada server kami',
      }).code(500)
    }
  }

  async getAllMusicHandler (request, h) {
    try {
      const songs = await this._service.getAllMusic()
      return h.response({
        status: 'success',
        data: {
          songs,
        },
      })
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode)
      }

      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, Terjadi kegagalan pada server kami',
      }).code(500)
    }
  }

  async getDetailMusicByIdHandler (request, h) {
    try {
      const { id } = request.params
      const song = await this._service.getDetailMusicById(id)
      return {
        status: 'success',
        data: {
          song,
        },
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode)
      }

      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, Terjadi kegagalan pada server kami',
      }).code(500)
    }
  }

  async putMusicByIdHandler (request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode)
      }

      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, Terjadi kegagalan pada server kami',
      }).code(500)
    }
  }

  async deleteMusicByIdHandler (request, h) {
    try {
      const { id } = request.params
      await this._service.deleteMusicById(id)

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode)
      }

      console.log(error)
      return h.response({
        status: 'error',
        message: 'Maaf, Terjadi kegagalan pada server kami',
      }).code(500)
    }
  }
}

module.exports = OpenMusicHandler
