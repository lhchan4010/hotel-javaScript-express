import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  payment: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    maxlength: 20,
    trim: true,
  },
  createAt: { type: Date, default: Date.now },
  time: {
    checkIn: {
      type: String,
      required: true,
      maxlength: 20,
    },
    checkOut: { type: String, maxlength: 20 },
  },
  room: {
    type: Number,
    required: true,
    maxlength: 20,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const CheckIn = mongoose.model('CheckIn', checkInSchema);

export default CheckIn;
