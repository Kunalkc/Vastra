import React from "react"
import axios from "axios"
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Bottombar from "./Bottombar";



export default function CreateProduct(){

    const [file , setfile] = React.useState(null)  // to upload a particular image to backend
    const [layout , savelayout] = React.useState([])  // in order to save the layout once the user is done arranging
    const [imageURL , setimgurl] = React.useState('') // when the backend sends back url of image after cloudinary upload we shall save it here for time being before sending product data back
    const [usertext, settext ] = React.useState('')  // we shall save the text entered by user here for time being before sending product data back

    const [fileselector, flip] = React.useState(false)
    const [textreciever , fliptext] = React.useState(false)
 
    const [bgColor, setBgColor] = React.useState('#a69c9c');  // state to store the bg color in set to #a69c9c by default

    //in order to store the values user selected values for these
    const [font, setFont] = React.useState("Arial");
    const [textColor, setTextColor] = React.useState("#000000");
    const [zIndex, setZIndex] = React.useState(1);
    const [fontSize, setSize] = React.useState(10)

    const [imgzindex , setzimg] = React.useState(0)

    const uploadImage = async () => {

        const formData = new FormData();
        formData.append('image', file);
    
        const res = await axios.post('/api/upload-image', formData);
        setimgurl(res.data.url); // Set Cloudinary URL to imageURL
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
        
          console.log(updatedLayout)

        await axios.post('http://localhost:5001/api/products', {
          theme: bgColor,
          layout: updatedLayout,
          ownerID: "kunalchandel09@gmail.com",
          description: 'A new product' ,
          Title: 'New product'
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
    }
    const toggletext = () =>{
      console.log('text flip called')
      fliptext((prev) => !prev)
      flip(false)
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
               <button onClick={saveProduct} className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Post</button>
               
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

