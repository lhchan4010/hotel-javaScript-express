import { async } from 'regenerator-runtime';
import CheckIn from '../model/CheckIn';
import User from '../model/user';

export const getAccounting = async (req, res) => {
  const { user: _id } = req.session;
  const user = await User.findById(_id).populate('checkIn');
  const checkInDatas = user.checkIn;
  res.render('profile', {
    pageTitle: 'Revenue',
    checkInDatas,
  });
};

export const getRevenue = async (req, res, next) => {
  const { user: _id } = req.session;
  const today = new Date();
  const weekAgo = new Date(today - 604800000);
  const checkInDatas = await CheckIn.find({
    owner: _id,
    createAt: {
      $gte: weekAgo.toISOString().slice(0, 10),
    },
  });
  res.status(200).send(checkInDatas);
};

export const getMonth = async (req, res) => {
  const { user: _id } = req.session;
  const today = new Date();
  const month = today.toISOString().slice(0, 7);
  console.log(month);
  const checkInDatas = await CheckIn.find({
    owner: _id,
    createAt: {
      $gte: month,
    },
  });
  console.log(checkInDatas);
  res.status(200);
};
