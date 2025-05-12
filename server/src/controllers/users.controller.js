const user = require('../models/users')


exports.getAllUsers = async (req, res) => {
    try {
      const users = await user.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
};


exports.createUser = async (req, res) => {
    try {
        const newUser = new user(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// query user 
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;  // Get the userId from the URL params

        // Find the user by userId
        const finduser = await user.findById(userId);

        // If no user found, send a 404 response
        if (!finduser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user is found, send the user data in response
        res.status(200).json(finduser);
    } catch (error) {
        // Handle errors and send appropriate response
        res.status(500).json({ error: error.message });
    }
};


//deleteuser
exports.deleteUser = async (req, res) => {
    try {
        await user.findByIdAndDelete(req.user.userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// add user who starts to follow this user
exports.addFollow = async (req, res) => {
    try {
        const { userId, otherUserId } = req.body;

        // Find both users
        const firstuser = await user.findById(userId);
        const otherUser = await user.findById(otherUserId);

        if (!user || !otherUser) {
            return res.status(404).json({ message: 'User(s) not found' });
        }

        // Add user to the other's follower/following list
        firstuser.following.push({ id: otherUserId });
        otherUser.followers.push({ id: userId });

        // Save both user documents
        await firstuser.save();
        await otherUser.save();

        res.status(200).json({ message: 'Follow action successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// add product to the list of products by the user
exports.addProductToUser = async (req, res) => {
    try {
        const { userId, PID } = req.body;

        const thisuser = await user.findById(userId);
        if (!thisuser) return res.status(404).json({ message: 'User not found' });

        thisuser.products.push({ PID });
        await thisuser.save();

        res.status(200).json({ message: 'Product added to user', thisuser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deactivate account 
exports.deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user
        const thisuser = await user.findById(userId);

        if (!thisuser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Deactivate the account (soft delete)
        thisuser.accountStatus = 'deactivated';

        // Save the user document
        await thisuser.save();

        res.status(200).json({ message: 'Account deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// update user profile
exports.updateUser = async (req, res) => {
    try {
        const  userId  = req.user.userId;
        const { firstName, lastName, email, phoneNumber, address, profilePicture , currencypreference } = req.body;

        // Find user by userId
        const thisuser = await user.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile fields
        thisuser.firstName = firstName || thisuser.firstName;
        thisuser.lastName = lastName || thisuser.lastName;
        thisuser.email = email || thisuser.email;
        thisuser.phoneNumber = phoneNumber || thisuser.phoneNumber;
        thisuser.address = address || thisuser.address;
        thisuser.profilePicture = profilePicture || thisuser.profilePicture;
        thisuser.currencypreference = currencypreference || thisuser.currencypreference

        // Save the updated user
        await thisuser.save();
        
        res.status(200).json({ message: 'Profile updated successfully', thisuser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getfollowers = async (req , res) => {

    try{
        const  userId  = req.params.id;
        const thisuser = await user.findById(userId);

        if(!thisuser){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(thisuser.followers)

    } catch (error) {
        res,status(500).json({error: error.message})
    }
}

exports.getfollowing = async (req , res) => {

    try{
        const  userId  = req.params.id;
        const thisuser = await user.findById(userId);

        if(!thisuser){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(thisuser.following)

    }catch (error) {
        res,status(500).json({error: error.message})
    }
}


exports.addFollower = async (req , res) => {
    const { loggeduserid, userid  } = req.body;

    try {
      if (!loggeduserid || !userid) {
        return res.status(400).json({ message: "Missing followerId or followeeId" });
      }
  
      const follower = await user.findById(loggeduserid);
      const followee = await user.findById(userid);
  
      if (!follower || !followee) {
        return res.status(404).json({ message: "User(s) not found" });
      }
  
      if (!followee.followers.some(f => f.id === loggeduserid)) {
        followee.followers.push({
          id: loggeduserid,
        });
        await followee.save();
      }

      if (!follower.following.some(f => f.id === userid)) {
        follower.following.push({
          id: userid,
        });
        await follower.save();
      }
  
      res.json({ message: "Followed successfully" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.removefollower = async (req , res ) => {
    const { loggeduserid, userid } = req.body;

    try {
      if (!loggeduserid || !userid) {
        return res.status(400).json({ message: "Missing followerId or followeeId" });
      }
  
      const follower = await user.findById(loggeduserid);
      const followee = await user.findById(userid);
  
      if (!follower || !followee) {
        return res.status(404).json({ message: "User(s) not found" });
      }
  
      followee.followers = followee.followers.filter(f => f.id !== loggeduserid);
      await followee.save();
  
      follower.following = follower.following.filter(f => f.id !== userid);
      await follower.save();
  
      res.json({ message: "Unfollowed successfully" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.checkififollowthisperson = async(req , res) => {
    const { loggeduserid, userid } = req.body;

    try {
      if (!loggeduserid || !userid) {
        return res.status(400).json({ message: "Missing followerId or followeeId" });
      }
  
      const checkfor = await user.findById(loggeduserid);
      const followee = await user.findById(userid);
  
      if (!checkfor || !followee) {
        return res.status(404).json({ message: "User(s) not found" });
      }
  
      const follows = checkfor.following.some(f => f.id === userid);

     return res.status(200).json({
       message: follows ? "You follow this person" : "You don't follow this person",
       follows: follows
     });

    }catch (err) {
        console.error("Error checking follow status:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
      }
}