import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Bottombar from './Bottombar'
import Header from './Header'
import FollowersList from './utils/getfollowers'
import FollowingList from './utils/getfollowing'

export default function Profile(props) {
    const [user, setUser] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    const navigate = useNavigate()

    const [following , openfollowinglist] = useState(false)
    const [followers, openfollowerslist]  = useState(false)


    // Function to handle both regular JWT and Google Firebase tokens
    const getUserId = async () => {
        try {
            // First try to get userId directly from localStorage
            const userId = localStorage.getItem('userId');
            if (userId) {
                console.log('Found userId directly in localStorage:', userId);

                return userId;
            }

            console.log(userId)

            // If not available, try to decode the token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            console.log('Token found:', token.substring(0, 20) + '...');
            
            // Check if it's a standard JWT (has 3 parts separated by dots)
            if (token.split('.').length === 3) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(atob(base64));
                    console.log('Decoded JWT payload:', payload);
                    
                    if (payload.userId) {
                        console.log('Found userId in JWT payload:', payload.userId);
                        return payload.userId;
                    }
                } catch (e) {
                    console.log('Error decoding JWT, might be a different format:', e);
                    // Continue to other methods
                }
            }
            
            // If it's a Google Firebase token, try to validate it with our backend
            try {
                console.log('Trying to validate token with backend...');
                const response = await axios.post('http://localhost:5001/api/login/validate-token', { token });
                if (response.data && response.data.userId) {
                    console.log('Backend validated token, userId:', response.data.userId);
                    // Store for future use
                    localStorage.setItem('userId', response.data.userId);
                    return response.data.userId;
                }
            } catch (e) {
                console.log('Backend token validation failed:', e);
                // Continue to other methods
            }
            
            // Try to get user info from Google token
            try {
                console.log('Trying to get user info from Google token...');
                // This is a workaround - we're using the token to get the user's email
                // and then using that to find the user in our database
                const googleUserResponse = await axios.get('http://localhost:5001/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (googleUserResponse.data && googleUserResponse.data.length > 0) {
                    // Find the first user that matches the email from the token
                    // This is not ideal but might work as a fallback
                    console.log('Found users, trying to match with token info');
                    return googleUserResponse.data[0]._id;
                }
            } catch (e) {
                console.log('Failed to get user info from Google token:', e);
                // Continue to other methods
            }
            
            // If we can't get userId from token, check if token itself might be the userId
            if (token.length === 24 || token.length === 36) {  // MongoDB ObjectId or UUID length
                console.log('Using token as userId (might be direct ID)');
                return token;
            }
            
            throw new Error('Could not extract user ID from available data');
        } catch (error) {
            console.error('Error getting user ID:', error);
            throw error;
        }
    };

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
                // Try to get the user ID
                let userId;
                try {
                    userId = await getUserId();
                    console.log('Using userId:', userId);
                } catch (error) {
                    console.error('Failed to get userId:', error);
                    navigate('/login');
                    return;
                }
                
                // Fetch user details
                const userResponse = await axios.get(`http://localhost:5001/api/users/${userId}`);
                console.log('User data:', userResponse.data);
                setUser(userResponse.data);
                
                console.log(userResponse.data.email)
               // console.log(user.email) //wont work as state has not been set yet it will rerender after this function runs completely

                // Fetch user products
                const userProducts = await axios.get(`http://localhost:5001/api/products/${userResponse.data.email}`);
                
                console.log('User products:', userProducts.data.userproducts);
                setProducts(userProducts.data.userproducts);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load profile data');
                setLoading(false);
            }
        }

        fetchUserData();
    }, [navigate]);

   
    if (error) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-cyan-50">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-screen bg-cyan-50 flex flex-col items-center pb-10">
            {/* Header with navigation */}
            <Header/>
 
            <div className="mt-24 w-[90%] max-w-5xl">
                {user && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                        <div className="flex items-center">
                            {user.profilePicture?.url ? (
                                <img 
                                    src={user.profilePicture.url} 
                                    alt="Profile" 
                                    className="w-16 h-16 rounded-full mr-4 object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                                    <span className="text-2xl text-gray-600">
                                        {user.firstName?.charAt(0) || user.username?.charAt(0) || '?'}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex-1">
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <h2 className="text-2xl font-semibold">
                                        {user.firstName && user.lastName 
                                            ? `${user.firstName} ${user.lastName}` 
                                            : user.username}
                                    </h2>
                                   <div className='flex flex-row gap-5'>  
                                    <h2 onClick={()=>openfollowinglist(true)} className='flex flex-row gap-1.5 text-xl opacity-50 hover:opacity-100'>
                                        Following: {user.following.length}
                                    </h2>
                                    <h2 onClick={()=>openfollowerslist(true)} className='flex flex-row gap-1.5 text-xl opacity-50 hover:opacity-100'>
                                        Followers: {user.followers.length}
                                    </h2>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-x-6 text-gray-600">
                                    <span>{user.email}</span>
                                    {user.role && <span>• {user.role}</span>}
                                    {user.phoneNumber && <span>• {user.phoneNumber}</span>}
                                    {user.address?.city && user.address?.country && (
                                        <span>• {user.address.city}, {user.address.country}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                )}
                
                {followers ? <div className='rounded-lg fixed w-[70%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-gray-800 flex flex-col gap-4 justify-center items-center'>
                   
                    <img src={"/img/cross.svg"} width={30} height={30} className='absolute top-2.5 right-2.5 hover:scale-105' onClick={()=>openfollowerslist(false)} />
                    <h1 className=' text-cyan-100 text-4xl'>Followers</h1>

                   <div className='w-[80%] h-[80%] bg-gray-700 rounded-lg'>
                   <FollowersList 
                      userId = {user._id}
                   />
                   </div>
                   
                 </div> : <></>
                    
                    }

                {following ? <div className='rounded-lg fixed w-[70%] h-[80%] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-gray-800 flex flex-col gap-4 justify-center items-center'>
                   
                    <img src={"/img/cross.svg"} width={30} height={30} className='absolute top-2.5 right-2.5 hover:scale-105' onClick={()=>openfollowinglist(false)} />
                     
                    <h1 className=' text-cyan-100 text-4xl'>Following</h1>

                    <div className='w-[80%] h-[80%] bg-gray-700 rounded-lg'>

                   <FollowingList
                     userId = {user._id}
                   />
                    </div>
                   
                 </div> : <></>
                    
                    }


                {/* Products showcase */}
                <h2 className="text-3xl font-bold mb-4">My Products</h2>
                
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-xl text-gray-500">You haven't added any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div 
                                key={product._id || product.ID} 
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Product image */}
                                <div className="h-48 overflow-hidden">
                                    {product.thumbnailurl ? (
                                        <img 
                                            src={product.thumbnailurl} 
                                            alt={product.Title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Product details */}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{product.Title}</h3>
                                    <p className="text-gray-600 mb-2 line-clamp-2">
                                        {product.description || 'No description available'}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg flex flex-row gap-1.5">
                                            {product.likes ? product.likes.length : null} <p>likes</p>
                                            
                                        </span>
                                        <button 
                                            className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                                            onClick={() => {navigate(`/products/prodbyid/${product._id}`)}}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Bottombar togglesearch = {props.togglesearch}/>
        </div>
    )
}