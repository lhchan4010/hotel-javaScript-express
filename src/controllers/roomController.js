import { async } from 'regenerator-runtime';
import Room from '../model/Room';
import CheckIn from '../model/CheckIn';
import User from '../model/user';

export const postUpdateRoomName = async (req, res) => {
  const { name, id } = req.body;
  const room = await Room.findByIdAndUpdate(id, { name });
  res.sendStatus(200);
};

export const postIsUsed = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  room.state.isUsed = !room.state.isUsed;
  await room.save();
  res.send({ state: room.state.isUsed });
};

export const postIsClean = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  room.state.isClean = !room.state.isClean;
  await room.save();
  res.send({ state: room.state.isClean });
};

export const postCheckIn = async (req, res) => {
  const {
    body: checkInInfo,
    params: { id },
  } = req;
  const room = await Room.findById(id);
  room.state = {
    isCheckIn: true,
    isUsed: true,
    isClean: false,
  };
  console.log(checkInInfo);
  await room.save();
  const checkIn = await CheckIn.create({
    ...checkInInfo,
    owner: room.owner,
  });
  const user = await User.findById(room.owner);
  user.checkIn.push(checkIn._id);
  await user.save();
  res.status(200).send(room);
};

export const postIsCheckIn = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  room.state.isCheckIn = false;
  room.state.isUsed = false;
  await room.save();
  res.sendStatus(200);
};
