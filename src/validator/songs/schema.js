const Joi = require('joi')

const OpenMusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1500).max(new Date().getFullYear()).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.string().required(),
})

module.exports = { OpenMusicPayloadSchema }
