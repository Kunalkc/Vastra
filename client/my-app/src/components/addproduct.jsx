import React from "react"
import axios from "axios"
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Bottombar from "./Bottombar";
import { useNavigate } from 'react-router-dom'



export default function CreateProduct(){

    const [file , setfile] = React.useState(null)  // to upload a particular image to backend
    const [layout , savelayout] = React.useState([])  // in order to save the layout once the user is done arranging
    const [imageURL , setimgurl] = React.useState('') // when the backend sends back url of image after cloudinary upload we shall save it here for time being before sending product data back
    const [usertext, settext ] = React.useState('')  // we shall save the text entered by user here for time being before sending product data back

    const [fileselector, flip] = React.useState(false)
    const [textreciever , fliptext] = React.useState(false)
    const [postmaker , flippost] = React.useState(false)
 
    const [bgColor, setBgColor] = React.useState('#a69c9c');  // state to store the bg color in set to #a69c9c by default

    //in order to store the values user selected values for these
    const [font, setFont] = React.useState("Arial");
    const [textColor, setTextColor] = React.useState("#000000");
    const [zIndex, setZIndex] = React.useState(1);
    const [fontSize, setSize] = React.useState(10)

    const [imgzindex , setzimg] = React.useState(0)


    //Product information 
    const [title , setTitle]  = React.useState('')
    const [description, setDescription] = React.useState('')
    const [forsale , setforsale] = React.useState(false)
    const [thumbnail , setthumbnail] = React.useState(null)
    const [thumbnailurl , seturlthumb] = React.useState('')

     const navigate = useNavigate()

    // to get the userID of current user logged in
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

    // getting the updated position from the draggable and adding it to the layout data structure
    const handlePositionChange = (e, data, id) => {
      console.log("position change called")
      console.log(data)
        savelayout((prev) =>
          prev.map((item) => (item.id === id ? { ...item, x: data.x, y: data.y } : item))
        );
    };

    React.useEffect(() => {
      console.log("Updated layout:", layout);
    }, [layout]);
    
    // getting the updated size from the resizable and saving it in the layout data structure
    const handleResize = (id, size) => {
        savelayout((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, width: size.width, height: size.height } : item
          )
        );
      };

    const saveProduct = async () => {
        // here we need to send the images from the layout variable and send them to backend to upload and then replace the img file with the imgurls from cloudinary and then add the product to DB
        console.log('post the product called ')

        let userId;
        try {
            userId = await getUserId();
            console.log('Using userId:', userId);
        } catch (error) {
            console.error('Failed to get userId:', error);
            navigate('/login');
            return;
        }

        const userResponse = await axios.get(`http://localhost:5001/api/users/${userId}`);
        console.log('User data:', userResponse.data);
        //we are first going to obtain updatedlayout array and then save it as it is in backend with the other product details

        try {
          const updatedLayout = await Promise.all(
            layout.map(async (item) => {
              if (item.type === 'image') {
                const fileBlob = await fetch(item.img).then(r => r.blob());
                const file = new File([fileBlob], `image_${item.id}.png`, { type: fileBlob.type });
      
                const formData = new FormData();
                formData.append('image', file);
      
                console.log('sending request to upload')
                console.log(formData)

                const res = await axios.post('http://localhost:5001/api/imageupload', formData);

                console.log('request to upload sent')
                console.log(res.data.url)
                return { ...item,  url: res.data.url };
              } else {
                return item;
              }
            })
          );
        
          

          const formData1 = new FormData();
          formData1.append('image', thumbnail); 
          console.log('sending request to upload')
          const res = await axios.post('http://localhost:5001/api/imageupload', formData1);
          const thumbnailurl = res.data.url

         

          console.log(updatedLayout)
          console.log("thumbnailurl is: " , thumbnailurl)

        await axios.post('http://localhost:5001/api/products', {
          theme: bgColor,
          layout: updatedLayout,
          ownerID: userResponse.data.email,
          description: description ,
          Title: title,
          thumbnailurl:  thumbnailurl
        });
    
        alert("Product saved successfully!");
      } catch (err) {
        console.error("Failed to post product", err);
      }
    }

    // these two functions toggle whether file selector and text reciever are open or not 
    const openFileselecter = () =>{
      console.log('flip called')
      flip((prev) => !prev)
      fliptext(false)
      flippost(false)
    }
    const toggletext = () =>{
      console.log('text flip called')
      fliptext((prev) => !prev)
      flip(false)
      flippost(false)
    }

    const togglepost = ()=>{
      flippost(prev=>(!prev))
      flip(false)
      fliptext(false)
    }
      
    const insertimage = () => {
        const newItem = {
            id: Date.now()-Math.floor(Math.random() * 100000),  // Unique ID
            type: 'image',   // We will support text as well later
            img:  URL.createObjectURL(file),
            alt: 'product image',
            x:   100,      // Default position
            y: 100,
            width: 200,      // Default width
            height: 200,     // Default height
            zIndex:  imgzindex ,
          };
          flip(false) // close selector
          savelayout((prevLayout) => [...prevLayout, newItem]);
    }


    const inserttext = () => {
        const newtext = {
            id : Date.now()-Math.floor(Math.random() * 100000),  // adding unique id so that we can delete the element later
            type: 'text',
            content: usertext,
            x: 100,      // Default position
            y: 100,
            width: 200,      // Default width
            height: 200,     // Default height
            fontSize: fontSize,
            zIndex: zIndex  , 
            fontFamily: font,
            textColor: textColor
        }
        settext('')
        fliptext(false) // close the selector
        savelayout((prevLayout) => [...prevLayout, newtext])
    }


    const deleteelement = (ID) => {
      savelayout((prevLayout) => prevLayout.filter((item) => item.id !== ID))
    }
    

    

    return(
        <div className="w-screen h-screen overflow-auto" style={{ backgroundColor: bgColor }}>

    <div className="relative min-h-[200vh] w-full">
            <div className="fixed bottom-10 left-1/2 drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex flex-row gap-5 bg-cyan-50 w-auto self-end rounded-xl px-1">

            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10  cursor-pointer"
            />
               <button onClick={openFileselecter} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">Add image</button>
               <button onClick={toggletext} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg" > Add text</button>
               <button onClick={togglepost} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Next</button>
               
            </div>

   {/* container to take in user text  */}
           {
            textreciever ? 
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  w-[70%] flex flex-col gap-2 z-10000">
            <div className="flex flex-row gap-3">
            <input
             type="text"
             value={usertext}
             onChange={(e)=>settext(e.target.value)}  // sets what user types in out usertext statefield
             className="border p-2 rounded-lg bg-cyan-50 w-[100%] z-100"
             />
            <button onClick={inserttext} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">insert</button>
            </div>
            
            <div className="flex flex-row gap-8">
            <label className="flex flex-row items-center gap-2">
            <span className="mb-1 text-sm font-medium">Font</span>
              <select
                onChange={(e) => setFont(e.target.value)}
                className="p-2 rounded bg-white"
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </label>

            <label className="flex flex-row items-center gap-2">
            <span className="text-sm font-medium">Text Color</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </label>

            <label className="flex flex-row items-center gap-2">
            <span className="mb-1 text-sm font-medium">Z-Index</span>
              <input
                type="number"
                min={0}
                max={999}
                placeholder="z-index"
                value={zIndex}
                onChange={(e) => setZIndex(Number(e.target.value))}
                className="w-16 p-2 rounded"
              />
            </label>

            <label className="flex flex-row items-center gap-2">
            <span className="mb-1 text-sm font-medium">Font Size</span>
              <input
                type="number"
                min={0}
                max={999}
                placeholder="fontsize"
                value={fontSize}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-16 p-2 rounded"
              />
            </label>
            </div>
            
            
            </div>
             : <></>
           }

 {/*  interface to select the image */}     

           {fileselector ? 

           <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10000">

           <div className="flex flex-row gap-3">
           <input
            type="file"
            onChange={(e) =>{setfile(e.target.files[0]) } }  // saves the file user selects in the file state field
            className=" border p-2 rounded-lg bg-cyan-50 z-100"
          /> 
          <button onClick={insertimage} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">insert</button>
          </div>

          <div>
          <label className="flex flex-row items-center gap-2">
            <span className="mb-1 text-sm font-medium">Z-Index</span>
              <input
                type="number"
                min={0}
                max={999}
                placeholder="z-index"
                value={imgzindex}
                onChange={(e) => setzimg(Number(e.target.value))}
                className="w-16 p-2 rounded"
              />
            </label>
          </div>
          </div>
          : <></>}          
  
        { postmaker ? <div className="fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[70%] h-[70%] bg-gray-800 z-10000 rounded-xl flex flex-col justify-center items-center gap-5">
            
          <label className="w-full flex flex-col items-center gap-2">
          <span className="mb-1 text-sm font-medium text-cyan-100">Title</span>    
          <input
             type="text"
             value={title}
             onChange={(e)=>setTitle(e.target.value)}  // sets what user types in out usertext statefield
             className="border p-2 rounded-lg bg-cyan-50 w-[60%] z-100"
             />  

         </label>   

        <label className="w-full flex flex-col items-center gap-2">
        <span className="mb-1 text-sm font-medium text-cyan-100">Description</span>
          <input
             type="text"
             value={description}
             onChange={(e)=>setDescription(e.target.value)}  // sets what user types in out usertext statefield
             className="border p-2 rounded-lg bg-cyan-50 w-[60%] z-100"
             />  
        </label>
 
        <label className="flex flex-col items-center gap-2">
        <span className="mb-1 text-sm font-medium text-cyan-100">Select Thumbnail</span>
         <input
            type="file"
            onChange={(e) =>{setthumbnail(e.target.files[0]) } }  // saves the file user selects in the file state field
            className=" border p-2 rounded-lg bg-cyan-50 z-100"
           /> 
        </label>
  
        <button onClick={saveProduct} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Post</button>
        
        <img src={"/img/cross.svg"} width={30} height={30} className='absolute top-2.5 right-2.5 hover:scale-105' onClick={()=>flippost(false)} />
       {/*  <label className="flex flex-row items-center gap-2">
        <span className="mb-1 text-sm font-medium text-cyan-100">for sale</span>
        <input
            type="radio"

        />
        </label> */}

        </div> : <></>

        }
        
          
        {/* looping over layout state to check new items and add them appropriately on the screen */}    
        {layout.map((item) => {
        
        const nodeRef = React.createRef();

          
          return(
            <Draggable
              key={item.id}
              nodeRef={nodeRef}
              defaultPosition={{ x: item.x, y: item.y }}
              cancel=".resize-handle"
              onStop={(e, data) => handlePositionChange(e, data, item.id)}
            >
              <div ref={nodeRef} className="absolute group overflow-visible top-0 left-0">
                <ResizableBox
                  width={item.width}
                  height={item.height}
                  minConstraints={[50, 50]}
                  maxConstraints={[1200, 1200]}
                  draggableOpts={{grid: [25, 25]}}
                  resizeHandles={['se']} // southeast handle (bottom-right)
                  handle={
                    <span
                      className="absolute resize-handle bottom-0 right-0 w-2 h-2 bg-gray-700 cursor-se-resize z-50"
                    />
                  }
                  onResizeStop={(e, data) =>
                    handleResize(item.id, {
                      width: data.size.width,
                      height: data.size.height,
                    })
                  }
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.img}
                      alt="layout"
                      className="w-full h-full object-cover rounded shadow pointer-events-none z-9"
                      style={{
                        zIndex: item.zIndex,
                      }}
                    />
                  ) : (
                    <div className="w-auto h-auto text-black p-2 bg-transparent whitespace-pre-wrap wrap-break-word shadow overflow-visible"
                         style={{
                           color: item.textColor,
                           fontFamily: item.fontfamily,
                           fontSize: `${item.fontSize}px`,
                           zIndex: item.zIndex,
                         }}
                    >
                      {item.content}
                    </div>
                  )}
                </ResizableBox>
                <img src={"/public/img/delete.svg"} width={35} height={35} className='absolute bottom-0 left-0 hidden group-hover:block scale-75 hover:scale-105' onClick={()=>deleteelement(item.id)}/>
              </div>
             
            </Draggable>
          )
    
        })}
  </div>
            

            <Bottombar/>
        </div>
    )
}

