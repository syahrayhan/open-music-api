/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
  })
}

exports.down = pgm => {
  pgm.dropTable('playlists')
}
