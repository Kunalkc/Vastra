import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowingList = (props) => {
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();
    const [response , setresponse] = useState([])
    console.log(following)

    useEffect(() => {
        const getFollowing = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/users/following/${props.userId}`);
                setresponse(res.data); // assuming res.data is the array
            } catch (error) {
                console.error('Error getting following', error);
            }
        };

        getFollowing();
    }, [props.userId]);

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            try {
                const fetchedUsers = [];
    
                for (const entry of response) {
                    const res = await axios.get(`http://localhost:5001/api/users/${entry.id}`);
                    fetchedUsers.push(res.data);
                }
    
                setFollowing(fetchedUsers);
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
            {following.map((user) => (
                <div 
                    key={user._id} 
                    className='flex flex-row gap-4 justify-center items-center p-2 hover:bg-gray-600 cursor-pointer'
                    onClick={() => handleUserClick(user._id)}
                >
                    <img 
                        src={`${user.profilepicurl}`}
                        className='rounded-lg object-cover w-10 h-10'
                        alt={ 'image'}
                        width={30}
                        height={30}
                    />
                    {user.username}
                </div>
            ))}
        </div>
    );
};

export default FollowingList;