import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

 
export default function searchtab(props){

 const navigate = useNavigate()

console.log("searchbar is: " , props.isopen)

    const [products , toggleproduct] = React.useState(true)
    const [users , toggleusers] = React.useState(false)

    const [query, setQuery] = React.useState('')
    const [results , setResults] = React.useState([])

    console.log(query)
    console.log(results)

    const handlesearch = async () =>{
        console.log("handle sech called")
        try {
            const res = await axios.get(`http://localhost:5001/api/search/${products ? "products" : "users"}?q=${query}`);
            setResults(res.data);
          } catch (err) {
            console.error('Search failed', err);
          }
    }

    React.useEffect(() => {
        if (query.trim() !== '') {
            handlesearch();
          }

    },[products,users])

    return(
        <div className="fixed py-5 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[70%] h-[80%] bg-gray-800 z-10000 rounded-lg flex flex-col gap-4 justify-between items-center">
          <img src={"/img/cross.svg"} width={30} height={30} className='absolute top-2.5 right-2.5 hover:scale-105' onClick={()=>props.togglebar()} />


        <div className="relative w-[75%] flex flex-row justify-center p-0 m-0">
          <input
           type="text"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           className="w-[100%] h-10 bg-cyan-100 rounded-lg"
          />
          <img
             src="/img/searchbutton.svg" width={45} height={45}
             className="absolute right-2 top-0 rounded-2xl hover:scale-120 "
             onClick={handlesearch}
          />
        </div>

          <div className="w-[75%] relative flex flex-row justify-start gap-5 pl-1.5">

             <p onClick={()=>{
                toggleproduct(true)
                toggleusers(false)
             }} className={`rounded-md p-1 cursor-pointer ${products? "bg-gray-500" : "bg-gray-700"}`}>products</p>

             <p onClick={()=>{
                toggleproduct(false)
                toggleusers(true)
             }} 
             className={`rounded-md p-1 cursor-pointer ${users? "bg-gray-500" : "bg-gray-700"}`}>users</p>

          </div>

          <div className='w-[75%] h-[90%] bg-gray-700 rounded-lg flex flex-col gap-4 items-start px-5 pt-4 overflow-auto'>
             
         { results.length !== 0 ? <>
         
            {results.map(item =>{

              if(products){
                  return(<div
                    onClick={() => {
                        navigate(`/products/prodbyid/${item._id}`);
                        props.togglebar()

                }}
                  className="flex flex-row gap-1.5 h-10 justify-center items-center bg-gray-800 px-4 rounded-md hover:scale-105">
                  
                  <img
                     src={item.thumbnailurl}
                     className=" rounded-lg"
                     width={50}
                     height={50}
                  />
                  <p className="text-cyan-100">{item.Title}</p>
                
                  </div>)
              }

              if(users){
                return(<div 
                  onClick={() => {
                    navigate(`/user/${item._id}`);
                    props.togglebar()
                  }}
                  className="flex flex-row gap-1.5 h-10 justify-center items-center bg-gray-800 px-4 rounded-md hover:scale-105 cursor-pointer">
               
                    <img
                       src={item.profilePicture}
                       className=" rounded-lg"
                       width={50}
                       height={50}
                    />
                    <p className="text-cyan-100">{item.username}</p>
                  
                    </div>)
              }
 

            }

            )}

         </>: <></>

         }

          </div>
        </div>
    )
}