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

        const user = await user.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.products.push({ PID });
        await user.save();

        res.status(200).json({ message: 'Product added to user', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deactivate account 
exports.deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user
        const user = await user.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Deactivate the account (soft delete)
        user.accountStatus = 'deactivated';

        // Save the user document
        await user.save();

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
        const user = await user.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        user.profilePicture = profilePicture || user.profilePicture;
        user.currencypreference = currencypreference || user.currencypreference

        // Save the updated user
        await user.save();
        
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};