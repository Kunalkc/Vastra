const express = require('express')
const router = express.Router()
const productController = require('../controllers/products.controller')

router.get('/' , productController.viewallProducts)
router.post('/' , productController.createProduct)
router.get('/:id', productController.getprodbyid )
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router