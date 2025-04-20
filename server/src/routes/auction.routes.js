const express = require('express')
const router = express.Router()
const auctionController = require('../controllers/auction.controller')
const reqauth = require('../middlewares/requireAuth')

router.get('/' , auctionController.getallitemsonauction)
router.get('/:id' , auctionController.getitembyid)
router.post('/', reqauth ,  auctionController.setproductonsale)


module.exports = router