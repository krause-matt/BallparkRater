const orgJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// module.exports.ballparkSchema = Joi.object({
//   ballpark: Joi.object({
//       ballpark: Joi.string().required(),
//       team: Joi.string().required(),
//       latitude: Joi.number().required(),
//       longitude: Joi.number().required()
//   }).required()
// });

const custom = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.removeHtml' : '{{#label}} cannot include HTML!'
  },
  rules: {
    removeHtml: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}
        });
        if (clean !== value) return helpers.error('string.removeHtml', {value})
        return clean;
      }
    }
  }
});

const Joi = orgJoi.extend(custom);

module.exports.ballparkSchema = Joi.object({
  ballpark: Joi.object({
      ballpark: Joi.string().required().removeHtml(),
      team: Joi.string().required().removeHtml(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      deleteImages: Joi.array()
  }),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.string().required().removeHtml(),
    review: Joi.string().required().removeHtml()
  }).required()
});
