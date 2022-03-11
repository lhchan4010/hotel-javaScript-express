import { set } from 'express/lib/application';
import { async } from 'regenerator-runtime';
import Room from '../model/Room';
import User from '../model/user';

export const getBoard = (req, res) => {
  res.render('board', { pageTitle: 'Board' });
};

export const getBoardData = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate('rooms');
  const rooms = user.rooms;
  res.send(rooms);
};

export const postCreateBoard = async (req, res) => {
  const { data } = req.body;
  const {
    user: { _id },
  } = req.session;
  const user = await User.findById(_id);
  user.rooms = [];
  for (const roomData of data) {
    roomData.owner = _id;
    const room = await Room.create(roomData);
    user.rooms.push(room._id);
  }
  console.log(data);
  await user.save();
  return res.status(200).json({});
};
