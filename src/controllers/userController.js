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

const findRevenue = async (range, _id) => {
  const checkInData = await CheckIn.find({
    owner: _id,
    createAt: { $gte: range },
  });
  return checkInData;
};

export const getRevenue = async (req, res, next) => {
  const {
    params: { range },
    session: { user: _id },
  } = req;
  const date = new Date();
  if (range === 'week') {
    date.setDate(date.getDate() - 6);
    const range = date.toISOString().slice(0, 10);
    const revenue = await findRevenue(range, _id);
    return res.status(200).send(revenue);
  }
  if (range === 'month') {
    const range = date.toISOString().slice(0, 7);
    const revenue = await findRevenue(range, _id);
    return res.status(200).send(revenue);
  }
  if (range === 'year') {
    const range = date.toISOString().slice(0, 4);
    const revenue = await findRevenue(range, _id);
    return res.status(200).send(revenue);
  }

  res.status(200);
};

// export const getRevenue = async (req, res, next) => {
//   const { user: _id } = req.session;
//   const today = new Date();
//   const weekAgo = new Date(today - 604800000);
//   const checkInDatas = await CheckIn.find({
//     owner: _id,
//     createAt: {
//       $gte: weekAgo.toISOString().slice(0, 10),
//     },
//   });
//   res.status(200).send(checkInDatas);
// };

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
