export const getHome = (req, res) => {
  return res.render('home', { pageTitle: 'Home', siteName: 'Hotel-Manage' });
};
