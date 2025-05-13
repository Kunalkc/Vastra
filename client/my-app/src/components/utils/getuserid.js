import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const getUserId = async () => {
    
    try {
        // First try to get userId directly from localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
            console.log('Found userId directly in localStorage:', userId);
            return userId;
        }

        // If not available, try to decode the token
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        console.log('Token found:', token.substring(0, 20) + '...');

        // Check if it's a standard JWT
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
                console.log('Error decoding JWT:', e);
            }
        }

        // Try backend validation
        try {
            console.log('Validating token with backend...');
            const response = await axios.post('http://localhost:5001/api/login/validate-token', { token });
            if (response.data?.userId) {
                console.log('Backend validated token, userId:', response.data.userId);
                localStorage.setItem('userId', response.data.userId);
                return response.data.userId;
            }
        } catch (e) {
            console.log('Backend validation failed:', e);
        }

        // Try fetching user info using token
        try {
            console.log('Fetching user info from Google token...');
            const googleUserResponse = await axios.get('http://localhost:5001/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (googleUserResponse.data?.length > 0) {
                console.log('Found users, using first match');
                return googleUserResponse.data[0]._id;
            }
        } catch (e) {
            console.log('Google token user fetch failed:', e);
        }

        // Use token as ID fallback
        if (token.length === 24 || token.length === 36) {
            console.log('Using token as userId');
            return token;
        }

        throw new Error('Could not extract user ID');
    } catch (error) {
        console.error('Error getting user ID:', error);
        throw error;
    }
};

export default getUserId;