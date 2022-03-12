import { async } from 'regenerator-runtime';
import Room from '../model/Room';

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
