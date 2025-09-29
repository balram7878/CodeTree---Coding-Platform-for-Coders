const validators = require("validator");

const registrationValidation = ({ firstName, email, password }) => {
  if (!firstName) throw new Error("name not provided");
  if (firstName.length > 20 || firstName.length < 3)
    throw new Error("name not valid");
  if (!email) throw new Error("email not provided");
  if (!password) throw new Error("name not provided");
  if (!validators.isEmail(email)) throw new Error("email not valid");
  if (!validators.isStrongPassword(password))
    throw new Error("please choose strong password");
};

const loginValidation=({email,password})=>{
  if(!email) 
    throw new Error("email not provided");
  if(!password)
    throw new Error("password not provided");
}

module.exports = {registrationValidation,};
