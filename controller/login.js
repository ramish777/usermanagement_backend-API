const Users = require('../model/user');


exports.getloginpage = (req, res, next) => {
  res.status(200).json({ pageTitle: 'Login' });
};

exports.logout = (req, res, next) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    // Send a JSON response indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  });
};
  