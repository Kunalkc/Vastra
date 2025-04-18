const express = require('express')
const router = express.Router()
const auctionController = require('../controllers/auction.controller')

router.get('/' , auctionController.getallitemsonauction)
router.get('/:id' , auctionController.getitembyid)
router.post('/', auctionController.setproductonsale)


module.exports = router