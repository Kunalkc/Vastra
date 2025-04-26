/* const { OAuth2Client } = require('google-auth-library'); */
const jwt = require('jsonwebtoken');
/* const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); */
const user = require('../models/users')
const serviceAccount = require('../vastra-4f656-6c35e2dc40cf.json')

const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), 
  });
}
/* 
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
}; */



exports.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { email, name, picture, uid } = decodedToken;

    // Find or create user in your own DB
    let curruser = await user.findOne({ email });
    if (!curruser) {
      curruser = await user.create({ 
        email, 
        username: name || email.split('@')[0], 
        googleId: uid 
      });
    }

    // Create your own JWT for session handling
    const jwtToken = jwt.sign(
      { userId: curruser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: jwtToken, user: curruser });
  } catch (error) {
    console.error('Error in Google Login:', error);
    res.status(400).json({ message: 'Google login failed', error: error.message });
  }
};