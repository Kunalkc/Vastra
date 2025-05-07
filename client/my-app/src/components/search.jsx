import React from "react";
import axios from "axios";

 
export default function searchtab(props){

console.log("searchbar is: " , props.isopen)


    return(
        <div className="fixed py-5 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[70%] h-[80%] bg-gray-800 z-10000 rounded-lg flex flex-col gap-4 justify-between items-center">
                                 <img src={"/img/cross.svg"} width={30} height={30} className='absolute top-2.5 right-2.5 hover:scale-105' onClick={()=>props.togglebar()} />


          <input
           type="text"
           className="w-[75%] h-[10%] bg-cyan-100 rounded-lg"
          />
          
          <div className='w-[75%] h-[90%] bg-gray-700 rounded-lg'>
             
          </div>
        </div>
    )
}