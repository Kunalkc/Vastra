const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')

router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.patch('/:id/deactivate', userController.deactivateAccount);

module.exports = router