const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const AuthorizationError = require('../exceptions/AuthorizationError')
const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')
const { mapDBtoModelPlaylists, mapDBtoModelPlaylistSongs } = require('../utils/PlaylistUtils')

class PlaylistsService {
  constructor (openMusicService) {
    this._pool = new Pool()
    this._openMusicService = openMusicService
  }

  async addPlaylist ({ name, owner }) {
    this.verifyPlaylistName(name)
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
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
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

  async addSongToPlaylist ({ playlistId, songId }) {
    await this._openMusicService.verifySongIsFound(songId)
    const id = `playlistsong-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('failed to add songs to the playlist')
    }
  }

  async getSongsInPlaylist (id) {
    const query = {
      text: `SELECT playlistsongs.song_id, music.title, music.performer
             FROM playlistsongs
             INNER JOIN music ON playlistsongs.song_id = music.id
             INNER JOIN playlists ON playlistsongs.playlist_id = playlists.id
             WHERE playlists.id = $1`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Your playlist is still empty, please add songs')
    }

    return result.rows.map(mapDBtoModelPlaylistSongs)
  }

  async delSongInplaylist ({ playlistId, songId }) {
    // await this._openMusicService.verifySongIsFound(songId)
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 and song_id = $2',
      values: [playlistId, songId],
    }

    const result = await this._pool.query(query)
    console.log(result.rows)

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete song from playlist, id not found')
    }
  }
}

module.exports = PlaylistsService