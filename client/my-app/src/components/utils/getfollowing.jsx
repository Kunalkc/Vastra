import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowingList = (props) => {
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getFollowing = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/users/following/${props.userId}`);
                setFollowing(res.data); // assuming res.data is the array
            } catch (error) {
                console.error('Error getting following', error);
            }
        };

        getFollowing();
    }, [props.userId]);

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
                        alt={user.name || 'Following'}
                    />
                    {user.name}
                </div>
            ))}
        </div>
    );
};

export default FollowingList;