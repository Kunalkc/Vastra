const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')
const reqauth = require('../middlewares/requireAuth')


router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUserById);
router.put('/:id', reqauth ,  userController.updateUser);
router.delete('/:id', reqauth , userController.deleteUser);

router.patch('/:id/deactivate', userController.deactivateAccount);

module.exports = router