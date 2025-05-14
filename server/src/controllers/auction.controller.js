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


exports.setproductonsale = async (req, res) => {
    try {
        const { product, highestbid, highestbidder } = req.body;

        // Basic validation
        if (!product || !highestbid || !highestbidder) {
            return res.status(400).json({ error: "Product ID, highest bid, and bidder are required" });
        }

        const newAuction = new auctionitem({
            product,
            highestbid,
            highestbidder,
            totalbids: 1 
        });

        await newAuction.save();

        res.status(201).json({ message: 'Product set on auction', auction: newAuction });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.handlebid = async (req, res) => {
    try {
        const { productid, bid, userid } = req.body;

        if (!productid || !bid || !userid) {
            return res.status(400).json({ error: "productid, bid, and userid are required." });
        }

        let auction = await auctionitem.findOne({ product: productid });

      
        if (!auction) {
            return res.status(200).json({ message: "product is not on auction", auction });
        }

        auction.totalbids = (auction.totalbids || 0) + 1;

        if (bid > auction.highestbid) {
            auction.highestbid = bid;
            auction.highestbidder = userid;
            await auction.save();
            return res.status(200).json({ message: "You are the highest bidder", auction });
        } else {
            await auction.save();
            return res.status(200).json({ message: "Bid recorded, but not the highest", auction });
        }

    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};