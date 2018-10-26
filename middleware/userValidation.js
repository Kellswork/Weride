import Joi from 'joi';

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().required().email({ minDomainAtoms: 2 }),
  };
  return Joi.validate(user, schema);
}


export default validateUser;
