import User from '../model/user';
import bcrypt from 'bcrypt';
import Room from '../model/Room';
import { async } from 'regenerator-runtime';

export const getHome = (req, res) => {
  return res.render('home', {
    pageTitle: 'Home',
    siteName: 'Hotel-Manage',
  });
};

export const getJoin = (req, res) => {
  return res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const emailIsExists = await User.exists({ email });
  if (emailIsExists) {
    return res.render('login', {
      pageTitle: 'Log In',
      errorMessage: 'this email is already taken',
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: 'check password',
    });
  }
  try {
    await User.create({
      email,
      password,
      isSocialOnly: false,
    });
    res.redirect('/login');
  } catch (error) {
    res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: error,
    });
  }
};

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).render('login', {
      pageTitle: 'Log In',
      errorMessage: 'check your email',
    });
  }
  if (user.isSocialOnly) {
    return res.status(400).render('login', {
      pageTitle: 'Log In',
      errorMessage: 'try social LogIn',
    });
  }
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.password
  );
  if (!isCorrectPassword) {
    return res.status(400).render('login', {
      pageTitle: 'Log In',
      errorMessage: 'wrong password',
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};

export const postLogout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};
