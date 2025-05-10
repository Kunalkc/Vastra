import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowersList = (props) => {
    const [followers, setFollowers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getFollowers = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/users/followers/${props.userId}`);
                setFollowers(res.data); // assuming res.data is the array
            } catch (error) {
                console.error('Error getting followers', error);
            }
        };

        getFollowers();
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
        {followers.map((follower) => (
            <div 
                key={follower._id} 
                className='flex flex-row gap-4 justify-center items-center p-2 hover:bg-gray-600 cursor-pointer'
                onClick={() => handleUserClick(follower._id)}
            >
                <img 
                    src={`${follower.profilepicurl}`}
                    className='rounded-lg object-cover w-10 h-10'
                    alt={follower.name || 'Follower'}
                />
                {follower.name}
            </div>
        ))}
    </div>
    );
};

export default FollowersList;