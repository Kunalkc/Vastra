import react from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Bottombar from './Bottombar'
import Header from './Header'
import ProductTile from './subcomponents/productTile'
import getUserId from './utils/getuserid'

const isloggedin = localStorage.getItem('token') !== null // if the value is null then it will store false and true in the alternative case

console.log(isloggedin)
export default function Home(props){

    const [id, changeid] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [userMap, setUserMap] = useState({}) // Map of email to user object
    const [currentUserEmail, setCurrentUserEmail] = useState(null)
    const navigate = useNavigate()

    // Get current user's email
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (isloggedin) {
                try {
                    const userId = await getUserId();
                    // Find the user's email from the userMap
                    const usersResponse = await axios.get(`http://localhost:5001/api/users/${userId}`);
                    if (usersResponse.data && usersResponse.data.email) {
                        setCurrentUserEmail(usersResponse.data.email);
                    }
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch all products and users when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                
                // Fetch all products
                const productsResponse = await axios.get('http://localhost:5001/api/products/')
                setProducts(productsResponse.data)
                
                // Fetch all users
                const usersResponse = await axios.get('http://localhost:5001/api/users/')
                
                // Create a map of email to user object
                const emailToUserMap = {}
                usersResponse.data.forEach(user => {
                    emailToUserMap[user.email] = user
                })
                
                setUserMap(emailToUserMap)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Function to get user object for a product
    const getUserForProduct = (product) => {
        return userMap[product.ownerID] || { 
            _id: 'unknown', 
            username: 'Unknown User',
            email: product.ownerID 
        }
    }

    // Filter out the user's own products
    const filteredProducts = currentUserEmail 
        ? products.filter(product => product.ownerID !== currentUserEmail)
        : products;

    return(
        <div className='bg-cyan-50 min-h-screen w-screen flex flex-col items-center'>
           <Header/>
            
           <div
           onClick={()=>navigate('/auction')} 
           className='relative w-[90%] h-1/8 bg-black top-20 rounded-2xl flex flex-col justify-center items-center hover:scale-102 mb-8'>
               <h1 className='text-center text-4xl text-cyan-100'>AUCTION FOR SELECT PRODUCTS LIVE NOW</h1>
           </div>

           {/* Product Feed */}
           <div className='relative w-[90%] mt-24 mb-24'>
               <h2 className='text-2xl font-bold mb-4'>Feed</h2>
               
               {loading ? (
                   <div className='flex justify-center items-center h-40'>
                       <p>Loading products...</p>
                   </div>
               ) : filteredProducts.length === 0 ? (
                   <div className='flex justify-center items-center h-40'>
                       <p>No products found</p>
                   </div>
               ) : (
                   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                       {filteredProducts.map(product => (
                           <ProductTile 
                               key={product._id} 
                               product={product} 
                               user={getUserForProduct(product)}
                           />
                       ))}
                   </div>
               )}
           </div>

           <Bottombar togglesearch = {props.togglesearch} />


        </div>
    )
}