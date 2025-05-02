import React from "react"
import axios from "axios"
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Bottombar from "./Bottombar";



export default function createProduct(){

    const [file , setfile] = React.useState(null)  // to upload a particular image to backend
    const [layout , savelayout] = React.useState([])  // in order to save the layout once the user is done arranging
    const [imageURL , setimgurl] = React.useState('') // when the backend sends back url of image after cloudinary upload we shall save it here for time being before sending product data back
    const [usertext, settext ] = React.useState('')  // we shall save the text entered by user here for time being before sending product data back

    const [fileselector, flip] = React.useState(false)
    const [textreciever , fliptext] = React.useState(false)





    const uploadImage = async () => {

        const formData = new FormData();
        formData.append('image', file);
    
        const res = await axios.post('/api/upload-image', formData);
        setimgurl(res.data.url); // Set Cloudinary URL to imageURL
    };

    const addtext = async () => {

        
    }
    console.log(file)
    console.log(usertext)
    // getting the updated position from the draggable and adding it to the layout data structure
    const handlePositionChange = (e, data, id) => {
        savelayout((prev) =>
          prev.map((item) => (item.id === id ? { ...item, x: data.left, y: data.top } : item))
        );
    };
    
    // getting the updated size from the resizable and saving it in the layout data structure
    const handleResize = (id, size) => {
        savelayout((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, width: size.width, height: size.height } : item
          )
        );
      };

    // WHEN THE ITEM WILL BE PUSHED TO LAYOUT
    const addimgtolayout = () => {
        const newItem = {
          id: Date.now(),  // Unique ID
          type: 'image',   // We will support text as well later
          url: imageURL,
          alt: 'product image',
          top:   100,      // Default position
          left: 100,
          width: 200,      // Default width
          height: 200,     // Default height
        };
        savelayout((prevLayout) => [...prevLayout, newItem]);
    };

    const addtexttolayout = () =>{
        const newtext = {
            id: Date.now(),
            type: 'text',
            content: usertext,
            top:   100,      // Default position
            left: 100,
            width: 200,      // Default width
            height: 200,     // Default height
            fontSize: 10,
            textColor: "#000000"
        }

        savelayout((prevLayout) => [...prevLayout, newtext])
    }
    

    const saveProduct = () =>{

    }

    // these two functions toggle whether file selector and text reciever are open or not 
    const openFileselecter = () =>{
      console.log('flip called')
      flip((prev) => !prev)
      fliptext(false)
    }
    const toggletext = () =>{
      console.log('text flip called')
      fliptext((prev) => !prev)
      flip(false)
    }
   

    const posttheproduct = () => {

        // here we need to send the images from the layout variable and send them to backend to upload and then replace the img file with the imgurls from cloudinary and then add the product to DB
    }
   
   
    const insertimage = () => {
        const newItem = {
            id: Date.now(),  // Unique ID
            type: 'image',   // We will support text as well later
            img:  URL.createObjectURL(file),
            alt: 'product image',
            top:   100,      // Default position
            left: 100,
            width: 200,      // Default width
            height: 200,     // Default height
          };
          flip(false) // close selector
          savelayout((prevLayout) => [...prevLayout, newItem]);
    }


    const inserttext = () => {
        const newtext = {
            id: Date.now(),
            type: 'text',
            content: usertext,
            top:   100,      // Default position
            left: 100,
            width: 200,      // Default width
            height: 200,     // Default height
            fontSize: 10,
            textColor: "#000000"
        }
        settext('')
        fliptext(false) // close the selector
        savelayout((prevLayout) => [...prevLayout, newtext])
    }

    

    return(
        <div className="w-screen h-screen overflow-auto bg-[#a69c9c]">

    <div className="relative min-h-[200vh] w-full">
            <div className="fixed bottom-10 left-1/2 drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex flex-row gap-5 bg-cyan-50 w-auto self-end rounded-xl px-1">


               <button onClick={openFileselecter} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">Add image</button>
               <button onClick={toggletext} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg" > Add text</button>
               <button onClick={saveProduct} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Post</button>
               
            </div>

           {
            textreciever ? 
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-3 w-[70%]">
            <input
             type="text"
             value={usertext}
             onChange={(e)=>settext(e.target.value)}  // sets what user types in out usertext statefield
             className="border p-2 rounded-lg bg-cyan-50 w-[100%]"
             />
            <button onClick={inserttext} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">insert</button>
            </div>
             : <></>
           }
            
           {fileselector ? 
           <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-3">
           <input
            type="file"
            onChange={(e) =>{setfile(e.target.files[0]) } }  // saves the file user selects in the file state field
            className=" border p-2 rounded-lg bg-cyan-50"
          /> 
          <button onClick={insertimage} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">insert</button>
          </div>
          : <></>}          
  
          
        {/* looping over layout state to check new items and add them appropriately on the screen */}    
        {layout.map((item) => {
        
        const nodeRef = React.createRef();

          
          return(
            <Draggable
              key={item.id}
              nodeRef={nodeRef}
              defaultPosition={{ x: item.left, y: item.top }}
              onStop={(e, data) => handlePositionChange(e, data, item.id)}
            >
              <div ref={nodeRef} className="absolute overflow-visible top-0 left-0">
                <ResizableBox
                  width={item.width}
                  height={item.height}
                  minConstraints={[50, 50]}
                  maxConstraints={[600, 600]}
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
                      className="w-full h-full object-cover rounded shadow"
                    />
                  ) : (
                    <div className="w-auto h-auto text-black p-2 bg-transparent whitespace-pre-wrap wrap-break-word shadow overflow-visible">
                      {item.content}
                    </div>
                  )}
                </ResizableBox>
              </div>
            </Draggable>
          )
    
        })}
  </div>
            

            <Bottombar/>
        </div>
    )
}