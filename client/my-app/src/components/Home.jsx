import react from 'react'
import { useState } from 'react'

export default function Home(){

    const [id , changeid] = useState('')

    return(
        <div>
           <p>this is Home page</p>
        </div>
    )
}