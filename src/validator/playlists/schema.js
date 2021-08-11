const Joi = require('joi')

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
})

const PlaylistsongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
})

const PlaylistCollaboratorPayloadSchema = Joi.object({
  id: Joi.string().required(),
  credentialId: Joi.string().required(),
})

module.exports = { PlaylistPayloadSchema, PlaylistsongPayloadSchema, PlaylistCollaboratorPayloadSchema }
