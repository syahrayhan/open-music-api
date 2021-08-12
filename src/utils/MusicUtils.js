const mapDbToModelAllMusic = (data) => ({
  id: data.id,
  title: data.title,
  performer: data.performer,
})

const mapDbToModelDetailMusic = (data) => ({
  id: data.id,
  title: data.title,
  year: data.year,
  performer: data.performer,
  genre: data.genre,
  duration: data.duration,
  insertedAt: data.inserted_at,
  updatedAt: data.updated_at,
})

module.exports = { mapDbToModelAllMusic, mapDbToModelDetailMusic }
