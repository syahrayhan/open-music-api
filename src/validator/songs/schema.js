const Joi = require('joi')

const OpenMusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.string().required(),
})

module.exports = { OpenMusicPayloadSchema }
