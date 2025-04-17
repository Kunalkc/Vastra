const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes  = require('./routes/users.routes')

app.use(express.json())
app.use('/api/users', userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/vastra").then(()=> console.log("MongoDB connected")).catch(err => console.error(err))

app.get('/', (req,res)=>{
    res.send('backend running');
})

app.get('/about', (req,res)=>{
    res.contentType('text/html')
    res.send('<h1>ABOUT PAGE</h1>')
})

app.listen(5001 , ()=>{
    console.log("server running on port 5001")
})