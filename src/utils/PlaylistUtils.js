const mapDBtoModelPlaylists = (data) => ({
  id: data.id,
  name: data.name,
  username: data.username,
})

module.exports = { mapDBtoModelPlaylists }
