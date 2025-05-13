import React from "react";
import axios from "axios";

export default function titleTile(props){

    const user = props.user
    const [openeditprofile , toggleeditor] = React.useState(false)
    const [firstName, setfname]       = React.useState('')
    const [lastName,setlname]   = React.useState('')
    const [phoneNumber , setph]   = React.useState()
    const [profilePicture, setpp]    = React.useState()

    const updateProfile = async () => {

        try{

            let picurl
            if(profilePicture){
            const formData = new FormData();
            formData.append('image', profilePicture);
    
            const res = await axios.post('http://localhost:5001/api/imageupload', formData);
             picurl = res.data.url
            console.log(res.data.url)
        }

            const res1 = await axios.put(`http://localhost:5001/api/users/${user._id}`,{
                firstName : firstName,
                lastName : lastName,
                phoneNumber : phoneNumber,
                profilePicture : picurl
            })

          alert("profile updated successfully")
        }catch(err){
            console.error("update failed" , err)
        }
     
    }

    return(
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
           {openeditprofile ? <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[70vw] h-[70vh] bg-gray-800 z-1000 flex flex-col gap-4 justify-center items-center">
            
            <img src={"/img/cross.svg"} width={30} height={30} className='absolute top-2.5 right-2.5 hover:scale-105' onClick={()=>toggleeditor(false)} />
          
            <label className="flex flex-col items-center gap-2">
                 <span className="mb-1 text-sm font-medium text-cyan-100">First Name</span>
                 <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>{setfname(e.target.value) } }  // saves the file user selects in the file state field
                    className=" border p-2 rounded-lg bg-cyan-50 z-100"
                   /> 
            </label>

            <label className="flex flex-col items-center gap-2">
                 <span className="mb-1 text-sm font-medium text-cyan-100">Last Name</span>
                 <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>{setlname(e.target.value) } }  // saves the file user selects in the file state field
                    className=" border p-2 rounded-lg bg-cyan-50 z-100"
                   /> 
            </label>

            <label className="flex flex-col items-center gap-2">
                 <span className="mb-1 text-sm font-medium text-cyan-100">Phone Number</span>
                 <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>{setph(e.target.value) } }  // saves the file user selects in the file state field
                    className=" border p-2 rounded-lg bg-cyan-50 z-100"
                   /> 
            </label>

            <label className="flex flex-col items-center gap-2">
                 <span className="mb-1 text-sm font-medium text-cyan-100">upload profile pic</span>
                 <input
                    type="file"
                    onChange={(e) =>{setpp(e.target.files[0]) } }   // saves the file user selects in the file state field
                    className=" border p-2 rounded-lg bg-cyan-50 z-100"
                   /> 
            </label>

            <button onClick={updateProfile} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Update</button>
         
            </div> : <></>}


                        <div className="flex items-center">
                            {user.profilePicture ? (
                                <img 
                                    src={user.profilePicture} 
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
                                      {props.selfprofile ?  <button onClick={()=>toggleeditor(prev => !prev)} className="bg-gray-600 text-cyan-100 rounded-lg hover:scale-103">Edit Profile</button>   
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