import React from "react";
import axios from "axios";

export default function titleTile(props){

    const user = props.user


    return(
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                        <div className="flex items-center">
                            {user.profilePicture?.url ? (
                                <img 
                                    src={user.profilePicture.url} 
                                    alt="Profile" 
                                    className="w-16 h-16 rounded-full mr-4 object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                                    <span className="text-2xl text-gray-600">
                                        {user.firstName?.charAt(0) || user.username?.charAt(0) || '?'}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex-1">

                                <div className='flex flex-row gap-2 items-center justify-between'>

                                    <h2 className="text-2xl font-semibold">
                                        {user.firstName && user.lastName 
                                            ? `${user.firstName} ${user.lastName}` 
                                            : user.username}
                                    </h2>

                                    <div className="flex flex-col gap-5">
                                          <div className='flex flex-row gap-5'>  
                                                <h2 onClick={()=>props.openfollowinglist(true)} className='flex flex-row gap-1.5 text-xl opacity-50 hover:opacity-100'>
                                                    Following: {user.following.length}
                                                </h2>
                                                <h2 onClick={()=>props.openfollowerslist(true)} className='flex flex-row gap-1.5 text-xl opacity-50 hover:opacity-100'>
                                                    Followers: {user.followers.length}
                                                </h2>
                                           </div>
                                      {props.selfprofile ?  <button className="bg-gray-600 text-cyan-100 rounded-lg hover:scale-103">Edit Profile</button>   
                                         : props.follow ? (  <button onClick={props.iwanttounfollow} className="bg-gray-300 text-black rounded-lg hover:scale-103">Unfollow</button>)
                                         : (<button onClick={props.iwanttofollow} className="bg-gray-600 text-cyan-100 rounded-lg hover:scale-103">Follow</button>)
                                        }
                                   </div>
                                </div>

                               

                            </div>
                        </div>
                    </div>
    )
}