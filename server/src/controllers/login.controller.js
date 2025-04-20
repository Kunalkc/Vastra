const jwt = require('jsonwebtoken')
const user = require('../models/users')
const bcrypt = require('bcrypt')

exports.loginWithemail = async (req , res) => {
    const {email , password}  = req.body

    const curruser = await user.findOne({email})

    if(!curruser || !curruser.password){
        return res.status(400).json({ message: "invalid credentials"})
    }

    const isMatch = await bcrypt.compare(password , curruser.password)

    if(!isMatch) return res.status(401).json({message: "invalid password"})

    const token = jwt.sign(
      {userId: curruser._id }, 
     process.env.JWT_SECRET,
      { expiresIn: '7d'}
    )

    res.json({token , user})
}



exports.registerWithEmail = async (req, res) => {
    const { email, password, username } = req.body;
  
    try {

    // checking for existing user
      const existingUser = await user.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

    // checking if username is taken or not
      const existingUser1 = await user.findOne({ username });
      if (existingUser1)
        return res.status(400).json({ message: "Username taken" });
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await user.create({
        email,
        username,
        password: hashedPassword,
      });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
  
      res.status(201).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  