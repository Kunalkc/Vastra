const user = require('../models/users')
const product = require('../models/Products')

exports.searchUsers = async (req , res) =>{
    try{
        const query = req.query.q;
        const results = await user.find({
            username: { $regex: query, $options: 'i' }
        });
        res.json(results);
    } catch(err){
        res.status(500).json({ error: 'User search failed' });
    }
}

exports.searchProducts = async (req , res) =>{
    try{
        const query = req.query.q;
        const results = await product.find({
          Title: { $regex: query, $options: 'i' }
        });
        res.json(results);

    } catch(err){
        res.status(500).json({ error: 'Product search failed' });
    }
}