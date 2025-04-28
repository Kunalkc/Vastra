import react from "react"
import { useNavigate } from 'react-router-dom'



export default function Header(){

    const navigate = useNavigate()

    return(
        <div className='fixed top-0 h-15 w-screen bg-gray-700 rounded-b-2xl shadow-lg shadow-black flex flex-row justify-between items-center'>
                   <h1 onClick={ () => navigate('/home')} className='text-cyan-100 text-5xl pl-2 cursor-pointer'>VASTRA</h1>
                   <img src={"src/img/mail.svg"} width={35} height={35} className='mx-4 hover:scale-105 ' onClick={() => navigate('/profile')}/>
           </div>
    )
}