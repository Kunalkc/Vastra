const express = require('express')
const router = express.Router()
const productController = require('../controllers/products.controller')
const {requireAuth} = require('../middlewares/requireAuth')

router.get('/' , productController.viewallProducts)
router.post('/' , /* requireAuth , */ productController.createProduct)
router.get('/:id', productController.getprodbyuser )
router.get('/prodbyid/:id'    , productController.getprodbyid)
router.put('/:id', requireAuth,  productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.post('/like' , productController.userlikespost)
router.post('/unlike' , productController.userunlikespost)
router.post('/checklike' , productController.checkifliked)

module.exports = router