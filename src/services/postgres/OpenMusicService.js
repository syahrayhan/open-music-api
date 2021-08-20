const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDbToModelAllMusic, mapDbToModelDetailMusic } = require('../../utils/MusicUtils')

class OpenMusicService {
  constructor () {
    this._pool = new Pool()
  }

  async addMusic (data) {
    const id = `song-${nanoid(16)}`
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT INTO music VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        data.title,
        data.year,
        data.performer,
        data.genre,
        data.duration,
        insertedAt,
        updatedAt
      ],
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan Music')
    }

    return result.rows[0].id
  }

  async getAllMusic () {
    const result = await this._pool.query(
      'SELECT id, title, performer FROM music'
    )
    return result.rows.map(mapDbToModelAllMusic)
  }

  async getDetailMusicById (id) {
    const query = {
      text: 'SELECT * FROM music WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Music tidak ditemukan')
    }

    return result.rows.map(mapDbToModelDetailMusic)[0]
  }

  async editMusicById (data) {
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE music SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [
        data.title,
        data.year,
        data.performer,
        data.genre,
        data.duration,
        updatedAt,
        data.id
      ],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal Memperbaharui music, id tidak ditemukan')
    }
  }

  async deleteMusicById (id) {
    const query = {
      text: 'DELETE FROM music WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal Menghapus music, id tidak ditemukan')
    }
  }

  async verifySongIsFound (id) {
    const query = {
      text: 'SELECT id FROM music WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Song is not found')
    }
  }
}

module.exports = OpenMusicService
