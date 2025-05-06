import react from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export default function bottombar(){
 
    const navigate = useNavigate()
    
    const Checklogin = async () => {
        let userId;
        try {
            userId = await getUserId();
            console.log('Using userId:', userId);
            return true
        } catch (error) {
            console.error('Failed to get userId:', error);
            return false;
        }

        return false
    }

    const getUserId = async () => {
        try {
            // First try to get userId directly from localStorage
            const userId = localStorage.getItem('userId');
            if (userId) {
                console.log('Found userId directly in localStorage:', userId);
                return userId;
            }

            console.log(userId)

            // If not available, try to decode the token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            console.log('Token found:', token.substring(0, 20) + '...');
            
            // Check if it's a standard JWT (has 3 parts separated by dots)
            if (token.split('.').length === 3) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(atob(base64));
                    console.log('Decoded JWT payload:', payload);
                    
                    if (payload.userId) {
                        console.log('Found userId in JWT payload:', payload.userId);
                        return payload.userId;
                    }
                } catch (e) {
                    console.log('Error decoding JWT, might be a different format:', e);
                    // Continue to other methods
                }
            }
            
            // If it's a Google Firebase token, try to validate it with our backend
            try {
                console.log('Trying to validate token with backend...');
                const response = await axios.post('http://localhost:5001/api/login/validate-token', { token });
                if (response.data && response.data.userId) {
                    console.log('Backend validated token, userId:', response.data.userId);
                    // Store for future use
                    localStorage.setItem('userId', response.data.userId);
                    return response.data.userId;
                }
            } catch (e) {
                console.log('Backend token validation failed:', e);
                // Continue to other methods
            }
            
            // Try to get user info from Google token
            try {
                console.log('Trying to get user info from Google token...');
                // This is a workaround - we're using the token to get the user's email
                // and then using that to find the user in our database
                const googleUserResponse = await axios.get('http://localhost:5001/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (googleUserResponse.data && googleUserResponse.data.length > 0) {
                    // Find the first user that matches the email from the token
                    // This is not ideal but might work as a fallback
                    console.log('Found users, trying to match with token info');
                    return googleUserResponse.data[0]._id;
                }
            } catch (e) {
                console.log('Failed to get user info from Google token:', e);
                // Continue to other methods
            }
            
            // If we can't get userId from token, check if token itself might be the userId
            if (token.length === 24 || token.length === 36) {  // MongoDB ObjectId or UUID length
                console.log('Using token as userId (might be direct ID)');
                return token;
            }
            
            throw new Error('Could not extract user ID from available data');
        } catch (error) {
            console.error('Error getting user ID:', error);
            throw error;
        }
    };



    return(
        <div className='fixed p-1 left-1/2 -translate-x-1/2 bg-gray-700 bottom-0 w-[70%] h-10 rounded-t-lg flex flex-row justify-center items-center'>

         <div className=' w-[100%] md:w-[60%] flex flex-row gap-1.5 justify-between items-center'>
            <img src={"/img/home.svg"} width={35} height={35} className='hover:scale-105' onClick={() => navigate('/home')}/>
            <img src={"/img/auction.svg"} width={35} height={35} className='hover:scale-105' onClick={() => navigate('/auction')}/>
            <img src={"/img/plus.svg"} width={30} height={30} className='hover:scale-105' onClick={async () => {
              const isLoggedIn = await Checklogin();
                if (isLoggedIn) {
                  navigate('/post');
                } else {
                  navigate('/login');
                }
              }}/>
            <img src={"/img/search.svg"} width={35} height={35} className='hover:scale-105' onClick={async () => {
              const isLoggedIn = await Checklogin();
                if (isLoggedIn) {
                  navigate('/profile');
                } else {
                  navigate('/login');
                }
              }}/>
            <img src={"/img/profile.svg"} width={30} height={30} className='hover:scale-105' 
              onClick={async () => {
              const isLoggedIn = await Checklogin();
                if (isLoggedIn) {
                  navigate('/profile');
                } else {
                  navigate('/login');
                }
              }}/>
          {/*   <a href="https://iconscout.com/icons/auction" class="text-underline font-size-sm" target="_blank">Auction</a> by <a href="https://iconscout.com/contributors/jemismali" class="text-underline font-size-sm" target="_blank">Jemis Mali</a> */}
         </div>       
        </div>
    )
}