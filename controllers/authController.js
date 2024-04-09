import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

const signup = catchAsync(async (req, res) => {
  console.log('req.body ==>', req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_EXPRIRES_IN, {
    expiresIn: process.env.JWT_EXPRIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token: token,
    data: newUser,
  });
});

export default { signup };
