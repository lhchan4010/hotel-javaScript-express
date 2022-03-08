import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  floor: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
    trim: true,
  },
  state: {
    isUsed: { type: Boolean, default: false },
    isClean: { type: Boolean, default: true },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
