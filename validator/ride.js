import Joi from 'joi';

export default function validateInput(rideDetails) {
  // this is used to validate the ride details input from users
  const Schema = {
    name: Joi.string().alphanum().min(5).max(50)
      .required(),
    from: Joi.string().min(1).max(50).required(),
    to: Joi.string().min(1).max(50).required(),
    time: Joi.string().min(1).max(50).required(),
    date: Joi.string().min(1).max(50).required(),
  };
  return Joi.validate(rideDetails, Schema);
}
