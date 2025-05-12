import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Bottombar from './Bottombar'
import Header from './Header'
import FollowersList from './utils/getfollowers'
import FollowingList from './utils/getfollowing'
import ProductTile from './subcomponents/productTile'
import NameTile from './subcomponents/nameTile'
import getUser from './utils/getuserid'

const loggeduserid = await getUser()

export default function otheruserprofile(props){
    
    const { userid } = useParams()

    const [following , openfollowinglist] = useState(false)
    const [followers, openfollowerslist]  = useState(false)
    const [user, setUser] = useState(null)
    const [products, setProducts] = useState([])

    // this user page needs to verify if the current user is the same as the one he is trying to open if so then open profile page , or else otherprofile interface and if not logged in then also 
    const [ownProfile , setProfindicator] = useState(false)
     
    console.log('user id of user that is logged in is',loggeduserid , 'and id of user we are trying to open is' , userid , ' and result of whether they equate is' , ownProfile)
  
    useEffect(()=>{
       if(userid === loggeduserid){
        setProfindicator(true)
       }
    }, [userid,loggeduserid])
    
    const navigate = useNavigate()

    if(ownProfile){
        navigate('/profile')
    }

    

    // using the user id in params to fetch details of the user
    useEffect(() => {
      
        const fetchUserData = async () => {
            try {                
                const userResponse = await axios.get(`http://localhost:5001/api/users/${userid}`);
                setUser(userResponse.data);
                const userProducts = await axios.get(`http://localhost:5001/api/products/${userResponse.data.email}`);
                setProducts(userProducts.data.userproducts);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load profile data');
            }
        }
        fetchUserData();
    }, [navigate]);


    return(
        <div className="min-h-screen w-screen bg-cyan-50 flex flex-col items-center pb-10">
        {/* Header with navigation */}
        <Header/>

        <div className="mt-24 w-[90%] max-w-5xl">
            {user && (
                
                <NameTile
                  user = {user}
                  openfollowinglist = {openfollowinglist}
                  openfollowerslist = {openfollowerslist}
                  selfprofile = {ownProfile}
                />

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
            <h2 className="text-3xl font-bold mb-4">Products</h2>
            
            {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-xl text-gray-500">User has not added any products yet.</p> 
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (

                        <ProductTile 
                        key={product._id} 
                        product = {product}
                        user = {user}
                        selfprofile = {ownProfile}
                        />
                       
                    ))}
                </div>
            )}
        </div>
        <Bottombar togglesearch = {props.togglesearch}/>
    </div>
    )
}


