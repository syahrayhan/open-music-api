const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBtoModelPlaylistSongs } = require('../../utils/PlaylistUtils')

class PlaylistsService {
  constructor (openMusicService, collaborationService, cacheService) {
    this._pool = new Pool()
    this._openMusicService = openMusicService
    this._collaborationService = collaborationService
    this._cacheService = cacheService
  }

  async addPlaylist ({ name, owner }) {
    await this.verifyPlaylistName(name, owner)
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id, owner',
      values: [id, name, owner],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('failed to create playlist')
    }

    await this._cacheService.delete(`playlist:${owner}`)
    return result.rows[0].id
  }

  async verifyPlaylistName (name, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE name = $1 and owner = $2',
      values: [name, owner],
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('playlist name already used')
    }
  }

  async getPlaylists (owner) {
    try {
      const result = await this._cacheService.get(`playlist:${owner}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username 
        FROM playlists 
        LEFT JOIN users ON users.id = playlists.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id 
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY 1,2,3`,
        values: [owner],
      }

      const result = await this._pool.query(query)
      await this._cacheService.set(`playlist:${owner}`, JSON.stringify(result.rows))
      return result.rows
    }
  }

  async deletePlaylist (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete playlist, id not found')
    }

    const { owner } = result.rows[0]
    await this._cacheService.delete(`playlist:${owner}`)
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: `SELECT * FROM playlists 
             WHERE playlists.id = $1`,
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
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 and song_id = $2',
      values: [playlistId, songId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError(
        'Failed to delete song from playlist, id not found'
      )
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
