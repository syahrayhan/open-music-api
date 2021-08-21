const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class CollaborationsService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addCollaboration (playlistId, userId) {
    const id = `collab-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('failed to add collaboration')
    }
    await this._cacheService.delete(`playlist:${userId}`)
    return result.rows[0].id
  }

  async deleteCollaboration (playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 and user_id = $2',
      values: [playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('failed to delete collaboration')
    }
    await this._cacheService.delete(`playlist:${userId}`)
  }

  async verifyCollaborator (playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 and user_id = $2',
      values: [playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('varification of collabolator failed')
    }
  }
}

module.exports = CollaborationsService
