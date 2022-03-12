import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    trim: true,
  },
  password: { type: String, maxlength: 100 },
  isSocialOnly: { type: Boolean, required: true },
  createAt: { type: Date, default: Date.now },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
  ],
  checkIn: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CheckIn',
      required: true,
    },
  ],
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
