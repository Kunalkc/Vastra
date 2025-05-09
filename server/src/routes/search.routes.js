const express = require('express')
const router = express.Router()
const searchController = require('../controllers/search.controller')


router.get('/products', searchController.searchProducts);
router.get('/users', searchController.searchUsers);


module.exports = router
