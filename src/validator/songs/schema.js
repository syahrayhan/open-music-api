const Joi = require('joi')

const OpenMusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1500).max(4444).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.string().required(),
})

module.exports = { OpenMusicPayloadSchema }
