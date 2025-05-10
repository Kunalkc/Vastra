import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'


// we want to either pass the whole product file to props or just the id depending upon from where the component is being called 

export default function productTile(props) {

    const [product , setProduct]  = React.useState({})

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
    }, [props.product, props.productid]);

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

            )
}