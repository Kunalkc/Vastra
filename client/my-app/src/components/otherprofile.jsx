import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Bottombar from './Bottombar'
import Header from './Header'
import FollowersList from './utils/getfollowers'
import FollowingList from './utils/getfollowing'
import ProductTile from './subcomponents/productTile'


export default function otheruserprofile(props){
    
    const { userid } = useParams()

    const [following , openfollowinglist] = useState(false)
    const [followers, openfollowerslist]  = useState(false)
    const [user, setUser] = useState(null)
    const [products, setProducts] = useState([])

    console.log(userid)

    const navigate = useNavigate()

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {                
                // Fetch user details
                const userResponse = await axios.get(`http://localhost:5001/api/users/${userid}`);
                console.log('User data:', userResponse.data);
                setUser(userResponse.data);
                
                console.log(userResponse.data.email)
               // console.log(user.email) //wont work as state has not been set yet it will rerender after this function runs completely

                // Fetch user products
                const userProducts = await axios.get(`http://localhost:5001/api/products/${userResponse.data.email}`);
                
                console.log('User products:', userProducts.data.userproducts);
                setProducts(userProducts.data.userproducts);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load profile data');
            }
        }

        fetchUserData();
    }, [navigate]);

    return(
        <></>
    )
}


