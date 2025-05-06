import React from "react"
import Bottombar from './Bottombar';
import { useParams } from 'react-router-dom'
import axios from 'axios'


export default function ViewProduct(){

     const { productId } = useParams()
     const [product, setProduct] = React.useState(null)
     const [loading, setLoading] = React.useState(true)
     const [error, setError] = React.useState('')
     const [theme, settheme] = React.useState('#a69c9c')

    
    React.useEffect( () =>{
 
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/products/prodbyid/${productId}`)
                setProduct(res.data)
               
                settheme(res.data.theme)
                setLoading(false)
            } catch (err) {
                setError('Failed to fetch product')
                setLoading(false)
            }
        }

        fetchProduct()
        
    } , [productId])


       return (
        <div className="w-screen h-screen overflow-auto" style={{ backgroundColor: theme }}>
          
            {product && product.layout && product.layout.map((item, index) => (
             
            <>
               {item.type === 'image' && (
                <img 
                  src={item.url} 
                  alt={item.alt || 'layout image'} 
                  className="absolute w-full h-full object-cover rounded pointer-events-none z-9"
                      style={{
                        zIndex: item.zIndex,
                        top: item.y,
                        left: item.x,
                        width: item.width,
                        height: item.height,

                      }}
                />
              )}

              {item.type === 'text' && (
                <div 
                className="absolute w-auto h-auto p-2 bg-transparent whitespace-pre-wrap wrap-break-word overflow-visible" 
                style={{
                    top: item.y,
                    left: item.x,
                    width: item.width,
                    height: item.height,
                    color: item.textColor,
                    fontFamily: item.fontfamily,
                    fontSize: `${item.fontSize}px`,
                    zIndex: item.zIndex,
                  }}
                >
                    {item.content}
                    
                </div>
              )}
          </>   
         
))}
            
            
        <Bottombar/>
    </div>
       )


}