import react from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bottombar from './Bottombar'
import Header from './Header'

const isloggedin = localStorage.getItem('token') !== null // if the value is null then it will store false and true in the alternative case

console.log(isloggedin)
export default function Home(props){

    const [id , changeid] = useState('')
    const navigate = useNavigate()

    return(
        <div className='bg-cyan-50 h-screen w-screen flex flex-col items-center'>
           <Header/>
            
           <div className='relative w-[90%] h-1/2 bg-black top-20 rounded-2xl'></div>

           <Bottombar togglesearch = {props.togglesearch} />


        </div>
    )
}