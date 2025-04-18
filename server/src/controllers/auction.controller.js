const auctionitem = require('../models/Auction')

exports.getallitemsonauction = async (req,res) => {
    try{
        const allitems = await auctionitem.find()
        res.json(allitems);
    }catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

exports.getitembyid = async (req,res) => {
    try{
        const id = req.params.id
        const item = await auctionitem.findById(id)

        if(!item){
            res.status(404).json({ error: "item not found"});
        }

        res.json(item);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.setproductonsale = async (req,res) => {
    try{
         const newitem = new auctionitem(req.body)
         await newitem.save()
         res.status(201).json({ message: 'item set on sale', auctionitem: newitem })
    }catch(err){
        res.status(400).json({ error : err.message})
    }
}