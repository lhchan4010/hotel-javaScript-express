export const getBoard = (req, res) => {
  res.render('board', { pageTitle: 'Board' });
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
  await user.save();
  return res.status(200).json({});
};
