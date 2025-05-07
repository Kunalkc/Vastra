import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowersList = (props) => {
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const getFollowers = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/users/followers/${props.userId}`);
                setFollowers(res.data); // assuming res.data is the array

                console.log("successfull hohaahahha" ,followers)
            } catch (error) {
                console.error('Error getting followers', error);
            }
        };

        getFollowers();
    }, [props.userId]);

    return (
        <div>
        {followers.map((follower) => (
            <div key={follower._id} className='flex flex-row gap-4 justify-center items-center'>
                <img src= {`${follower.profilepicurl}`}
                     className='rounded-lg object-cover'
                />
                {follower.name}
                </div>
        ))}
    </div>
    );
};

export default FollowersList;