import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  floor: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  state: {
    isCheckIn: {
      type: Boolean,
      required: true,
      default: false,
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
    isClean: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
