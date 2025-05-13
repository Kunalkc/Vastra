import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import getUserId from "../utils/getuserid";


// we want to either pass the whole product file to props or just the id depending upon from where the component is being called 


export default function productTile(props) {


    const [loggeduserid, setLoggedUserId] = React.useState(null);

    React.useEffect(() => {
        const fetchId = async () => {
            const id = await getUserId();
            setLoggedUserId(id);
        };
        fetchId();
    }, []);

    const [product , setProduct]  = React.useState({})
    const [userlikesit , userlikes] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        if (props.product) {
            setProduct(props.product);
        } else if (props.productid) {
  
            const fetchProduct = async () => {
                try {
                    const res = await axios.get(`http://localhost:5001/api/products/prodbyid/${props.productid}`);
                    setProduct(res.data);
                } catch (err) {
                    console.error('Error getting user ID:', err);
                    throw err;
                }
            };
            fetchProduct();
        }
    }, [props.product, props.productid, userlikesit]);


    React.useEffect(()=>{
       
        const checklikestatus = async () => {
            try{
                const res = await axios.post("http://localhost:5001/api/products/checklike",{
                    productid: product._id,
                    userid : loggeduserid
                })
    
                userlikes(res.data.likes)
    
            }catch(err)
            {
                console.log("havent liked the  product" , err)
            }
        }

        if (loggeduserid && product._id) {
            checklikestatus();
          }
        

    })

    const deleteproduct = async (PID)=>{

        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;
    

        try{
             const res = await axios.delete(`http://localhost:5001/api/products/${PID}`)
             window.alert("Product deleted successfully!");
             props.rerenderstate()
        }catch(err){
            console.log("couldn't delete product" , err)
            window.alert("Failed to delete product. Please try again.");
            throw err;
        }
        
    }

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/products/prodbyid/${product._id}`);
            setProduct(res.data);
        } catch (err) {
            console.error('Error fetching updated product:', err);
        }
    };

    const like = async () =>{
        try{

            const res = await axios.post("http://localhost:5001/api/products/like" , {
                productid: product._id,
                userid : loggeduserid
            })
            userlikes(true)
            fetchProduct()
        }catch(err){

            console.log("couldn't like product" , err)
        }
    }

    const unlike = async () => {
        try{

            const res = await axios.post("http://localhost:5001/api/products/unlike" , {
                productid: product._id,
                userid : loggeduserid
            })
            userlikes(false)
            fetchProduct()
        }catch(err){

            console.log("couldn't like product" , err)
        }
    }

return(

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
          <p className="text-sm cursor-pointer hover:text-cyan-800"
               onClick={() => {
                console.log("navigating through the title");
                navigate(`/user/${props.user._id}`);
              }}
          >{props.user.username}</p>


              <h2 className="text-xl font-semibold mb-2">{product.Title}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2">
                  {product.description || 'No description available'}
              </p>
              <div className="flex justify-between items-center">
                  <span className="font-bold text-lg flex flex-row gap-1.5">
                     { userlikesit ? <img onClick={unlike} src={"/img/blackheart.svg"} width={25} height={8} className="hover:scale-105"/> :<img onClick={like} src={"/img/heart.svg"} width={25} height={8} className="hover:scale-105"/>}  {product.likes ? product.likes.length : null} 
                      
                  </span>
                  <div className="flex flex-row gap-4 justify-center items-center">

                     <button 
                         className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                         onClick={() => {navigate(`/products/prodbyid/${product._id}`)}}
                     >
                         View
                     </button>

                  {props.selfprofile ?   
                   <img src= "/img/trash.png"
                    width={20}
                    height={20}
                    className="hover:scale-105"
                    onClick={()=>deleteproduct(product._id)}
                    /> : <></>}

                  </div>
              </div>
          </div>
    </div>

            )
}