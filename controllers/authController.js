import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../utils/appError.js';

const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token: token,
    data: newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new AppError(`user doesn't exist.`, 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    next(new AppError(`incorrect password.`, 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token: token,
    data: user,
  });

  // next();
});

const protect = catchAsync(async (req, res, next) => {
  //getting token and check of it's there

  let token;

  console.log("req.headers ==> ",req.headers)

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token){
    return next(new AppError(`First login to the page to access the tours.`));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  //check if user still exists
  const freshUser = await User.findById(decodedToken.id );
  if(!freshUser){
    return (new AppError('The user no longer exists.', 401));
  }

  

  console.log("token ==>",token);

  next();  
});

export default { signup, login, protect };
