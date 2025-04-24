const express = require('express')
const router = express.Router()
const auctionController = require('../controllers/auction.controller')
const {requireAuth} = require('../middlewares/requireAuth')


router.get('/' , auctionController.getallitemsonauction)
router.get('/:id' , auctionController.getitembyid)
router.post('/', requireAuth ,  auctionController.setproductonsale)


module.exports = router