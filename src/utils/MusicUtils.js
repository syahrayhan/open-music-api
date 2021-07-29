const mapDbToModel = ({ data }) => ({
  id: data.id,
  title: data.title,
  year: data.year,
  performer: data.performer,
  genre: data.genre,
  duration: data.duration,
  insertedAt: data.inserted_at,
  updatedAt: data.updated_at,
})

module.exports = { mapDbToModel }
