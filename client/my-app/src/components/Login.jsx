import react from 'react'
import { useState } from 'react'
import axios from 'axios'

export default function Login(){

    const [email , changeid] = useState('')
    const [password , changepassword] = useState('')
    const [error, setError] = useState('')

    console.log(email , password)

    const handlesubmit = async(e)=> {

       e.preventDefault();
       console.log("handle submit called")

       try {
        const res = await axios.post('http://localhost:5001/api/login/login', {
          email,
          password
        });
  
        localStorage.setItem('token', res.data.token);
        alert('Login successful!');

        // Navigate to home page or dashboard here
       }catch (err) {
        setError(err.response?.data?.message || 'Login failed');
        alert(err.response?.data?.message )
       }
    }

    return(
        <div className='box-border h-screen flex flex-col gap-10 justify-center items-center bg-gray-700'>
            <h1 className='text-cyan-100 select-none text-8xl'>VASTRA</h1>
        <div className='p-5 box-border min-w-1/3 login-container w-auto bg-gray-500 rounded-2xl flex flex-col gap-3.5 items-center'>
           <form className='w-[95%] flex flex-col gap-3'>
             <input
                 type='email'
                 placeholder='johndoe@gmail.com'
                 value={email}
                 onChange={(e) => changeid(e.target.value)}
                 className='bg-amber-50 '
             />
             <input
                 type='password'
                 placeholder='password'
                 value={password}
                 onChange={(e) => changepassword(e.target.value)}
                 className='bg-amber-50'
             />
             <button type='submit' onClick = {handlesubmit} className='bg-gray-700 text-cyan-100 rounded-xl w-1/2 self-center'>Login</button>
           </form>
        </div>
        </div>
    )
}