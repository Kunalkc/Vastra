import react from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function bottombar(){



    const navigate = useNavigate()


    return(
        <div className='fixed p-1 bg-gray-700 bottom-0 w-[70%] h-10 rounded-t-lg flex flex-row justify-center items-center'>

         <div className=' w-[100%] md:w-[60%] flex flex-row gap-1.5 justify-between items-center'>
            <img src={"src/img/home.svg"} width={35} height={35} className='hover:scale-105' onClick={() => navigate('/home')}/>
            <img src={"src/img/auction.svg"} width={35} height={35} className='hover:scale-105' onClick={() => navigate('/auction')}/>
            <img src={"src/img/plus.svg"} width={30} height={30} className='hover:scale-105' onClick={() => navigate('/profile')}/>
            <img src={"src/img/mail.svg"} width={35} height={35} className='hover:scale-105' onClick={() => navigate('/profile')}/>
            <img src={"src/img/profile.svg"} width={30} height={30} className='hover:scale-105' onClick={() => navigate('/profile')}/>
          {/*   <a href="https://iconscout.com/icons/auction" class="text-underline font-size-sm" target="_blank">Auction</a> by <a href="https://iconscout.com/contributors/jemismali" class="text-underline font-size-sm" target="_blank">Jemis Mali</a> */}
         </div>       
        </div>
    )
}