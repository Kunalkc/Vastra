import react from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bottombar from './Bottombar'
import Header from './Header'

export default function Auction(props){

    const [id , changeid] = useState('')

    return(
       <div className='bg-cyan-50 h-screen w-screen flex flex-col items-center'>
                  <Header/>
                   
                
       
                  <Bottombar togglesearch = {props.togglesearch} />
       
       
               </div>
    )
}