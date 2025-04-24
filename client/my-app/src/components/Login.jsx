import react from 'react'
import { useState } from 'react'

export default function Login(){

    const [email , changeid] = useState('')
    const [password , changepassword] = useState('')
    const [error, setError] = useState('')

    console.log(email , password)

    return(
        <div className='box-border h-screen flex flex-col gap-10 justify-center items-center bg-gray-700'>
            <h1 className='text-cyan-100 text-8xl'>VASTRA</h1>
        <div className='p-5 box-border min-w-1/3 login-container w-auto bg-gray-500 rounded-4xl flex flex-col gap-3.5 items-center'>
           <form className='flex flex-col gap-3 '>
             <input
                 type='email'
                 placeholder='johndoe@gmail.com'
                 value={email}
                 onChange={(e) => changeid(e.target.value)}
                 className='bg-amber-50 flex flex-row justify-center'
             />
             <input
                 type='password'
                 placeholder='password'
                 value={password}
                 onChange={(e) => changepassword(e.target.value)}
                 className='bg-amber-50'
             />
             <button type='submit' className='bg-gray-700 text-cyan-100 rounded-xl'>Login</button>
           </form>
        </div>
        </div>
    )
}