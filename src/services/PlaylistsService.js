const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBtoModelPlaylists } = require('../../utils/PlaylistUtils')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylist ({ name, owner }) {
    // this.verifyPlaylistName(name)
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('failed to create playlist')
    }

    return result.rows[0].id
  }

  async verifyPlaylistName (name) {
    const query = {
      text: 'SELECT name FROM playlists WHERE playlists = $1',
      values: [name],
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('playlist name already used')
    }
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
            FROM playlists 
            INNER JOIN users ON users.id = playlists.owner 
            WHERE playlists.owner = $1`,
      values: [owner],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError(
        "you don't have a playlist, please try to add playlist"
      )
    }

    return result.rows.map(mapDBtoModelPlaylists)
  }

  async deletePlaylist (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete playlist, id not found')
    }
  }

  async verifyPlaylistOwner (id, owner) {
    console.log('verify id playlist owner : ' + id)
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('music not found')
    }

    const music = result.rows[0]

    if (music.owner !== owner) {
      throw new AuthorizationError(
        "you don't have permition to access this resource"
      )
    }
  }
}

module.exports = PlaylistsService
