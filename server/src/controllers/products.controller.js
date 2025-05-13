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
        console.log('product created')
    }catch(err){
        res.status(400).json({ error : err.message})
    }

    // we need to add the logic to upload to cloudinary
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

     await delproduct.deleteOne(); 

      res.json({ message: "Product deleted successfully" });
    }  catch (err) {
       console.error(err);
       res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getprodbyuser = async (req,res) => {
     try{
          const userID = req.params.id
          const userproducts = await product.find({ownerID : userID})

          if(userproducts.length ===  0){
            return res.status(404).json({message: "user has not added any products yet"})
          }

          res.json({message:"products fetched successfully" , userproducts })

     }catch(err){ 
      console.error(err)
      res.status(500).json({message: "couldn't fetch products" , error: err.message})
     }

}



exports.userlikespost = async (req, res) => {
  const { userid, productid } = req.body;

  console.log("in user likes",userid, productid)
  try {
    if (!userid || !productid) {
      return res.status(400).json({ message: "Missing userid or productid" });
    }

    const thisproduct = await product.findById(productid);
    if (!thisproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!thisproduct.likes.some(f => f.likedby === userid)) {
      thisproduct.likes.push({ likedby: userid });
      await thisproduct.save();
    }

    res.json({ message: "Post liked successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't like post", error: err.message });
  }
};


exports.userunlikespost = async (req, res) => {
  const { userid, productid } = req.body;
  console.log("unlikes",userid, productid)
  try {
    if (!userid || !productid) {
      return res.status(400).json({ message: "Missing userid or productid" });
    }

    const thisproduct = await product.findById(productid);
    if (!thisproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    thisproduct.likes = thisproduct.likes.filter(f => f.likedby !== userid);
    await thisproduct.save();

    res.json({ message: "Post unliked successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't unlike post", error: err.message });
  }
};

exports.checkifliked = async (req ,res) => {
  const { userid, productid } = req.body;

  console.log("liked" , userid , productid)
  try {
    if (!userid || !productid) {
      return res.status(400).json({ message: "Missing userid or productid" });
    }

    const thisproduct = await product.findById(productid);
    if (!thisproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const likes = thisproduct.likes.some(f => f.likedby === userid)

     return res.status(200).json({
       message: likes ? "You like this post" : "You don't like this post",
       likes: likes
     })

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't get info", error: err.message });
  }
}