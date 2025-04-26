import react from 'react'
import { useState } from 'react'

const isloggedin = localStorage.getItem('token') !== null // if the value is null then it will store false and true in the alternative case

console.log(isloggedin)
export default function Home(){

    const [id , changeid] = useState('')

    return(
        <div className='bg-cyan-50 h-screen w-screen flex flex-col items-center'>
           <div className='fixed top-0 h-15 w-screen bg-gray-700 rounded-b-2xl shadow-lg shadow-black flex flex-row justify-between items-center'>
                   <h1 className='text-cyan-100 text-5xl pl-2'>VASTRA</h1>
                  { isloggedin ? <button className='bg-amber-50 rounded-2xl text-2xl h-10 mr-4 p-1 hover:scale-105 hover:shadow-2xs'>profile</button> :<button className='bg-amber-50 rounded-2xl text-2xl h-10 mr-4 p-1'>login</button>}
           </div>
            
           <div className='relative w-[90%] h-1/2 bg-black top-20 rounded-2xl'></div>




        </div>
    )
}