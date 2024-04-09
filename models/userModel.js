import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Any user cannot exist without name.'],
    maxLength: 40,
    minLength: 5,
  },
  email: {
    type: String,
    required: [true, 'email is necessary for a user.'],
    validate: {
      validator: function (v) {
        return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide the password'],
    minLength: 6,
  },
  confirmPassword: {
    type: String,
    required: [true, 'please provide the confirm password'],
    minLength: 6,
    validate: {
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
    },
  },
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
