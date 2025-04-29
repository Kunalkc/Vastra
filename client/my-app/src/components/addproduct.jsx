import react from "react"
import axios from "axios"
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Bottombar from "./Bottombar";



export default function createProduct(){

    const [file , setfile] = react.useState(null)  // to upload a particular image to backend
    const [layout , savelayout] = react.useState([])  // in order to save the layout once the user is done arranging
    const [imageURL , setimgurl] = react.useState('') // when the backend sends back url of image after cloudinary upload we shall save it here for time being before sending product data back
    const  [usertext, settext ] = react.useState('')  // we shall save the text entered by user here for time being before sending product data back

    const [fileselector, flip] = react.useState(false)

    const uploadImage = async () => {

        const formData = new FormData();
        formData.append('image', file);
    
        const res = await axios.post('/api/upload-image', formData);
        setimgurl(res.data.url); // Set Cloudinary URL to imageURL
    };

    const addtext = async () => {

        
    }
    console.log(file)

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
    const openFileselecter = () =>{
      console.log('flip called')
      flip((prev) => !prev)
    }
    const openTextbox = () =>{

    }

    //this would close the fileselector when a file is chosen
    const filechooser = (e) =>{
        openFileselecter()
         setfile(e.target.files[0])
    }
    return(
        <div className="w-screen h-screen bg-[#a69c9c]">

            <div className="fixed bottom-10 left-1/2 drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex flex-row gap-5 bg-cyan-100 w-auto self-end rounded-xl px-1">


               <button onClick={openFileselecter} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">Add image</button>
               <button onClick={openTextbox} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg" > Add text</button>
               <button onClick={saveProduct} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Post</button>
               
            </div>

           {fileselector ? <></> : <input
            type="file"
            onChange={filechooser}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border p-2 rounded-lg bg-cyan-100"
          />}          
  
          
        {/* looping over layout state to check new items and add them appropriately on the screen */}    
        {layout.map((item) => (
          <Draggable
            key={item.id}
            defaultPosition={{ x: item.left, y: item.top }}
            onStop={(e, data) => handlePositionChange(e, data, item.id)}
          >
            <div className="absolute top-0 left-0">
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
                    src={item.url}
                    alt="layout"
                    className="w-full h-full object-cover rounded shadow"
                  />
                ) : (
                  <div className="w-full h-full bg-white text-black p-2 border border-gray-400 rounded shadow overflow-auto">
                    {item.text}
                  </div>
                )}
              </ResizableBox>
            </div>
          </Draggable>
        ))}
  
            

            <Bottombar/>
        </div>
    )
}