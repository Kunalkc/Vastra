import react from "react"
import axios from "axios"
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Bottombar from "./Bottombar";



export default function createProduct(){

    return(
        <div className="w-screen h-screen bg-[#a69c9c]">

            <div className="fixed bottom-10 left-1/2 drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex flex-row gap-5 bg-cyan-100 w-auto self-end rounded-xl px-1">
               <button className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg">Add image</button>
               <button className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg" > Add text</button>
               <button className="w-auto h-10 bg-gray-700 px-3 text-cyan-100 rounded-xl hover:scale-105 drop-shadow-lg"> Post</button>
               
            </div>
            <Bottombar/>
        </div>
    )
}