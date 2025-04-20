const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const user = require('../models/users')


exports.loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name, sub } = ticket.getPayload();

  let curruser = await user.findOne({ email });
  if (!curruser) {
    curruser = await user.create({ email, username: name, googleId: sub });
  }

  const jwtToken = jwt.sign({ userId: curruser._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token: jwtToken, user });
};