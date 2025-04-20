const product = require('../models/Products')
const user = require('../models/users')

exports.viewallProducts = async (req,res) => {
    try {
      const products = await product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
}

exports.createProduct = async (req,res) => {
    try{
        const newProd = new product(req.body)
        await newProd.save()
        res.status(201).json({ message: 'product created successfully', product: newProd })
    }catch(err){
        res.status(400).json({ error : err.message})
    }
}

exports.getprodbyid = async (req,res) => {
    try{
        const prodID = req.params.id

        const foundproduct =  await product.findById(prodID)

        if (!foundproduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        
        res.status(200).json(foundproduct);
    }catch(error){
        res.status(500).json({ error : error.message})
    }
}


exports.updateProduct = async (req, res) => {
    try {
      const ID = req.params.id;
      const updates = req.body;
  
      const thisproduct = await product.findById(ID);
      if (!thisproduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (key === "theme" && typeof value === "object") {
            thisproduct.theme = { ...thisproduct.theme, ...value }; // merge theme updates
        } else {
            thisproduct[key] = value;
        }
      });
  
      await thisproduct.save(); // triggers pre-save hook for currency conversion
      res.json({ message: "Product updated", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  exports.deleteProduct = async (req, res) => {
    try {
      const ID = req.params.id;
  
      const delproduct = await product.findById(ID);

     if(!delproduct) {
        return res.status(404).json({ message: "Product not found" });
     }

      await product.deleteOne();

      res.json({ message: "Product deleted successfully" });
    }  catch (err) {
       console.error(err);
       res.status(500).json({ message: "Server error", error: err.message });
    }
};