const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const {UnauthenticatedError} = require("../errors")

const register = async (req, res) => {
  // const {name, email, password} = req.body;
  // if(!name || !email || !password) {
  //    throw new BadRequestError("Please provide name, email, password")
  // }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email, password");
  }
  const user = await User.findOne({email})
  
  if(!user) {
    throw new  UnauthenticatedError("Invalid credentials")
  }
  //compare password
  const isPasswordCorrect  = await user.comparePassword(password)
  
  if(!isPasswordCorrect) {
    throw new  UnauthenticatedError("Invalid credentials")
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {name:user.name}, token})
};

module.exports = { register, login };

// bcrypt:
/*
const { name, email, password } = req.body;
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
const tempUser = { name, email, password: hashedPassword }; //name:name,email:email
const user = await User.create({ ...tempUser }); // here we using mongoose validator
*/
