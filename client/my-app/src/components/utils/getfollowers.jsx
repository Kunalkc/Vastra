import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowersList = (props) => {
    const [followers, setFollowers] = useState([]);
    const navigate = useNavigate();
    const [response , setresponse] = useState([])

    useEffect(() => {
        const getFollowers = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/users/followers/${props.userId}`);
                setresponse(res.data); // assuming res.data is the array
            } catch (error) {
                console.error('Error getting followers', error);
            }
        };

        getFollowers();
    }, [props.userId]);


    useEffect(() => {
        const fetchFollowingUsers = async () => {
            try {
                const fetchedUsers = [];
    
                for (const entry of response) {
                    const res = await axios.get(`http://localhost:5001/api/users/${entry.id}`);
                    fetchedUsers.push(res.data);
                }
    
                setFollowers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching following user info:', error);
            }
        };
    
        if (response.length > 0) {
            fetchFollowingUsers();
        }

    }, [response])

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
        // Close the modal if there's a close function passed as prop
        if (props.onClose) {
            props.onClose();
        }
    };

    return (
        <div>
        {followers.map((follower) => (
            <div 
                key={follower._id} 
                className='flex flex-row gap-4 justify-center items-center p-2 hover:bg-gray-600 cursor-pointer'
                onClick={() => handleUserClick(follower._id)}
            >
                <img 
                        src={`${follower.profilePicture}`}
                        className='rounded-lg object-cover w-10 h-10'
                        alt={ 'image'}
                        width={30}
                        height={30}
                    />
                {follower.username}
            </div>
        ))}
    </div>
    );
};

export default FollowersList;