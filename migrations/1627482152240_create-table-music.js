/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('music', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    duration: {
      type: 'integer',
      notNull: true,
    },
    inserted_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('music')
}
