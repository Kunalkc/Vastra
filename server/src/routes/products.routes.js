const express = require('express')
const router = express.Router()
const productController = require('../controllers/products.controller')
const reqauth = require('../middlewares/requireAuth')

router.get('/' , productController.viewallProducts)
router.post('/' , reqauth , productController.createProduct)
router.get('/:id', productController.getprodbyid )
router.put('/:id', reqauth,  productController.updateProduct);
router.delete('/:id', reqauth ,productController.deleteProduct);

module.exports = router