const mapDBtoModelPlaylists = (data) => ({
  id: data.id,
  name: data.name,
  username: data.username,
})

const mapDBtoModelPlaylistSongs = (data) => ({
  id: data.song_id,
  title: data.title,
  performer: data.performer,
})

module.exports = { mapDBtoModelPlaylists, mapDBtoModelPlaylistSongs }
