import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowingList = (props) => {
    const [following, setFollowing] = useState([]);

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

    return (
        <div>
            {following.map((following) => (
                <div key={follower._id} className='flex flex-row gap-4 justify-center items-center'>
                    <img src= {`${following.profilepicurl}`}
                         className='rounded-lg object-cover'
                    />
                    {follower.name}
                    </div>
            ))}
        </div>
    );
};

export default FollowingList;