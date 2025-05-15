import react from 'react'
import { useState } from 'react'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase-config"; // adjust the path according to your project

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login(){

    const [email , changeid] = useState('')
    const [password , changepassword] = useState('')
    const [error, setError] = useState('')
    const [sign , setsignup] = useState(false)
    const [username , setusername] = useState('')

    console.log(email , password)

    const navigate = useNavigate()

    const handlesubmit = async(e)=> {

      e.preventDefault();
      console.log("handle submit called")

      try {
       const res = await axios.post('http://localhost:5001/api/login/login', {
         email,
         password
       });
 
       console.log(res.data.token)
       localStorage.setItem('token', res.data.token);

       if (res.data.curruser && res.data.curruser._id) {
        localStorage.setItem('userId', res.data.curruser._id);
      }

       alert('Login successful!');
       navigate('/home')

      }catch (err) {
       setError(err.response?.data?.message || 'Login failed');
       alert(err.response?.data?.message )
      }
   }

    const signup = async(e)=>{
        
      try{
        const res = await axios.post('http://localhost:5001/api/users/' , {
          email,
          password,
          username,
        })

        console.log(res)
        alert('signup successful!');

      }catch(err)
      {
        setError(err.response?.data?.message || 'signup failed');
        alert(err.response?.data?.message )
      }
    }

    const handleGoogleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
      
          // user.email, user.displayName etc are now available
          console.log('Google user:', user);
      
          const googleToken = await user.getIdToken(); // This is the Google JWT
      
          console.log('Google Token:', googleToken);
      
          const res = await axios.post('http://localhost:5001/api/login/google-login', {
            token: googleToken,
          });
      
          // Store the JWT token from our backend, not the Google token
          if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token);
            
            // Also store the user ID for easier access
            if (res.data.user && res.data.user._id) {
              localStorage.setItem('userId', res.data.user._id);
            }
          } else {
            // Fallback: store the Google token if our backend doesn't return a token
            console.log('Backend did not return a token, using Google token as fallback');
            localStorage.setItem('token', googleToken);
          }
          
          alert('Google login successful!');
          navigate('/home');
      
        } catch (error) {
          console.error('Google login error', error);
          alert('Google login failed');
        }
      };

 /*    const handleGoogleLogin = async (credentialResponse) => {
        const { credential } = credentialResponse;
    
        try {
          const res = await axios.post('http://localhost:5001/api/login/google', {
            token: credential
          });
    
          localStorage.setItem('token', res.data.token);
          alert('Google login successful!');
          navigate('/home')

          
        } catch (err) {
          alert('Google login failed');
          console.error(err);
        }
    };
 */
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
             { sign ?  <input
                 type='text'
                 placeholder='username'
                 value={username}
                 onChange={(e) => setusername(e.target.value)}
                 className='bg-amber-50'
             /> : <></>

             }
             <div className='flex flex-row gap-4'>
           { sign ? <></>: <button type='submit' onClick = {handlesubmit} className='bg-gray-700 text-cyan-100 rounded-xl w-1/2 self-center'>Login</button>}
            { sign ? <button type='button' onClick = {()=>setsignup(false)} className='bg-gray-700 text-cyan-100 rounded-xl w-1/2 self-center'>back</button> : <></>}
          { sign ? <></> : <button  type="button" onClick = {()=>setsignup(true)} className='bg-gray-700 text-cyan-100 rounded-xl w-1/2 self-center'>Sign Up </button>}
          {  sign ?  <button  type="button" onClick = {signup} className='bg-gray-700 text-cyan-100 rounded-xl w-1/2 self-center'>Sign Up </button> : <></>}
             </div>
           </form>

           <div className="mt-2">

           <button onClick={handleGoogleLogin} 
             className="bg-amber-50 w-auto p-1 text-black text-nowrap rounded-xl self-center  hover:bg-cyan-100">
           Google login
          </button>


        </div>

        </div>
        </div>
    )
}