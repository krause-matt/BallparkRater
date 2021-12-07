const Joi = require("joi");

module.exports.ballparkSchema = Joi.object({
  ballpark: Joi.object({
      ballpark: Joi.string().required(),
      team: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      image: Joi.string().required()
  }).required()
});
