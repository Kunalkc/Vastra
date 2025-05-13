const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')
const {requireAuth} = require('../middlewares/requireAuth')


router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUserById);
router.put('/:id',   userController.updateUser);
router.delete('/:id', requireAuth ,userController.deleteUser);
router.get('/followers/:id', userController.getfollowers)
router.get('/following/:id', userController.getfollowing)


router.post('/follow' , userController.addFollower)
router.post('/unfollow' , userController.removefollower)
router.post('/checkfollow' , userController.checkififollowthisperson)


router.patch('/:id/deactivate', userController.deactivateAccount);

module.exports = router