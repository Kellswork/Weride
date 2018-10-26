import Joi from 'joi';

function validateRide(ride) {
  const schema = {
    location: Joi.string().min(3).max(30).required(),
    destination: Joi.string().min(3).max(30).required(),
    time: Joi.string().max(30).required(),
    date: Joi.string().max(30).required(),
    seats: Joi.number().required(),
  };
  return Joi.validate(ride, schema);
}

export default validateRide;
