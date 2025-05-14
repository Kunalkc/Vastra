import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Bottombar from './Bottombar'
import Header from './Header'
import getUserId from './utils/getuserid'
import ProductTile from './subcomponents/productTile'

export default function Auction(props) {
    const [auctionItems, setAuctionItems] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [userId, setUserId] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [bidAmounts, setBidAmounts] = useState({})
    const [bidStatus, setBidStatus] = useState({})
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    const navigate = useNavigate()

    // Fetch user ID and user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
                
                // Fetch complete user information
                const userResponse = await axios.get(`http://localhost:5001/api/users/${id}`);
                setCurrentUser(userResponse.data);
            } catch (err) {
                console.error('Error getting user data:', err);
                setError('Failed to authenticate user. Please log in again.');
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    // Fetch all auction items and their products
    useEffect(() => {
        const fetchAuctionItems = async () => {
            try {
                setLoading(true);
                
                // Fetch all auction items
                const response = await axios.get('http://localhost:5001/api/auction');
                setAuctionItems(response.data);
                
                console.log(response.data)

                // Initialize bid amounts for each auction item
                const initialBidAmounts = {};
                response.data.forEach(item => {
                    initialBidAmounts[item._id] = item.highestbid + 1; // Default to current highest bid + 1
                });
                setBidAmounts(initialBidAmounts);
                
                // Fetch product details for each auction item
                const productPromises = response.data.map(item =>
                    axios.get(`http://localhost:5001/api/products/prodbyid/${item.product}`)
                );
                
                const productResponses = await Promise.all(productPromises);
                const productData = productResponses.map(res => res.data);
                setProducts(productData);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching auction items:', err);
                setError('Failed to load auction items. Please try again later.');
                setLoading(false);
            }
        };

        fetchAuctionItems();
    }, [refreshTrigger]);

    // Handle bid amount change
    const handleBidAmountChange = (auctionId, amount) => {
        setBidAmounts(prev => ({
            ...prev,
            [auctionId]: amount
        }));
    };

    // Handle bid submission
    const handleBidSubmit = async (auctionId, productId) => {
        try {
            const bidAmount = bidAmounts[auctionId];
            
            // Validate bid amount
            if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
                setBidStatus({
                    [auctionId]: {
                        success: false,
                        message: 'Please enter a valid bid amount'
                    }
                });
                return;
            }

            const response = await axios.put('http://localhost:5001/api/auction', {
                productid: productId,
                bid: bidAmount,
                userid: userId
            });

            // Update bid status with response message
            setBidStatus({
                [auctionId]: {
                    success: true,
                    message: response.data.message
                }
            });

            // Refresh auction items after successful bid
            setRefreshTrigger(prev => !prev);
            
            // Clear bid status after 3 seconds
            setTimeout(() => {
                setBidStatus(prev => {
                    const newStatus = {...prev};
                    delete newStatus[auctionId];
                    return newStatus;
                });
            }, 3000);
        } catch (err) {
            console.error('Error submitting bid:', err);
            setBidStatus({
                [auctionId]: {
                    success: false,
                    message: err.response?.data?.error || 'Failed to submit bid. Please try again.'
                }
            });
        }
    };

    // Find auction item for a product
    const findAuctionForProduct = (productId) => {
        return auctionItems.find(item => item.product === productId);
    };

    if (loading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-cyan-50">
                <div className="text-2xl">Loading auction items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-cyan-50">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen bg-cyan-50 flex flex-col items-center pb-16">
            <Header />
            
            <div className="mt-24 w-[90%] max-w-5xl">
                <h1 className="text-4xl font-bold mb-6">Auction Items</h1>
                
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-xl text-gray-500">No items currently on auction.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => {
                            const auctionItem = findAuctionForProduct(product._id);
                            
                            if (!auctionItem) return null;
                            
                            return (
                                <div key={auctionItem._id} className="relative">
                            
                                    {/* Product Tile */}
                                    <ProductTile 
                                        product={product}
                                        selfprofile={false}
                                        user={currentUser}
                                    />
                                    
                                    {/* Auction Details and Bidding Interface */}
                                    <div className="mt-2 p-4 bg-white rounded-xl shadow-md">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">Current Bid:</span>
                                            <span className="font-bold">₹{auctionItem.highestbid}</span>
                                        </div>
                                        <div className="flex justify-between mb-3">
                                            <span className="font-medium">Total Bids:</span>
                                            <span>{auctionItem.totalbids}</span>
                                        </div>
                                        
                                        {/* Bidding interface */}
                                        <div className="mt-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min={auctionItem.highestbid + 1}
                                                    value={bidAmounts[auctionItem._id] || ''}
                                                    onChange={(e) => handleBidAmountChange(auctionItem._id, e.target.value)}
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                                    placeholder="Enter bid amount"
                                                />
                                                <button
                                                    onClick={() => handleBidSubmit(auctionItem._id, product._id)}
                                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                                >
                                                    Place Bid
                                                </button>
                                            </div>
                                            
                                            {/* Bid status message */}
                                            {bidStatus[auctionItem._id] && (
                                                <div className={`mt-2 p-2 rounded-lg text-sm ${
                                                    bidStatus[auctionItem._id].success 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {bidStatus[auctionItem._id].message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <Bottombar togglesearch={props.togglesearch} />
        </div>
    );
}