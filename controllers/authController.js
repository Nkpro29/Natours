import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 'failure',
      message: 'user not exist. please signup first.',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      status: 'failure',
      message: 'entered password is not valid.',
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIRES_IN,
  });
  res.status(200).json({
    status: 'success',
    token: token,
    data: user,
  });
});

export default { signup, login };
