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
  DateTime: {
    type: Date,
    required: true,
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

const CheckIn = mongoose.model('checkIn', checkInSchema);

export default CheckIn;
